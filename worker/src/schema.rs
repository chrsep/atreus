table! {
    Company (id) {
        id -> Int4,
        name -> Text,
    }
}

table! {
    Domain (name) {
        name -> Text,
        companyId -> Int4,
    }
}

table! {
    Scope (domain) {
        domain -> Text,
        companyId -> Int4,
    }
}

joinable!(Domain -> Company (companyId));
joinable!(Scope -> Company (companyId));

allow_tables_to_appear_in_same_query!(
    Company,
    Domain,
    Scope,
);
