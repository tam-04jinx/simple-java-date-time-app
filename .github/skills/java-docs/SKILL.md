---
name: java-docs
description: 'Maintain documentation for this Java 17 Maven Spring Boot world clock application. Use when updating the README, API usage, run instructions, testing guidance, or deployment documentation.'
---

# Java Application Documentation

## When to Use This Skill

- Updating `README.md`
- Documenting API behavior, local setup, tests, Docker usage, or release changes
- Reviewing documentation after backend or frontend behavior changes

## Documentation Rules

- Keep documentation aligned with the implementation and CI workflow.
- Refer to Java 17 and Maven commands without assuming a Maven Wrapper exists.
- Document `mvn clean verify` as the CI-equivalent Maven validation and `docker build -t simple-java-date-time-app .` as the container build.
- Describe both API endpoints when relevant:
  - `GET /api/datetime?zone=<ZoneId>` supports the server zone fallback behavior.
  - `GET /api/timezones` returns the supported world-clock city data.
- Retain accurate local-run instructions: `mvn spring-boot:run` uses port 8080, while `./run-local.sh` defaults to port 8090.

## Workflow

1. Read the implementation, tests, and workflow files that define the behavior being documented.
2. Update only the documentation affected by the change.
3. Use concise examples with real endpoint paths and response fields.
4. Do not document planned behavior as if it is already implemented.

## Gotchas

- The browser client is framework-free static HTML, CSS, and JavaScript; do not describe it as a Svelte application.
- City identifiers are exact English names used across the backend and client. Document any city catalog change consistently.
- Do not claim that sunrise and sunset values are precise astronomical calculations; they use the application's server-side approximation.
