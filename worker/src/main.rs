use crate::postgres::DB;
use dotenv::dotenv;

mod amass;
mod postgres;

#[tokio::main]
async fn main() -> Result<(), ()> {
    env_logger::init();
    dotenv().ok();

    let db = postgres::connect().await;
    find_other_root_domains(&db).await;

    let root_domains = db.find_confirmed_domain().await;
    for domain in root_domains {
        let subdomains = amass::enumerate(&domain.domain);
        for subdomain in subdomains {
            db.insert_subdomain(&subdomain).await
        }
    }

    Ok(())
}

async fn find_other_root_domains(db: &DB) {
    let root_domains = db.find_confirmed_domain().await;
    for domain in root_domains {
        let new_domains = amass::intel(&domain.domain);
        db.bulk_insert_root_domain(new_domains, domain.companyId)
            .await;
    }
}
