package main

import (
	"context"
	"worker-go/prisma"
)

var db *DB

type DB struct {
	client *prisma.PrismaClient
	ctx    context.Context
}

func (db *DB) FindConfirmedRootDomains() ([]prisma.DomainModel, error) {
	domains, err := db.client.Domain.
		FindMany(
			prisma.Domain.Confirmed.Equals(true),
		).
		Exec(db.ctx)

	return domains, err
}

func initDB() func() {
	db = &DB{
		client: prisma.NewClient(),
		ctx:    context.Background(),
	}

	if err := db.client.Connect(); err != nil {
		panic(err)
	}

	return func() {
		if err := db.client.Prisma.Disconnect(); err != nil {
			panic(err)
		}
	}
}
