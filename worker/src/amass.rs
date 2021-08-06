use log::{error, info};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::process::Command;
use std::{env, fs, str};

#[derive(Serialize, Deserialize)]
pub struct AmassEnumResult {
    pub name: String,
    pub domain: String,
    pub addresses: Vec<Address>,
    pub tag: String,
    pub sources: Vec<String>,
}

#[derive(Serialize, Deserialize)]
pub struct Address {
    pub ip: String,
    pub cidr: String,
    pub asn: i32,
    pub desc: String,
}

fn amass() -> Command {
    Command::new("amass/amass")
}

pub fn enumerate(domain: &String) -> Vec<AmassEnumResult> {
    info!("amass: running enum");
    let result = amass()
        .args(&["enum", "-active", "-dir", "./amass", "-d", domain.as_str()])
        .output()
        .expect("failed to execute amass");
    info!("amass: enum finished");

    if !result.status.success() {
        let stderr = str::from_utf8(&result.stderr).expect("failed to parse stderr");
        error!("stderr: {}", stderr);
    }

    let stdout = str::from_utf8(&result.stdout).expect("failed to parse stdout");
    info!("{}", stdout);

    read_enum_result("./amass/amass.json")
}

pub fn intel(domain: &String) -> Vec<String> {
    info!("amass: running intel");
    let result = amass()
        .args(&["intel", "-nolocaldb", "-d", "-active", domain.as_str(), "-whois"])
        .output()
        .expect("failed to execute amass");
    info!("amass: intel finished");

    if !result.status.success() {
        let stderr = str::from_utf8(&result.stderr).expect("failed to parse stderr");
        error!("stderr: {}", stderr);
    }

    let stdout = str::from_utf8(&result.stdout).expect("failed to parse stdout");
    stdout.lines().map(str::to_string).collect()
}

fn read_enum_result(file_path: &str) -> Vec<AmassEnumResult> {
    let contents = fs::read_to_string(file_path).expect("failed to read amass result file");

    let lines: Vec<&str> = contents.lines().collect();

    let mut subdomains: Vec<AmassEnumResult> = vec![];
    for line in lines {
        let subdomain: AmassEnumResult = serde_json::from_str(line).expect("");
        subdomains.push(subdomain);
    }

    return subdomains;
}

pub fn generate_config() {
    let current_dir = env::current_dir().expect("can't get current_dir");
    let dns_1 = format!("{}/wordlist/dns-1.txt", current_dir.display());
    let dns_2 = format!("{}/wordlist/dns-2.txt", current_dir.display());
    let dns_3 = format!("{}/wordlist/dns-3.txt", current_dir.display());
    let dns_4 = format!("{}/wordlist/dns-4.txt", current_dir.display());
    let dns_5 = format!("{}/wordlist/dns-5.txt", current_dir.display());

    let alientvault_key = env::var("ALIENTVAULT_KEY").expect("alientvault_key is invalid");
    let binaryedge_key = env::var("BINARYEDGE_KEY").expect("binaryedge_key is invalid");
    let chaos_key = env::var("CHAOS_KEY").expect("chaos_key is invalid");
    let cloudflare_key = env::var("CLOUDFLARE_KEY").expect("cloudflare_key is invalid");
    let hunter_key = env::var("HUNTER_KEY").expect("hunter_key is invalid");
    let ipinfo_key = env::var("IPINFO_KEY").expect("ipinfo_key is invalid");
    let networksdb_key = env::var("NETWORKSDB_KEY").expect("networksdb_key is invalid");
    let shodan_key = env::var("SHODAN_KEY").expect("shodan_key is invalid");
    let urlscan_key = env::var("URLSCAN_KEY").expect("urlscan_key is invalid");
    let virustotal_key = env::var("VIRUSTOTAL_KEY").expect("virustotal_key is invalid");
    let whoisxmlapi_key = env::var("WHOISXMLAPI_KEY").expect("whoisxmlapi_key is invalid");
    let securitytrails_key = env::var("SECURITYTRAILS_KEY").expect("securitytrails_key is invalid");

    let mut keys = HashMap::new();
    keys.insert("alienvault_key".to_string(), alientvault_key);
    keys.insert("binaryedge_key".to_string(), binaryedge_key);
    keys.insert("chaos_key".to_string(), chaos_key);
    keys.insert("cloudflare_key".to_string(), cloudflare_key);
    keys.insert("hunter_key".to_string(), hunter_key);
    keys.insert("ipinfo_key".to_string(), ipinfo_key);
    keys.insert("networksdb_key".to_string(), networksdb_key);
    keys.insert("shodan_key".to_string(), shodan_key);
    keys.insert("urlscan_key".to_string(), urlscan_key);
    keys.insert("virustotal_key".to_string(), virustotal_key);
    keys.insert("whoisxmlapi_key".to_string(), whoisxmlapi_key);
    keys.insert("securitytrails_key".to_string(), securitytrails_key);
    keys.insert("dns_wordlist_1".to_string(), dns_1);
    keys.insert("dns_wordlist_2".to_string(), dns_2);
    keys.insert("dns_wordlist_3".to_string(), dns_3);
    keys.insert("dns_wordlist_4".to_string(), dns_4);
    keys.insert("dns_wordlist_5".to_string(), dns_5);

    let config =
        fs::read_to_string("./amass/example.config.ini").expect("failed to read amass result file");
    let final_config = envsubst::substitute(config, &keys).expect("key substitution failed");
    fs::write("./amass/config.ini", final_config).expect("write config.ini failed");
}

#[cfg(test)]
mod tests {
    use crate::amass::{generate_config, read_enum_result};
    use dotenv::dotenv;
    use std::fs;

    #[test]
    fn can_read_enum_result() {
        let subdomains = read_enum_result("./test_fixtures/amass.json");
        assert_eq!(subdomains.len(), 6)
    }

    #[test]
    fn can_insert_api_key_to_config() {
        dotenv().ok();
        generate_config();

        let config =
            fs::read_to_string("./amass/config.ini").expect("failed to read amass result file");

        // all template should be replaced
        assert!(!envsubst::is_templated(&config));
    }
}
