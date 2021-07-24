use dotenv::dotenv;

mod amass;
mod postgres;

#[tokio::main]
async fn main() -> Result<(), ()> {
    dotenv().ok();

    let db = postgres::connect().await;
    let root_domains = db.find_confirmed_domain().await;

    for domain in root_domains {
        let result = amass::intel(&domain.domain);
        let company_id = vec![domain.companyId; result.len()];
        db.insert_domain( result, company_id ).await;
    }

    Ok(())
}
