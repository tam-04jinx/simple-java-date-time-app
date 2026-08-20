# Localization Agent

## Mission

Keep the world clock UI localization complete, consistent, and easy to extend.

## When To Use

Use this agent for changes that touch:

- `src/main/resources/static/app.js`
- `src/main/resources/static/index.html`
- README language support notes
- City lists, language dropdowns, translated UI labels, or shareable language state

## Review Checklist

- Every language in `translations` has the same set of translation keys as English.
- Every language in `languageLabels` includes labels for all supported language codes.
- Every language option in `#language-select` has a matching entry in `translations`.
- Every non-English locale in `localizedCityNames` covers every city in `cityCoordinates`.
- Newly added cities are covered in `localizedCityNames` for each supported locale.
- README supported-language text matches the actual dropdown and translation bundles.
- User-visible copy preserves placeholders such as `{city}`, `{spread}`, `{count}`, `{total}`, `{latitude}`, and `{longitude}` exactly.
- Language changes continue to refresh city dropdown labels, focus-location labels, favorites, cards, map pins, and share links.

## Validation Commands

Run these checks when localization behavior changes:

```bash
node --check src/main/resources/static/app.js
mvn test
```

When possible, manually verify:

- Switch each language from the dropdown.
- Confirm city names update in both city selectors.
- Confirm selected cards and favorite labels update after switching languages.
- Confirm a shared URL with `language=ko` or another supported language restores that language.

## Review Output

Report findings first, ordered by severity. Include exact file references and describe the user-facing impact. If there are no issues, say that clearly and mention any validation that was not run.

