use actix_web::{get, post, web, HttpResponse, Responder, Scope};

#[get("/hello")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().body("Hello world!")
}

#[get("/targets")]
async fn handle_get_targets() -> impl Responder {
    HttpResponse::Ok().body("Targets")
}

#[post("/targets")]
async fn handle_post_targets() -> impl Responder {
    HttpResponse::Ok()
}

pub fn setup_api() -> Scope {
    web::scope("/api")
        .service(hello)
        .service(handle_get_targets)
        .service(handle_post_targets)
}
