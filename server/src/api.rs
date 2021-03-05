use crate::{db, models};
use actix_web::web::Json;
use actix_web::{get, post, web, HttpResponse, Responder, Scope};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
struct Target {
    name: String,
    scopes: Vec<String>,
}

impl From<models::Target> for Target {
    fn from(target: models::Target) -> Target {
        let scopes = Vec::<String>::new();
        Target {
            name: target.name,
            scopes,
        }
    }
}

#[get("/hello")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().body("Hello world!")
}

#[get("/targets")]
async fn handle_get_targets(pool: web::Data<db::Pool>) -> impl Responder {
    let conn = pool.get().expect("can't get db connection from pool");

    let targets = web::block(move || db::find_targets(&conn))
        .await
        .expect("failed to query targets");

    let response: Vec<Target> = targets.into_iter().map(|s| s.into()).collect();

    HttpResponse::Ok().json(response)
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
