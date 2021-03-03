use diesel::sql_types::{Timestamp, Uuid};
use crate::schema::targets;

#[derive(Queryable)]
pub struct Target {
    pub id: Uuid,
    pub name: String,
    pub created_at: Timestamp,
}
