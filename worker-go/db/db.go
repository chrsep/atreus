package db

import (
	"context"
)

var db *DB

type DB struct {
	*PrismaClient
	ctx context.Context
}

func FindConfirmedRootDomains() ([]DomainModel, error) {
	domains, err := db.Domain.
		FindMany(
			Domain.Confirmed.Equals(true),
		).
		Exec(db.ctx)

	return domains, err
}

func Init() func() {
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
