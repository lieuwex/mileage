FROM node:alpine AS builder

WORKDIR /
COPY . .
RUN npm install --only=dev --ignore-scripts
RUN npm run build

FROM golang:1.14-alpine AS runner

WORKDIR /app
COPY . .
RUN go build -o mileage
COPY --from=builder /web ./web

WORKDIR /app
ENTRYPOINT ["/app/mileage"]
