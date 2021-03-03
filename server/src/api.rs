use crate::db;
use actix_web::web::Json;
use actix_web::{get, post, web, HttpResponse, Responder, Scope};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
struct Target {
    name: String,
    scopes: Vec<String>,
}

#[get("/hello")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().body("Hello world!")
}

#[get("/targets")]
async fn handle_get_targets() -> impl Responder {
    HttpResponse::Ok().body("Targets")
}

#[post("/targets")]
async fn handle_post_targets(pool: web::Data<db::Pool>, input: Json<Target>) -> impl Responder {
    let conn = pool.get().expect("can't get db connection from pool");

    web::block(move || db::insert_new_target(&conn, input.name.clone()))
        .await
        .expect("failed to save target");

    HttpResponse::Ok()
}

pub fn setup_api() -> Scope {
    web::scope("/api")
        .service(hello)
        .service(handle_get_targets)
        .service(handle_post_targets)
}
