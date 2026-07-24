# Simple Java Date & Time App

A simple Java Spring Boot application with a frontend that displays the current server date and time.
The app also includes a world clock view with selectable cities, map markers, theme controls, saved favorites, shareable planner links, a curved live day/night map, and enriched date/time API metadata.

## Features

- Live server date and time
- Interactive world map with selected city markers
- Curved daylight, twilight, and night shadow rendering on the map
- Day, twilight, and night indicators for each city
- Work-hours meeting readiness across selected cities
- Favorite cities saved in the browser
- Shareable links that preserve selected cities and theme
- Theme switching between Aurora, Sunset, and Midnight

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

You can also use the helper script, which defaults to port `8090`:

```bash
./run-local.sh
```

## API Endpoint

```text
GET /api/datetime
```

You can also request a specific timezone:

```text
GET /api/datetime?zone=UTC
GET /api/datetime?zone=America/Chicago
```

Example response:

```json
{
  "date": "Tuesday, July 14, 2026",
  "time": "08:30:22 PM",
  "time24Hour": "20:30:22",
  "dateTime": "2026-07-14T20:30:22-05:00",
  "timeZone": "America/Chicago",
  "utcOffset": "-05:00",
  "dayOfWeek": "TUESDAY",
  "dayOfYear": 195,
  "epochSeconds": 1784079022,
  "fallback": false
}
```

If an unknown timezone is requested, the API falls back to the server default and returns `"fallback": true`.

## World Clock Endpoint

```text
GET /api/timezones
```

This returns city-level time data for the world clock UI.

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
