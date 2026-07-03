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

## Create a GitHub Repository from Terminal

```bash
git init
git add .
git commit -m "Initial Java date time app"
gh repo create simple-java-date-time-app --public --source=. --remote=origin --push
```

Use `--private` instead of `--public` if you want a private repository.
