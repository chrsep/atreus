use crate::amass;
use crate::postgres::{RootDomain, DB};

pub async fn find_subdomains(db: &DB, root_domains: &Vec<RootDomain>) {
    for domain in root_domains {
        let subdomains = amass::enumerate(&domain.domain);
        for subdomain in subdomains {
            db.insert_subdomain(&subdomain).await
        }
    }
}

pub async fn find_other_root_domains(db: &DB, root_domains: &Vec<RootDomain>) {
    for domain in root_domains {
        let new_domains = amass::intel(&domain.domain);
        db.bulk_insert_root_domain(new_domains, domain.companyId)
            .await;
    }
}
