use log::info;
use std::thread;
use std::time::Duration;

use crate::postgres::DB;

mod amass;
mod postgres;

#[tokio::main]
async fn main() -> Result<(), ()> {
    load_env();
    env_logger::init();

    amass::generate_config();

    let db = postgres::connect().await;
    find_other_root_domains(&db).await;

    let root_domains = db.find_confirmed_domain().await;
    for domain in root_domains {
        let subdomains = amass::enumerate(&domain.domain);
        for subdomain in subdomains {
            db.insert_subdomain(&subdomain).await
        }
    }

    for n in 0..360 {
        info!("sleeping: running again in {}s", n * 10);
        thread::sleep(Duration::from_secs(10));
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

fn load_env() {
    dotenv::from_filename(".env.local").ok();
    dotenv::dotenv().ok();
}
