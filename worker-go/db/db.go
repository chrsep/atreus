package db

import (
	"context"
	"github.com/prisma/prisma-client-go/runtime/transaction"
)

var db *DB

type DB struct {
	*PrismaClient
	ctx context.Context
}

func Setup() func() {
	db = &DB{
		PrismaClient: NewClient(),
		ctx:          context.Background(),
	}

	if err := db.Connect(); err != nil {
		panic(err)
	}

	return func() {
		if err := db.Prisma.Disconnect(); err != nil {
			panic(err)
		}
	}
}

func FindRootDomains() ([]DomainModel, error) {
	domains, err := db.Domain.
		FindMany(
			Domain.Confirmed.Equals(true),
			Domain.RootDomainName.IsNull(),
		).
		Exec(db.ctx)

	return domains, err
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

	if err := db.Prisma.Transaction(ops...).Exec(db.ctx); err != nil {
		return err
	}

	return nil
}

func FindAllDomains() ([]DomainModel, error) {
	domains, err := db.Domain.
		FindMany(Domain.Confirmed.Equals(true)).
		Exec(db.ctx)

	return domains, err
}

func InsertService(domainName string, port int, name string) {
	db.Service.CreateOne(
		Service.Port.Set(port),
		Service.Name.Set(name),
		Service.Description.Set(""),
		Service.Domain.Link(
			Domain.Name.Equals(domainName),
		),
	)
}
