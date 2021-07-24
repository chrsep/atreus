#![allow(non_snake_case)]
use std::borrow::Borrow;
use std::env;

use sqlx::postgres::PgPoolOptions;
use sqlx::types::chrono::{NaiveDateTime, Utc};
use sqlx::{Pool, Postgres};

pub struct RootDomain {
    pub domain: String,
    pub confirmed: bool,
    pub companyId: i32,
    pub createdAt: NaiveDateTime,
}

pub struct DB {
    pool: Pool<Postgres>,
}

impl DB {
    pub async fn find_confirmed_domain(&self) -> Vec<RootDomain> {
        return sqlx::query_as!(RootDomain, r#"SELECT * from "RootDomain" where confirmed"#)
            .fetch_all(self.pool.borrow())
            .await
            .expect("failed to query root domains");
    }

    pub async fn insert_domain(&self, result: Vec<String>, company_id: Vec<i32>) {
        sqlx::query!(
            r#"insert into "RootDomain" (domain, "companyId") SELECT * FROM UNNEST($1::text[], $2::int[]) ON CONFLICT DO NOTHING"#,
            &result,
            &company_id
        )
            .execute(self.pool.borrow())
            .await
            .expect("failed to save new domain");
    }
}

pub async fn connect() -> DB {
    let db_url = env::var("DATABASE_URL").expect("DATABASE_URL cannot be empty");
    let pool = PgPoolOptions::new()
        .max_connections(2)
        .connect(&db_url)
        .await
        .expect("failed to connect to database");

    return DB { pool };
}
