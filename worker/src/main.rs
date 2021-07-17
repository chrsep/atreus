use std::env;

use dotenv::dotenv;
use tokio_postgres::{Error, NoTls};

mod amass;

#[tokio::main]
async fn main() -> Result<(), Error> {
    dotenv().ok();

    let db_url = env::var("DATABASE_URL").expect("DATABASE_URL cannot be empty");

    let (client, connection) = tokio_postgres::connect(&db_url, NoTls).await?;

    tokio::spawn(async move {
        if let Err(e) = connection.await {
            eprintln!("connection error: {}", e);
        }
    });

    // language=PostgreSQL
    // let Domains = client.query(r#"SELECT * FROM "Scope""#, &[]).await?;

    // println!("{}", Domains.len());

    // for domain in Domains {
    //     amass::enumerate(domain.get(""));
    // }

    Ok(())
}
