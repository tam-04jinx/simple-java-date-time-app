# Simple Java Date & Time App

A simple Java Spring Boot application with a frontend that displays the current server date and time.

## Tech Stack

- Java 17
- Spring Boot
- Spring Boot Actuator
- HTML
- CSS
- JavaScript
- Docker

## Run Locally

```bash
mvn spring-boot:run
```

Then open:

```text
http://localhost:8080
```

## API Endpoint

```text
GET /api/datetime
```

## Health Check

```text
GET /actuator/health
```

## Build and Test

```bash
mvn clean verify
```

## Run with Docker

```bash
docker compose up --build
```

The application reads the `PORT` environment variable when one is provided. Otherwise it defaults to `8080`.

## Repository Governance

This repository includes CODEOWNERS, issue templates, a pull request template, a license, CI validation, and a manual release workflow.
