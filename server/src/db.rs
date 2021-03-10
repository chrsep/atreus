use std::env;

use crate::models::{Scope, Target};
use crate::schema::scopes::dsl::*;
use crate::schema::targets::dsl::*;
use chrono::Utc;
use diesel::r2d2::ConnectionManager;
use diesel::result::Error;
use diesel::{Connection, PgConnection, RunQueryDsl};
use uuid::Uuid;

pub type Pool = r2d2::Pool<ConnectionManager<PgConnection>>;

pub fn connect() -> Pool {
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let manager = ConnectionManager::<PgConnection>::new(database_url);

    r2d2::Pool::builder()
        .build(manager)
        .expect("Failed to create pool.")
}

pub fn insert_new_target(
    conn: &PgConnection,
    target_name: String,
    target_scopes: Vec<String>,
) -> Result<Target, Error> {
    let new_target = &Target {
        id: Uuid::new_v4(),
        name: target_name,
        created_at: Utc::now().naive_utc(),
    };

    let new_scopes: Vec<Scope> = target_scopes
        .into_iter()
        .map(|s| Scope {
            id: Uuid::new_v4(),
            target_id: new_target.id,
            scope: s,
        })
        .collect();

    conn.transaction(|| {
        diesel::insert_into(targets)
            .values(new_target)
            .execute(conn)?;

        diesel::insert_into(scopes)
            .values(&new_scopes)
            .execute(conn)?;

        Ok(new_target.clone())
    })
}

pub fn find_targets(conn: &PgConnection) -> Result<Vec<Target>, Error> {
    targets.load(conn)
}
