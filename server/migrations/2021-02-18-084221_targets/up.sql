-- Your SQL goes here
create table targets (
    id uuid primary key,
    name varchar not null,
    created_at timestamp not null
)