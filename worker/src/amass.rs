use log::{info, error};
use std::process::Command;
use std::str;

fn amass() -> Command {
    Command::new("amass/amass")
}

pub fn enumerate(domain: String) -> String {
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
    stdout.to_string()
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
