FROM rust:1.53 AS builder
WORKDIR /app
COPY . .
RUN cargo install -v --path .

FROM gcr.io/distroless/cc
WORKDIR /app

COPY --from=builder /usr/local/cargo/bin/worker /app/worker
COPY --from=builder /app/amass /app/amass

CMD ["./worker"]
