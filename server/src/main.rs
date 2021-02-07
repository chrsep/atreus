use actix_files as fs;
use actix_web::{App, get, HttpResponse, HttpServer, Responder};

#[get("/api")]
async fn api() -> impl Responder {
    HttpResponse::Ok().body("Hello world!")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .service(api)
            .service(fs::Files::new("/", "dist")
                .show_files_listing()
                .index_file("index.html")
            )
    })
        .bind("0.0.0.0:8080")?
        .run()
        .await
}
