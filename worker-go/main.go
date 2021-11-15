package main

import (
	"fmt"
	"github.com/joho/godotenv"
	_ "github.com/joho/godotenv/autoload"
	"sync"
)

func main() {
	if err := run(); err != nil {
		panic(err)
	}
}

func run() error {
	loadEnv()
	initSubfinder()
	cleanup := initDB()
	defer cleanup()

	domains, err := db.FindConfirmedRootDomains()
	if err != nil {
		return err
	}

	var wg sync.WaitGroup
	for _, domain := range domains {
		wg.Add(1)
		go reconSubdomains(domain.Name, subfinder, &wg)
	}
	wg.Wait()

	return nil
}

func reconSubdomains(domain string, subfinder *SubFinder, wg *sync.WaitGroup) {
	defer wg.Done()
	_, err := subfinder.Enumerate(domain)
	if err != nil {
		fmt.Printf("%s: enumerate failed", domain)
	}

}

func loadEnv() {
	err := godotenv.Load(".env.local")
	if err != nil {
		fmt.Println("Error loading .env file")
	}
}
