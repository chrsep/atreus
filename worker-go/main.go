package main

import (
	"fmt"
	"github.com/joho/godotenv"
	_ "github.com/joho/godotenv/autoload"
)

func main() {
	if err := run(); err != nil {
		panic(err)
	}
}

func run() error {
	loadEnv()

	_, cleanup := initDB()
	defer cleanup()

	return nil
}

func loadEnv() {
	err := godotenv.Load(".env.local")
	if err != nil {
		fmt.Println("Error loading .env file")
	}
}
