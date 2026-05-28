# Playwright MCP Code

This repository contains a Playwright Test automation framework for `https://www.saucedemo.com` using TypeScript and Page Object Model (POM).

## What is included

- Playwright configuration in `playwright.config.ts`
- Page objects in `tests/pages`
- Test specs in `tests/specs`
- Environment helper in `tests/utils/helper.ts`
- Jenkins CI pipeline in `Jenkinsfile`

## Prerequisites

- Node.js 18+ installed
- npm installed
- Jenkins agent with Node.js if running CI

## Setup

1. Clone the repository
2. Install dependencies:
   ```powershell
   npm ci
   ```
3. Install Playwright browsers:
   ```powershell
   npm run install:browsers
   ```
4. Create a local `.env` from `.env.example` if you want to override defaults.

## Environment variables

Copy `.env.example` to `.env` to override values.

```dotenv
BASE_URL=https://www.saucedemo.com
USERNAME=standard_user
PASSWORD=secret_sauce
FIRST_NAME=John
LAST_NAME=Doe
ZIP_CODE=12345
```

## Available scripts

- `npm run build` - compile TypeScript
- `npm test` - run Playwright tests
- `npm run test:ci` - run full CI build with HTML and JUnit reporting
- `npm run install:browsers` - install Playwright browser binaries

## Running locally

```powershell
npm ci
npm run install:browsers
npm test
```

## CI / Jenkins

This repository includes a `Jenkinsfile` that performs:

1. checkout
2. `npm ci`
3. browser install
4. build
5. test via `npm run test:ci`
6. archive `playwright-report`
7. publish JUnit results

### Jenkins pipeline

Use the included `Jenkinsfile` in a Pipeline job or Multibranch Pipeline.

## Test coverage

Current coverage includes:

- Successful login and logout
- Complete purchase checkout flow
- Invalid login validation

## Project structure

- `tests/pages` - page object classes
- `tests/specs` - Playwright test specs
- `tests/utils` - helpers and environment functions
- `Jenkinsfile` - CI pipeline definition

## Notes

- Keep `.env` out of source control
- `node_modules` is excluded via `.gitignore`
- The framework is configured to run across Chromium, Firefox, and WebKit
