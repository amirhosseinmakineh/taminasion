# Taminasion

An Angular 19 application for discovering and booking beauty businesses. The project now uses environment-driven configuration, route guarding, JWT interceptors, responsive layouts, and Angular i18n to support future multilingual releases.

## Prerequisites

- Node.js 18+
- npm 9+

After cloning the repository install dependencies:

```bash
npm install --legacy-peer-deps
```

> The `--legacy-peer-deps` flag keeps peer dependency resolution compatible with Angular 19 packages in this workspace.

## Environment configuration

API hosts are managed via Angular environment files. Update the following files to match your backend endpoints:

- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`

Both files expose the following properties:

```ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:5107/api',
  imageBaseUrl: 'http://localhost:5107/Images',
};
```

Modify `apiBaseUrl` and `imageBaseUrl` to point at the correct API and CDN domains for each deployment target.

## Running the project

Start the development server:

```bash
npm start
```

Navigate to `http://localhost:4200/`. The dev server reloads automatically when source files change.

## Building for production

```bash
npm run build
```

Build artifacts are emitted to `dist/taminasion`. The production build uses the production environment configuration (`environment.prod.ts`).

## Testing

Run the Karma/Jasmine unit test suite:

```bash
npm test -- --watch=false
```

Additional unit tests cover authentication guards, services, and new UI components.

## Internationalisation (i18n)

All Farsi UI strings are annotated with Angular i18n markers. Translation source strings live in `src/locale/messages.xlf` and an English template is generated at `src/locale/messages.en.xlf`.

To refresh the catalogue after adding new strings:

```bash
npm run ng -- extract-i18n --output-path src/locale --format xlf
```

## Project structure highlights

- `src/app/services/` – API clients (auth, business, user profile) and the HTTP interceptor that attaches JWT tokens.
- `src/app/components/` – Feature modules including business search, business details, business profile, and the new user dashboard.
- `src/app/shared/` – Reusable UI elements such as the responsive header.
- `src/environments/` – Environment specific API configuration.
- `src/locale/` – Translation catalogues for Angular i18n.

## Authentication flow

- JWT tokens are stored by `AuthService` and appended to all HTTP requests via `AuthInterceptor`.
- Protected routes use `AuthGuard`; unauthenticated users are redirected to the login screen with contextual messaging.
- The header updates its navigation links based on authentication state and exposes a logout action.

## Business management features

- Business profile data is loaded from the API with edit forms for work history, certificates, and comments.
- Business details pages allow visitors to submit ratings and reviews once authenticated.
- The user dashboard consolidates account information and reservation management in a responsive layout.

For more CLI guidance see the [Angular CLI reference](https://angular.dev/tools/cli).
