# Simple Java Date & Time App

A simple Java Spring Boot application with a frontend that displays the current server date and time.

## Tech Stack

- Java 17
- Spring Boot
- HTML
- CSS
- JavaScript

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

Example response:

```json
{
  "date": "Friday, July 3, 2026",
  "time": "01:30:22 PM",
  "dateTime": "2026-07-03T13:30:22-05:00",
  "timeZone": "America/Chicago"
}
```

The displayed date and time come from the Java server, not directly from the user's browser clock.

## Build and Test

```bash
mvn clean verify
```

A GitHub Actions workflow is included to run the Maven build on pushes and pull requests to `master` or `main`.
