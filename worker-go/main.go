package main

import (
	"fmt"
	"github.com/joho/godotenv"
	_ "github.com/joho/godotenv/autoload"
	"sync"
	"time"
	"worker-go/db"
	"worker-go/log"
)

func main() {
	if err := run(); err != nil {
		panic(err)
	}
}

func run() error {
	setupEnv()
	setupSubfinder()

	cleanupLogger := log.Setup()
	defer cleanupLogger()

	cleanupDB := db.Setup()
	defer cleanupDB()

	for true {
		domains, err := db.FindConfirmedDomain()
		if err != nil {
			return err
		}

		var wg sync.WaitGroup
		for _, domain := range domains {
			wg.Add(1)
			go enumerateSubdomain(domain.Name, domain.CompanyID, &wg)
		}
		wg.Wait()

		fmt.Println("sleep: 10s timeout for domain enumeration")
		time.Sleep(time.Second * 10)
	}

	return nil
}

func enumerateSubdomain(domain string, id int, wg *sync.WaitGroup) {
	defer wg.Done()
	subdomains, err := subfinder.Enumerate(domain)
	if err != nil {
		fmt.Printf("%s: enumerate failed", domain)
	}

	db.InsertSubDomains(subdomains, id, domain)
	if err != nil {
		fmt.Printf("%s: enumerate failed, %e", domain, err)
	}

}

func setupEnv() {
	err := godotenv.Load(".env.local")
	if err != nil {
		fmt.Println("Error loading .env file")
	}
}
