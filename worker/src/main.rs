use std::env;

use dotenv::dotenv;
use tokio_postgres::{Error, NoTls};

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
    let companies = client.query(r#"SELECT * FROM "Company""#, &[]).await?;

    println!("{}", companies.len());

    Ok(())
}
