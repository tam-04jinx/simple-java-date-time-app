---
description: 'Spring Boot conventions for this Java world clock application'
applyTo: '**/*.{java,kt}'
---

# Spring Boot Development

## Project Conventions

- Target Java 17 and Maven. Do not introduce Gradle or Maven Wrapper commands.
- Keep configuration in `src/main/resources/application.properties`.
- The application is a single Spring Boot service. Add dependencies only when they are required by the feature.
- Comment only non-obvious decisions or calculations; do not add comments that restate code.

## Application Design

- `DateTimeApplication` is the application entry point.
- `DateTimeController` owns the date/time API and the supported world-clock city data. Keep city identifiers exact because the static client uses them as join keys.
- Preserve the `GET /api/datetime` fallback behavior for invalid, blank, and `system` time zones.
- Preserve the response shape of `GET /api/timezones`, including server-calculated sunrise and sunset values.
- Validate request input explicitly and return behavior consistent with the existing API rather than adding generic persistence or service layers.
- Use records for immutable response models, following the existing controller style.

## Testing and Verification

- Extend the direct `DateTimeController` unit tests when changing API responses or time-zone behavior.
- Extend the random-port `TestRestTemplate` health test only when health endpoint behavior changes.
- Run the smallest relevant test while developing. Before delivery, run the CI-equivalent validation.

| Task | Command |
| --- | --- |
| Run the application | `mvn spring-boot:run` |
| Run the local helper | `./run-local.sh` |
| Run all tests | `mvn test` |
| Run CI-equivalent validation | `mvn clean verify` |
| Build the container | `docker build -t simple-java-date-time-app .` |