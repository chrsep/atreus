use log::{error, info};
use serde::{Deserialize, Serialize};
use std::process::Command;
use std::{fs, str};

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
        .args(&["intel", "-d", domain.as_str(), "-whois"])
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
    let contents =
        fs::read_to_string(file_path).expect("failed to read amass result file");

    let lines: Vec<&str> = contents.lines().collect();

    let mut subdomains: Vec<AmassEnumResult> = vec![];
    for line in lines {
        let subdomain: AmassEnumResult = serde_json::from_str(line).expect("");
        subdomains.push(subdomain);
    }

    return subdomains
}

#[cfg(test)]
mod tests {
    use crate::amass::read_enum_result;

    #[test]
    fn test_read_enum_result() {
        let subdomains = read_enum_result("./test_fixtures/amass.json");
        assert_eq!(subdomains.len(), 6)
    }
}
