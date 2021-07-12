#[macro_use]
use std::env;

use dotenv::dotenv;
use tokio_postgres::{Error, NoTls};

#[tokio::main]
async fn main() -> Result<(), Error> {
    dotenv().ok();

    let db_url = env::var("DATABASE_URL").expect("DATABASE_URL cannot be empty");

    tokio_postgres::connect(&db_url, NoTls).await;

    Ok(())
}
