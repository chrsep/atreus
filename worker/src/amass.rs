use std::process::Command;

// static mut amass: Command =

fn amass() -> Command {
    Command::new("amass/amass")
}

// pub fn enumerate(domain: &str) -> Vec<String> {
//     let result = amass().args(&["enum", "-d", domain]);
// }
