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

    let root_domains = sqlx::query!(r#"SELECT * from "RootDomain""#)
        .fetch_all(&pool)
        .await
        .expect("failed to query root domains");

    for domain in root_domains {
        let result = amass::intel(domain.domain);
        print!("{:?}", result);
    }

    Ok(())
}
