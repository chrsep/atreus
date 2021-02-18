use diesel::sql_types::{Timestamp, Uuid};

#[derive(Queryable)]
pub struct Targets {
    pub id: Uuid,
    pub name: String,
    pub created_at: Timestamp,
}
