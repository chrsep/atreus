use crate::schema::targets;
use crate::schema::scopes;
use uuid::Uuid;

#[derive(Clone, Queryable, Insertable)]
pub struct Target {
    pub id: Uuid,
    pub name: String,
    pub created_at: chrono::NaiveDateTime,
}

#[derive(Clone, Queryable, Insertable)]
pub struct Scope {
    pub id: Uuid,
    pub target_id: Uuid,
    pub scope: String,
}
