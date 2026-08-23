---
name: java-junit
description: 'Write, update, or review JUnit tests for this Java 17 Maven Spring Boot world clock application. Use for controller behavior, API response, time-zone, and health endpoint test changes.'
---

# Java JUnit Testing

## When to Use This Skill

- Adding or changing tests under `src/test/java`
- Changing date/time API behavior or response records
- Reviewing coverage for controller or health endpoint changes

## Project Test Patterns

- Use JUnit 5 and the existing Spring Boot test dependencies.
- Construct `DateTimeController` directly for unit tests that verify records and date/time behavior.
- Use the random-port Spring Boot context and `TestRestTemplate` only for health endpoint integration behavior.
- Keep tests deterministic. Use explicit dates, time zones, and expected response values rather than the machine's default time zone.
- Preserve the fallback behavior for invalid, blank, and `system` values passed to `GET /api/datetime?zone=`.

## Workflow

1. Read the relevant production code and its existing test class before adding assertions.
2. Add focused tests for the changed behavior and its error or fallback path.
3. Name tests after observable outcomes, such as `shouldReturnRequestedTimezone`.
4. Run the smallest relevant test during development.
5. Run the full test suite before delivery when changes affect multiple API paths.

## Commands

| Task | Command |
| --- | --- |
| Run all tests | `mvn test` |
| Run one test class | `mvn -Dtest=DateTimeControllerTest test` |
| Run one test method | `mvn -Dtest=DateTimeControllerTest#shouldReturnRequestedTimezone test` |
| Run CI-equivalent validation | `mvn clean verify` |

## Gotchas

- Do not add a database, mock framework, or test dependency unless the requested behavior requires it.
- Do not test the live clock by asserting the current wall-clock time without controlling the input.
- When adding or changing a city, cover the corresponding API response while keeping city identifiers exact.
