#[macro_use]
extern crate diesel;
extern crate dotenv;
extern crate r2d2;

use crate::api::setup_api;
use actix_files as fs;
use actix_web::http::ContentEncoding;
use actix_web::middleware::errhandlers::{ErrorHandlerResponse, ErrorHandlers};
use actix_web::middleware::Logger;
use actix_web::{dev, http, middleware, web, App, HttpServer, Result};
use dotenv::dotenv;
use env_logger::Env;

mod api;
mod db;
mod models;
mod schema;

fn render_500<B>(mut res: dev::ServiceResponse<B>) -> Result<ErrorHandlerResponse<B>> {
    res.response_mut().headers_mut().insert(
        http::header::CONTENT_TYPE,
        http::HeaderValue::from_static("Error"),
    );
    Ok(ErrorHandlerResponse::Response(res))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();

    let db_pool = db::connect();
    env_logger::Builder::from_env(Env::default().default_filter_or("info")).init();

    let server = HttpServer::new(move || {
        let api = setup_api();

        let dashboard = web::scope("/").service(
            fs::Files::new("/", "dist")
                .show_files_listing()
                .index_file("index.html"),
        );

        App::new()
            .data(db_pool.clone())
            .wrap(ErrorHandlers::new().handler(http::StatusCode::INTERNAL_SERVER_ERROR, render_500))
            .wrap(Logger::default())
            .wrap(Logger::new("%a %{User-Agent}i"))
            .wrap(middleware::Compress::new(ContentEncoding::Br))
            .service(api)
            .service(dashboard)
    })
    .keep_alive(75);

    server.bind("0.0.0.0:8080")?.run().await
}
