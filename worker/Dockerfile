FROM golang:latest

WORKDIR /app

COPY ./ ./

RUN go install -v github.com/prisma/prisma-client-go
RUN go get ./...
RUN go build -o worker ./*.go \

RUN go run github.com/prisma/prisma-client-go generate
