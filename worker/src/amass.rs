use std::process::Command;
use std::str;

fn amass() -> Command {
    Command::new("amass/amass")
}

pub fn enumerate(domain: String) -> String {
    let result = amass()
        .args(&["enum", "-d", domain.as_str()])
        .output()
        .expect("failed to execute amass");

    let stderr = str::from_utf8(&result.stderr).expect("failed to parse stderr");
    let stdout = str::from_utf8(&result.stdout).expect("failed to parse stdout");
    println!("stdout: {}", stdout);
    println!("stderr: {}", stderr);

    return stdout.to_string();
}

pub fn intel(domain: String) -> String {
    let result = amass()
        .args(&["intel", "-d", domain.as_str(), "-whois"])
        .output()
        .expect("failed to execute amass");

    let stderr = str::from_utf8(&result.stderr).expect("failed to parse stderr");
    let stdout = str::from_utf8(&result.stdout).expect("failed to parse stdout");
    println!("stdout: {}", stdout);
    println!("stderr: {}", stderr);

    return stdout.to_string();
}
