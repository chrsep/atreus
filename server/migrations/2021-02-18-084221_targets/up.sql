-- Your SQL goes here
create table targets (
    id uuid primary key,
    name varchar not null,
    created_at timestamp not null
);

create table scopes (
    domain varchar not null primary key,
    target uuid references targets on delete cascade
);

create table domains (
    domain varchar primary key,
    scope varchar references scopes on delete cascade
)