use actix_web::{get, web, HttpResponse, Responder, Scope};

#[get("/hello")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().body("Hello world!")
}

pub fn setup_api() -> Scope {
    web::scope("/api").service(hello)
}
