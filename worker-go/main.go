package main

import (
	"fmt"
	"github.com/joho/godotenv"
	_ "github.com/joho/godotenv/autoload"
	"os"
	"sync"
	"time"
	"worker-go/db"
	"worker-go/log"
)

func main() {
	setupEnv()
	setupSubfinder()

	cleanupLogger := log.Setup()
	defer cleanupLogger()

	cleanupDB := db.Setup()
	defer cleanupDB()

	if err := run(); err != nil {
		panic(err)
	}
}

func run() error {
	exit := make(chan string)

	go runSubdomainEnumeration()
	go runPortScan()

	for {
		time.Sleep(time.Second * 10)

		select {
		case <-exit:
			os.Exit(0)
		}
	}

	return nil
}

func runSubdomainEnumeration() {
	for {
		domains, err := db.FindRootDomains()
		if err != nil {
			panic(err)
		}

		var wg sync.WaitGroup
		for _, domain := range domains {
			wg.Add(1)
			go enumerateSubdomain(domain.Name, domain.CompanyID, &wg)
		}
		wg.Wait()

		log.Info("enumeration: 20s timeout for domain enumeration")
		time.Sleep(time.Second * 20)
	}
}

func runPortScan() {
	for {
		log.Info("scanning services")
		domains, err := db.FindAllDomains()
		if err != nil {
			panic(err)
		}

		domainNames := make([]string, 0)
		for _, domain := range domains {
			domainNames = append(domainNames, domain.Name)
		}

		_, _ = scanServices(domainNames)

		log.Info("port-scan: 5s timeout for port scan")
		time.Sleep(time.Second * 5)
	}
}

func enumerateSubdomain(domain string, id int, wg *sync.WaitGroup) {
	defer wg.Done()
	subdomains, err := subfinder.Enumerate(domain)
	if err != nil {
		fmt.Printf("%s: enumerate failed", domain)
	}

	err = db.InsertSubDomains(subdomains, id, domain)
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
