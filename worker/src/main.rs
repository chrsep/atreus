use std::thread;
use std::time::Duration;

fn main() {
    loop {
        println!("Hello, world!");

        thread::sleep(Duration::from_secs(1));
    }
}
