FROM golang:1.17

WORKDIR /app

COPY go.mod go.sum ./
RUN go get ./...

RUN go install -v github.com/prisma/prisma-client-go
RUN go go install -v github.com/projectdiscovery/httpx/cmd/httpx@latest

COPY schema.prisma ./
RUN go run github.com/prisma/prisma-client-go generate

COPY ./ ./

RUN go build -o worker ./*.go \

CMD ["/bin/sh", "-c", "./worker"]
