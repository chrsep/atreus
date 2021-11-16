package db

import (
	"context"
	"strings"
	"worker-go/log"
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

func FindConfirmedDomain() ([]DomainModel, error) {
	domains, err := db.Domain.
		FindMany(Domain.Confirmed.Equals(true)).
		Exec(db.ctx)

	return domains, err
}

func InsertSubDomains(domains []string, companyId int, RootDomain string) {
	for i := range domains {
		_, err := db.Domain.CreateOne(
			Domain.Name.Set(domains[i]),
			Domain.Company.Link(
				Company.ID.Equals(companyId),
			),
			Domain.RootDomain.Link(
				Domain.Name.Equals(RootDomain),
			),
		).Exec(db.ctx)
		if err != nil && !strings.Contains(err.Error(), "P2002") {
			log.Error("failed to insert subdomain", err)
		}
	}
}
