table! {
    domains (id) {
        id -> Uuid,
        scope_id -> Uuid,
        domain -> Varchar,
    }
}

table! {
    scopes (id) {
        id -> Uuid,
        target_id -> Uuid,
        scope -> Varchar,
    }
}

table! {
    targets (id) {
        id -> Uuid,
        name -> Varchar,
        created_at -> Timestamp,
    }
}

joinable!(domains -> scopes (scope_id));
joinable!(scopes -> targets (target_id));

allow_tables_to_appear_in_same_query!(
    domains,
    scopes,
    targets,
);
