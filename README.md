# Kino Test - Ticket Booking System

## Description
A microservices-based ticket booking system implementing Auth, Tickets, and Notifications services.

## Architecture
- **Auth Service**: gRPC, PostgreSQL, Redis. Handles user registration, login, and token validation.
- **Tickets Service**: GraphQL, CQRS, PostgreSQL, Kafka. Handles ticket viewing and reservation.
- **Notifications Service**: Kafka Consumer. Handles email notifications (logging).

## Technology Stack
- **Framework**: NestJS (Monorepo)
- **Database**: PostgreSQL (Prisma ORM)
- **Cache**: Redis
- **Message Broker**: Kafka
- **Communication**: gRPC (Inter-service), GraphQL (API), Kafka (Events)

## Requirements
- Docker & Docker Compose
- Node.js (for local development)

## How to Run

1. **Start Infrastructure & Apps**:
   ```bash
   docker compose -f docker-compose.infra.yml -f docker-compose.apps.yml up -d --build
   ```

2. **Seed Data** (Create an Event):
   ```bash
   cat scripts/seed-tickets.js | docker compose -f docker-compose.infra.yml -f docker-compose.apps.yml exec -T tickets node -
   ```
   *Creates an event with ID 10 (or auto-incremented).*

3. **Run E2E Test**:
   ```bash
   cat scripts/test-tickets.js | docker compose -f docker-compose.infra.yml -f docker-compose.apps.yml exec -T tickets node -
   ```
   *Performs Registration -> Login -> Ticket Reservation -> Verification.*

## API Usage (GraphQL)
Endpoint: `http://localhost:3001/graphql`

**Query Tickets:**
```graphql
query {
  tickets(eventId: 1) {
    id
    seat
    status
  }
}
```

**Reserve Ticket:**
```graphql
mutation {
  reserveTicket(eventId: 1, seat: "A1") {
    id
    status
    seat
  }
}
```
*Requires `Authorization: Bearer <TOKEN>` header.*

## Project Structure
- `apps/auth`: Auth Microservice
- `apps/tickets`: Tickets Microservice
- `apps/notifications`: Notifications Microservice
- `libs`: Shared resources (if any)
