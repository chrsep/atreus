-- Your SQL goes here
create table targets
(
    id         uuid primary key,
    name       varchar   not null,
    created_at timestamp not null
);

create table scopes
(
    id        uuid primary key,
    target_id uuid references targets on delete cascade not null,
    scope     varchar                                   not null
);

create table domains
(
    id       uuid primary key,
    scope_id uuid references scopes on delete cascade not null,
    domain   varchar                                     not null
)