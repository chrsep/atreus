#![allow(non_snake_case)]

use std::borrow::Borrow;
use std::env;

use crate::amass::AmassEnumResult;
use sqlx::postgres::PgPoolOptions;
use sqlx::types::chrono::NaiveDateTime;
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
    pub async fn insert_subdomain(&self, subdomain: &AmassEnumResult) {
        sqlx::query!(
            // language=PostgreSQL
            r#"
            insert into "SubDomain"(domain, "amassTag",  "rootDomainDomain", sources)
            values ($1, $2, $3, $4)
            "#,
            &subdomain.name,
            &subdomain.tag,
            &subdomain.domain,
            &subdomain.sources
        )
        .execute(self.pool.borrow())
        .await
        .expect("failed to save new domain");

        for address in subdomain.addresses.as_slice() {
            sqlx::query!(
                // language=PostgreSQL
                r#"
                insert into "IpAddress"("subDomainDomain", ip, cidr, asn, "desc")
                values ($1, $2, $3, $4, $5)
                "#,
                &subdomain.name,
                &address.ip,
                &address.cidr,
                &address.asn,
                &address.desc,
            )
            .execute(self.pool.borrow())
            .await
            .expect("failed to save new domain");
        }
    }

    pub async fn find_confirmed_domain(&self) -> Vec<RootDomain> {
        return sqlx::query_as!(RootDomain, r#"SELECT * from "RootDomain" where confirmed"#)
            .fetch_all(self.pool.borrow())
            .await
            .expect("failed to query root domains");
    }

    pub async fn bulk_insert_root_domain(&self, new_domains: Vec<String>, company_id: i32) {
        sqlx::query!(
            r#"insert into "RootDomain" (domain, "companyId") SELECT * FROM UNNEST($1::text[], $2::int[]) ON CONFLICT DO NOTHING"#,
            &new_domains,
            &vec![company_id; new_domains.len()]
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
