use std::env;

use crate::models::Target;
use crate::schema::targets::dsl::*;
use chrono::Utc;
use diesel::r2d2::ConnectionManager;
use diesel::result::Error;
use diesel::{PgConnection, RunQueryDsl};

pub type Pool = r2d2::Pool<ConnectionManager<PgConnection>>;

pub fn connect() -> Pool {
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let manager = ConnectionManager::<PgConnection>::new(database_url);

    r2d2::Pool::builder()
        .build(manager)
        .expect("Failed to create pool.")
}

pub fn insert_new_target(conn: &PgConnection, target_name: String) -> Result<Target, Error> {
    let new_target = &Target {
        id: uuid::Uuid::new_v4(),
        name: target_name,
        created_at: Utc::now().naive_utc(),
    };
 
    match diesel::insert_into(targets)
        .values(new_target)
        .execute(conn)
    {
        Ok(_) => Ok(new_target.clone()),
        Err(e) => Err(e),
    }
}

pub fn find_targets(conn: &PgConnection) -> Result<Vec<Target>, Error> {
    targets.load(conn)
}
