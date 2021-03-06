table! {
    domains (domain) {
        domain -> Varchar,
        scope -> Nullable<Varchar>,
    }
}

table! {
    scopes (scope) {
        scope -> Varchar,
        target -> Nullable<Uuid>,
    }
}

table! {
    targets (id) {
        id -> Uuid,
        name -> Varchar,
        created_at -> Timestamp,
    }
}

joinable!(domains -> scopes (scope));
joinable!(scopes -> targets (target));

allow_tables_to_appear_in_same_query!(
    domains,
    scopes,
    targets,
);
