FROM golang:1.17

WORKDIR /app

COPY ./ ./

RUN go get ./...
RUN go install -v github.com/prisma/prisma-client-go
RUN go go install -v github.com/projectdiscovery/httpx/cmd/httpx@latest

RUN go run github.com/prisma/prisma-client-go generate
RUN go build -o worker ./*.go \

CMD ["/bin/sh", "-c", "./worker"]
