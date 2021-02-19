#[macro_use]
extern crate diesel;
extern crate dotenv;
extern crate r2d2;

use crate::api::setup_api;
use actix_files as fs;
use actix_web::middleware::Logger;
use actix_web::{App, HttpServer};
use dotenv::dotenv;
use env_logger::Env;

mod api;
mod db;
mod models;
mod schema;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();

    let db_pool = db::connect();
    env_logger::Builder::from_env(Env::default().default_filter_or("info")).init();

    let server = HttpServer::new(move || {
        let api = setup_api();

        let dashboard = fs::Files::new("/", "dist")
            .show_files_listing()
            .index_file("index.html");

        App::new()
            .data(db_pool.clone())
            .wrap(Logger::default())
            .wrap(Logger::new("%a %{User-Agent}i"))
            .service(api)
            .service(dashboard)
    });

    server.bind("0.0.0.0:8080")?.run().await
}
