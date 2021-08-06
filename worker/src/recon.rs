use crate::amass;
use crate::postgres::{RootDomain, DB};
use log::info;

pub async fn find_subdomains(db: &'static DB, domain: RootDomain) {
    info!("recon(subs): `{}` start", domain.domain);
    let subdomains = amass::enumerate(&domain.domain);
    for subdomain in subdomains {
        db.insert_subdomain(&subdomain).await;
        db.update_root_domain_recon_time(domain.domain.clone())
            .await;
    }
    info!("recon(subs): `{}` finish", domain.domain);
}

pub async fn find_other_root_domains(db: &'static DB, domain: RootDomain) {
    info!("recon(roots): `{}` start", domain.domain);
    let new_domains = amass::intel(&domain.domain);
    db.bulk_insert_root_domain(new_domains, domain.companyId)
        .await;
    info!("recon(roots): `{}` finish", domain.domain);
}

pub async fn run_recon(db: &'static DB, domain: RootDomain) {
    tokio::spawn(async move {
        db.update_root_domain_recon_state(domain.domain.clone(), true)
            .await;

        // find_other_root_domains(db, domain.clone()).await;
        find_subdomains(db, domain.clone()).await;

        db.update_root_domain_recon_time(domain.domain.clone())
            .await;
        db.update_root_domain_recon_state(domain.domain, false)
            .await;
    });
}
