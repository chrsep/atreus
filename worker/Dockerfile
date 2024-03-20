FROM golang:1.22

WORKDIR /app


RUN go install -v github.com/projectdiscovery/httpx/cmd/httpx@latest
RUN go install -v github.com/prisma/prisma-client-go@latest

COPY ./ ./
RUN go run github.com/prisma/prisma-client-go generate

RUN go get ./...
RUN go build -o worker ./*.go

CMD ["/bin/sh", "-c", "./worker"]
