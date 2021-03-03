use super::schema::targets;
use uuid::Uuid;

#[derive(Clone, Queryable, Insertable)]
pub struct Target {
    pub id: Uuid,
    pub name: String,
    pub created_at: chrono::NaiveDateTime,
}
