# Copilot Instructions

## Build and test

- Java 17 and Maven are required. CI runs `mvn clean verify`, followed by `docker build -t simple-java-date-time-app .`.
- Run the full test suite: `mvn test`. Run the full CI-equivalent Maven validation: `mvn clean verify`.
- Run one test class: `mvn -Dtest=DateTimeControllerTest test`. Run one test method: `mvn -Dtest=DateTimeControllerTest#shouldReturnRequestedTimezone test`.
- The JavaScript client has no configured linter. For syntax validation after client or localization changes, run `node --check src/main/resources/static/app.js`.
- Run locally with `mvn spring-boot:run` on port 8080, or `./run-local.sh`, which builds the jar if needed and defaults to port 8090. Docker Compose exposes port 8080.

## Architecture

- `DateTimeApplication` boots a single Spring Boot application. `DateTimeController` is both the API layer and the source of world-clock city data; it exposes:
  - `GET /api/datetime?zone=<ZoneId>` for server/requested-zone data. Invalid, blank, or `system` zones resolve to the server zone, with `fallback` indicating invalid explicit zones.
  - `GET /api/timezones` for the supported city records, including current local time, coordinates, and server-calculated sunrise/sunset. Sunrise/sunset use the controller's embedded approximation and return `Unavailable` for polar cases.
  - Actuator health is available at `GET /actuator/health`; only `health` and `info` are exposed.
- The browser UI is a framework-free static application: `index.html` provides the DOM contract, `app.js` owns state/rendering/API polling, and `styles.css` defines theme and display-mode variants. Leaflet and OpenStreetMap tiles are loaded from CDNs; the UI must still render city cards when Leaflet is unavailable.
- `app.js` fetches both API endpoints every second. It maintains selected cities, focused city, favorites, language, theme, and mode; synchronizes them to `localStorage` and shareable URL query parameters; then re-renders selectors, map markers, cards, insights, daylight canvas, and analog clock.

## Repository-specific conventions

- City identifiers are exact English names and are the join keys across the backend `getTimeZones()` list and the client `cityCoordinates`, `localizedCityNames`, selection state, and URL values. Adding, renaming, or removing a city requires updating all of these surfaces together.
- Localization is defined in `app.js`. Every locale in `translations` must have the same keys as `en`; every locale in `languageLabels` must label every supported language; and each non-English `localizedCityNames` map must cover every city. Preserve interpolation tokens such as `{city}`, `{spread}`, `{count}`, `{total}`, `{latitude}`, and `{longitude}` exactly. Apply language changes through `applyLanguage()` so dynamic selectors, favorites, cards, markers, and share links refresh together.
- Retain the `data-i18n` and `data-i18n-aria-label` DOM attributes when editing user-visible HTML; `applyLanguage()` uses them to update content and accessibility labels.
- Theme and display-mode styling is driven by `body[data-theme]` and `body[data-mode]`. Use those attributes and the existing CSS custom properties instead of introducing separate styling state.
- `index.html` versions `styles.css` and `app.js` with `?v=` cache-busting query strings. Update the relevant version string when changing either asset.
- Unit tests construct `DateTimeController` directly and assert response records. The health test uses a random-port Spring Boot context and `TestRestTemplate`.
