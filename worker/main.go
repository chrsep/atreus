package main

import (
	"context"
	"fmt"
	"github.com/joho/godotenv"
	_ "github.com/joho/godotenv/autoload"
	"github.com/prisma/prisma-client-go/runtime/transaction"
	"golang.org/x/sync/semaphore"
	"os"
	"strconv"
	"sync"
	"time"
	"worker/db"
	"worker/log"
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
	ctx := context.Background()
	sem := semaphore.NewWeighted(5)
	wg := &sync.WaitGroup{}

	for {
		domains, err := db.FindRootDomainToEnumerate(10)
		if err != nil {
			panic(err)
		}

		for _, domain := range domains {
			wg.Add(1)
			err := sem.Acquire(ctx, 1)
			if err != nil {
				panic(err)
			}
			go enumerateSubdomain(domain.Name, domain.CompanyID, sem, wg)
		}
		wg.Wait()

		log.Info("enumeration: 20s timeout for domain enumeration")
		time.Sleep(time.Second * 5)
	}
}

func runPortScan() {
	for {
		log.Info("scanning services")
		domains, err := db.FindDomainToPortScan(10)
		if err != nil {
			panic(err)
		}

		domainNames := make([]string, 0)
		for _, domain := range domains {
			domainNames = append(domainNames, domain.Name)
		}

		var ops []transaction.Param
		results, _ := scanServices(domainNames)
		for _, result := range results {
			service := db.ServiceModel{}
			service.Port, _ = strconv.Atoi(result.Port)
			service.Name = result.Webserver
			service.DomainName = result.Input
			service.ARecords = result.A
			service.CnameRecords = result.Cnames

			response := db.ProbeResponseModel{}
			response.BodySHA = result.BodySha256
			response.URL = result.Url
			response.Host = result.Host
			response.Method = result.Method
			response.Scheme = result.Scheme
			response.Webserver = result.Webserver
			response.Timestamp = result.Timestamp
			response.Title = result.Title
			response.Header = result.ResponseHeader
			response.Body = result.ResponseBody
			response.StatusCode = result.StatusCode
			response.ContentType = result.ContentType
			response.Path = result.Path
			response.ResponseTime = result.ResponseTime

			ops = append(ops, db.UpsertService(service))
			ops = append(ops, db.UpsertProbeResponse(response, service.Port, service.DomainName))
			ops = append(ops, db.UpsertTech(result.Technologies, response.BodySHA)...)
			ops = append(ops, db.UpdateDomainLastPortScanTx(service.DomainName))
		}
		if err := db.RunTransactions(ops); err != nil {
			log.Error("failed to save port scan results", err)
		}

		log.Info("port-scan: 5s timeout for port scan")
		time.Sleep(time.Second * 5)
	}
}

func enumerateSubdomain(domain string, id int, sem *semaphore.Weighted, wg *sync.WaitGroup) {
	defer func() {
		sem.Release(1)
		wg.Done()
	}()

	subdomains, err := subfinder.Enumerate(domain)
	if err != nil {
		log.Error("domain enumeration failed", err)
	}
	if err = db.InsertSubDomains(subdomains, id, domain); err != nil {
		log.Error("failed to insert subdomain", err)
	}
	if _, err = db.UpdateRootDomainLastEnumeration(domain); err != nil {
		log.Error("failed to update last enumeration date", err)
	}
}

func setupEnv() {
	err := godotenv.Load(".env.local")
	if err != nil {
		fmt.Println("Error loading .env file")
	}
}
