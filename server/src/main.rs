use actix_web::{App, get, HttpResponse, HttpServer, post, Responder};

#[get("/")]
async fn dashboard() -> impl Responder {
    HttpResponse::Ok().body("Hello world!")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .service(dashboard)
    })
        .bind("0.0.0.0:8080")?
        .run()
        .await
}
