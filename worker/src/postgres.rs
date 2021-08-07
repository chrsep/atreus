#![allow(non_snake_case)]
use std::env;

use crate::amass::AmassEnumResult;
use sqlx::postgres::PgPoolOptions;
use sqlx::types::chrono::NaiveDateTime;
use sqlx::{Pool, Postgres};

#[derive(Clone)]
pub struct RootDomain {
    pub domain: String,
    pub confirmed: bool,
    pub companyId: i32,
    pub createdAt: NaiveDateTime,
    pub lastDNSRecon: NaiveDateTime,
    pub isDNSReconRunning: bool,
}

pub struct DB {
    pool: Pool<Postgres>,
}

impl DB {
    pub async fn insert_subdomain(&self, subdomain: &AmassEnumResult) {
        let mut tx = self.pool.begin().await.expect("begin transaction failed");
        sqlx::query!(
            // language=PostgreSQL
            r#"
            insert into "SubDomain"(domain, "amassTag",  "rootDomainDomain", sources, "updatedAt")
            values ($1, $2, $3, $4, now())
            on conflict do nothing
            "#,
            &subdomain.name,
            &subdomain.tag,
            &subdomain.domain,
            &subdomain.sources
        )
        .execute(&mut tx)
        .await
        .expect("failed to save new domain");

        for address in subdomain.addresses.as_slice() {
            sqlx::query!(
                // language=PostgreSQL
                r#"
                insert into "IpAddress"("subDomainDomain", ip, cidr, asn, "desc", "updatedAt")
                values ($1, $2, $3, $4, $5, now())
                on conflict do nothing
                "#,
                &subdomain.name,
                &address.ip,
                &address.cidr,
                &address.asn,
                &address.desc,
            )
            .execute(&mut tx)
            .await
            .expect("failed to save new domain");
        }

        tx.commit().await.expect("commit transaction failed");
    }

    pub async fn find_stale_confirmed_domain(&self) -> Vec<RootDomain> {
        let mut conn = self
            .pool
            .acquire()
            .await
            .expect("failed to acquire connection");
        return sqlx::query_as!(
            RootDomain,
            // language=PostgreSQL
            r#"
            SELECT *  from "RootDomain" 
            where confirmed and now() -"lastDNSRecon"  > interval '5 hour' "#
        )
        .fetch_all(&mut conn)
        .await
        .expect("failed to query root domains");
    }

    pub async fn bulk_insert_root_domain(&self, new_domains: Vec<String>, company_id: i32) {
        let mut conn = self
            .pool
            .acquire()
            .await
            .expect("failed to acquire connection");
        sqlx::query!(
            // language=PostgreSQL
            r#"
            insert into "RootDomain" (domain, "companyId")
            select * from unnest($1::text[], $2::int[])
            on conflict do nothing
            "#,
            &new_domains,
            &vec![company_id; new_domains.len()]
        )
        .execute(&mut conn)
        .await
        .expect("failed to save new domain");
    }

    pub async fn update_root_domain_recon_time(&self, domain: String) {
        let mut conn = self
            .pool
            .acquire()
            .await
            .expect("failed to acquire connection");
        sqlx::query!(
            // language=PostgreSQL
            r#"
            update "RootDomain"
            set "lastDNSRecon" = now()
            where "domain" = $1::text
            "#,
            &domain
        )
        .execute(&mut conn)
        .await
        .expect("failed to save new domain");
    }

    pub async fn update_root_domain_recon_state(&self, domain: String, state: bool) {
        let mut conn = self
            .pool
            .acquire()
            .await
            .expect("failed to acquire connection");
        sqlx::query!(
            // language=PostgreSQL
            r#"
            update "RootDomain"
            set "isDNSReconRunning" = $1::bool
            where "domain" = $2::text
            "#,
            state,
            &domain
        )
        .execute(&mut conn)
        .await
        .expect("failed to save new domain");
    }
}

pub async fn connect() -> DB {
    let db_url = env::var("DATABASE_URL").expect("DATABASE_URL cannot be empty");
    let pool = PgPoolOptions::new()
        .connect(&db_url)
        .await
        .expect("failed to connect to database");

    return DB { pool };
}
