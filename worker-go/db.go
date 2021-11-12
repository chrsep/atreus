package main

import (
	"context"
	"worker-go/db"
)

type DB struct {
	client *db.PrismaClient
	ctx    context.Context
}

func initDB() (*DB, func()) {
	client := db.NewClient()
	ctx := context.Background()

	if err := client.Connect(); err != nil {
		panic(err)
	}

	cleanup := func() {
		if err := client.Prisma.Disconnect(); err != nil {
			panic(err)
		}
	}

	return &DB{
		client: client,
		ctx:    ctx,
	}, cleanup
}
