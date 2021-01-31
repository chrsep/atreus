FROM node:15 AS dashboard
WORKDIR /usr/src
COPY ./dashboard /usr/src
RUN yarn install
RUN yarn build

FROM rust:1.49 as server
WORKDIR /usr/src
COPY ./server /usr/src
RUN cargo build --release

FROM gcr.io/distroless/cc-debian10
WORKDIR /usr/src
COPY --from=dashboard /usr/src/dist /usr/src/web
COPY --from=server /usr/src/target/release/server /usr/src/server

EXPOSE 8080
ENTRYPOINT ["./server"]
