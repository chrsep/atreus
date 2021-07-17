use std::env;

use dotenv::dotenv;
use sqlx::postgres::PgPoolOptions;

mod amass;

#[tokio::main]
async fn main() -> Result<(), ()> {
    dotenv().ok();

    let db_url = env::var("DATABASE_URL").expect("DATABASE_URL cannot be empty");
    let pool = PgPoolOptions::new()
        .max_connections(2)
        .connect(&db_url)
        .await
        .expect("failed to connect to database");

    let root_domains = sqlx::query!(r#"SELECT * from "RootDomain" where confirmed"#)
        .fetch_all(&pool)
        .await
        .expect("failed to query root domains");

    for domain in root_domains {
        let result = amass::intel(&domain.domain);
        let company_id = vec![domain.companyId; result.len()];

        let result = sqlx::query!(
            r#"insert into "RootDomain" (domain, "companyId") SELECT * FROM UNNEST($1::text[], $2::int[]) ON CONFLICT DO NOTHING"#,
            &result,
            &company_id
        )
            .execute(&pool)
            .await;

        print!("{} {:?}", domain.domain, result);
    }

    Ok(())
}
