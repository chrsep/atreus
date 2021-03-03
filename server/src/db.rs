use std::env;

use crate::models::Target;
use chrono::{Utc};
use diesel::r2d2::ConnectionManager;
use diesel::{PgConnection, RunQueryDsl};
use diesel::result::Error;

pub type Pool = r2d2::Pool<ConnectionManager<PgConnection>>;

pub fn connect() -> Pool {
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let manager = ConnectionManager::<PgConnection>::new(database_url);

    r2d2::Pool::builder()
        .build(manager)
        .expect("Failed to create pool.")
}

pub(crate) fn insert_new_target(pg: &PgConnection, target_name: String) -> Result<Target, Error> {
    use crate::schema::targets::dsl::*;

    let new_target = &Target {
        id: uuid::Uuid::new_v4(),
        name: target_name,
        created_at: Utc::now().naive_utc(),
    };

    match diesel::insert_into(targets)
        .values(new_target)
        .execute(pg) {
        Ok(_) => Ok(new_target.clone()),
        Err(e) => Err(e)
    }
}
