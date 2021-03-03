use std::env;

use crate::models::Target;
use diesel::r2d2::ConnectionManager;
use diesel::result::Error;
use diesel::PgConnection;

pub type Pool = r2d2::Pool<ConnectionManager<PgConnection>>;

pub fn connect() -> Pool {
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let manager = ConnectionManager::<PgConnection>::new(database_url);

    r2d2::Pool::builder()
        .build(manager)
        .expect("Failed to create pool.")
}

pub(crate) fn insert_new_target(p: &PgConnection, name: String) -> Result<Target, Error> {
    unimplemented!();
}
