use dotenv::dotenv;

mod amass;
mod postgres;

#[tokio::main]
async fn main() -> Result<(), ()> {
    dotenv().ok();

    let db = postgres::connect().await;
    let root_domains = db.find_confirmed_domain().await;

    for domain in root_domains {
        let new_domains = amass::intel(&domain.domain);
        db.bulk_insert_root_domain(new_domains, domain.companyId)
            .await;
    }

    Ok(())
}
