use crate::postgres::DB;
use log::info;
use std::thread::sleep;
use std::time::Duration;

mod amass;
mod postgres;
mod recon;

#[tokio::main]
async fn main() -> Result<(), ()> {
    setup_configs();
    let db: &'static mut DB = Box::leak(Box::new(postgres::connect().await));

    loop {
        let root_domains = db.find_stale_confirmed_domain().await;
        if let Some(domain) = root_domains.first() {
            info!("recon: {} domains", root_domains.len());
            recon::run_recon(db, domain.clone()).await;
        }

        sleep(Duration::from_secs(5));
    }
}

fn setup_configs() {
    // load env
    dotenv::from_filename(".env.local").ok();
    dotenv::dotenv().ok();

    // setup logger
    env_logger::init();

    // setup tools config files
    // amass::generate_config();
}
