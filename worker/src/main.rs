mod amass;
mod postgres;
mod recon;

#[tokio::main]
async fn main() -> Result<(), ()> {
    setup_configs();
    let db = postgres::connect().await;
    let root_domains = db.find_confirmed_domain().await;

    recon::find_other_root_domains(&db, &root_domains).await;
    recon::find_subdomains(&db, &root_domains).await;

    Ok(())
}

fn setup_configs() {
    // load env
    dotenv::from_filename(".env.local").ok();
    dotenv::dotenv().ok();

    // setup logger
    env_logger::init();

    // setup tools config files
    amass::generate_config();
}
