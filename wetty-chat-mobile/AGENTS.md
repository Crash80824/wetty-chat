# Wetty Chat Mobile (Frontend)

This is a Progressive Web Application (PWA) that supports desktop, mobile platforms
It uses Ionic Framework v8 and React with Redux as store management and axios as API client

## Localization

- This project uses `lingui` for localization (i18n) support.
- When writing UI code that include user visible text, we should use `t` or `Trans` when ever applicable.

## Style Customization

- Use a scss module when possible
- Avoid using inline styles unless it needs to be computed on the fly

## Structuring

- Use clean structure, create a component to abstract reusable / complex component
- Do not create huge monolitic page components that becomes a maintance nightmare
- Use Ionic component when it fits, avoid reinventing the wheel and keep style consistent

## Lint

After making changes, run `npm run verify` and ensure it passes.
`npm run verify` covers both `npm run lint` and `npm run typecheck`.
