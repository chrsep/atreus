package db

import (
	"context"
	"github.com/prisma/prisma-client-go/runtime/transaction"
	"time"
)

var db *DB

type DB struct {
	*PrismaClient
	ctx context.Context
}

func Setup() func() {
	db = &DB{NewClient(), context.Background()}
	if err := db.Connect(); err != nil {
		panic(err)
	}
	return func() {
		if err := db.Prisma.Disconnect(); err != nil {
			panic(err)
		}
	}
}

// FindRootDomainToEnumerate finds root domain to enumerate and mark it with enumerationID to prevent other instance s from enumerating it
func FindRootDomainToEnumerate(enumerationID string, limit int) ([]DomainModel, error) {
	query := `
		UPDATE "Domain" SET "domainEnumerationID" = $1 
		WHERE name in (
		    SELECT name FROM "Domain" 
		    WHERE "confirmed" = true AND 
		          "rootDomainName" IS NULL AND 
		          ("lastDomainEnumeration" IS NULL OR "lastDomainEnumeration" < NOW() - INTERVAL '1 day') AND
		          ("domainEnumerationID" IS NULL OR "domainEnumerationID" = '' OR "lastDomainEnumeration" < NOW() - INTERVAL '2 day')
		    LIMIT $2
		)
	`
	if _, err := db.Prisma.ExecuteRaw(
		query,
		enumerationID,
		limit,
	).Exec(db.ctx); err != nil {
		return nil, err
	}

	return db.Domain.FindMany(
		Domain.DomainEnumerationID.Equals(enumerationID),
	).Exec(db.ctx)
}

func MarkDomainEnumerationAsFinished(domainName string) (*DomainModel, error) {
	return db.Domain.FindUnique(
		Domain.Name.Equals(domainName),
	).Update(
		Domain.LastDomainEnumeration.Set(time.Now()),
		Domain.DomainEnumerationID.Set(""),
	).Exec(db.ctx)
}

func MarkPortScanFinished(portScanID string) (*BatchResult, error) {
	return db.Domain.FindMany(
		Domain.PortScanID.Equals(portScanID),
	).Update(
		Domain.PortScanID.Set(""),
		Domain.LastPortScan.Set(time.Now()),
	).Exec(db.ctx)
}

func FindDomainToPortScan(portScanID string, limit int) ([]DomainModel, error) {
	query := `
        UPDATE "Domain" SET "portScanID" = $1 
        WHERE "name" in (
            SELECT "name" FROM "Domain" 
            WHERE "confirmed" = true AND
		          ("lastPortScan" IS NULL OR "lastPortScan" < NOW() - INTERVAL '30 minute') AND
		          ("portScanID" IS NULL OR "portScanID" = '' OR "lastPortScan" < NOW() - INTERVAL '1 day')
            LIMIT $2
        ) 
	`
	if _, err := db.Prisma.ExecuteRaw(
		query,
		portScanID,
		limit,
	).Exec(db.ctx); err != nil {
		return nil, err
	}

	return db.Domain.FindMany(
		Domain.PortScanID.Equals(portScanID),
	).Exec(db.ctx)
}

func InsertSubDomains(domains []string, companyId int, rootDomain string) error {
	var ops []transaction.Param
	for i := range domains {
		if domains[i] != rootDomain {
			query := db.Domain.
				UpsertOne(Domain.Name.Equals(domains[i])).
				Update(Domain.Confirmed.Set(true)).
				Create(
					Domain.Name.Set(domains[i]),
					Domain.Company.Link(
						Company.ID.Equals(companyId),
					),
					Domain.RootDomain.Link(
						Domain.Name.Equals(rootDomain),
					),
					Domain.Confirmed.Set(true),
				).Tx()
			ops = append(ops, query)
		}
	}
	return db.Prisma.Transaction(ops...).Exec(db.ctx)
}

func UpsertService(service ServiceModel) transaction.Param {
	return db.Service.UpsertOne(
		Service.PortDomainName(
			Service.Port.Equals(service.Port),
			Service.DomainName.Equals(service.DomainName),
		),
	).Update(
		Service.Name.Set(service.Name),
		Service.ARecords.Set(service.ARecords),
		Service.CnameRecords.Set(service.CnameRecords),
	).Create(
		Service.Port.Set(service.Port),
		Service.Name.Set(service.Name),
		Service.Description.Set(""),
		Service.Domain.Link(
			Domain.Name.Equals(service.DomainName),
		),
		Service.ARecords.Set(service.ARecords),
		Service.CnameRecords.Set(service.CnameRecords),
	).Tx()
}

func UpsertProbeResponse(response ProbeResponseModel, servicePort int, serviceDomainName string) transaction.Param {
	return db.ProbeResponse.UpsertOne(
		ProbeResponse.BodySHA.Equals(response.BodySHA),
	).Create(
		ProbeResponse.BodySHA.Set(response.BodySHA),
		ProbeResponse.URL.Set(response.URL),
		ProbeResponse.Host.Set(response.Host),
		ProbeResponse.Method.Set(response.Method),
		ProbeResponse.Scheme.Set(response.Scheme),
		ProbeResponse.Webserver.Set(response.Webserver),
		ProbeResponse.Timestamp.Set(response.Timestamp),
		ProbeResponse.Title.Set(response.Title),
		ProbeResponse.Header.Set(response.Header),
		ProbeResponse.Body.Set(response.Body),
		ProbeResponse.StatusCode.Set(response.StatusCode),
		ProbeResponse.ContentType.Set(response.ContentType),
		ProbeResponse.Path.Set(response.Path),
		ProbeResponse.ResponseTime.Set(response.ResponseTime),
		ProbeResponse.Service.Link(
			Service.PortDomainName(
				Service.Port.Equals(servicePort),
				Service.DomainName.Equals(serviceDomainName),
			),
		),
	).Update(
		ProbeResponse.BodySHA.Set(response.BodySHA),
		ProbeResponse.URL.Set(response.URL),
		ProbeResponse.Host.Set(response.Host),
		ProbeResponse.Method.Set(response.Method),
		ProbeResponse.Scheme.Set(response.Scheme),
		ProbeResponse.Webserver.Set(response.Webserver),
		ProbeResponse.Timestamp.Set(response.Timestamp),
		ProbeResponse.Title.Set(response.Title),
		ProbeResponse.Header.Set(response.Header),
		ProbeResponse.Body.Set(response.Body),
		ProbeResponse.StatusCode.Set(response.StatusCode),
		ProbeResponse.ContentType.Set(response.ContentType),
		ProbeResponse.Path.Set(response.Path),
		ProbeResponse.ResponseTime.Set(response.ResponseTime),
		ProbeResponse.Service.Link(
			Service.PortDomainName(
				Service.Port.Equals(servicePort),
				Service.DomainName.Equals(serviceDomainName),
			),
		),
	).Tx()
}

func UpsertTech(techs []string, probeResponseBodySHA string) []transaction.Param {
	ops := make([]transaction.Param, len(techs))
	for i, tech := range techs {
		op := db.Tech.UpsertOne(
			Tech.Name.Equals(tech),
		).Create(
			Tech.Name.Set(tech),
			Tech.ProbeResponse.Link(
				ProbeResponse.BodySHA.Equals(probeResponseBodySHA),
			),
		).Update(
			Tech.Name.Set(tech),
			Tech.ProbeResponse.Link(
				ProbeResponse.BodySHA.Equals(probeResponseBodySHA),
			),
		).Tx()
		ops[i] = op
	}
	return ops
}

func RunTransactions(transactions []transaction.Param) error {
	return db.Prisma.Transaction(transactions...).Exec(db.ctx)
}
