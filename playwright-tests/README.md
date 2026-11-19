# Playwright Tests: User & Role Management

End-to-end tests for the RetailSync POS **User & Role Management** module, written with Playwright and TypeScript. The config runs every test on **Chromium, Firefox and WebKit**. (In the QA reports, the User Management results were recorded on all three browsers and the Role Management results on Chromium only.)

| Spec file | Test | What it checks |
|---|---|---|
| `tests/user-management.spec.ts` | Creates a new user | The new user appears in the users table |
| `tests/user-management.spec.ts` | Duplicate email | Documents the current behaviour of BUG001 (raw "status code 409" message) |
| `tests/role-management.spec.ts` | Creates a custom role | Success message or the new role name is shown |
| `tests/role-management.spec.ts` | Duplicate role name | An "already exists" error is shown |

## Prerequisites
- Node.js 18 or newer
- The RetailSync frontend and backend running locally (not included in this repository)
- A super admin account and a test database

## Setup
```bash
npm install
npx playwright install
```
Copy `.env.example` to `.env` and fill in your own values (admin login, role and branch IDs). The `.env` file is ignored by Git, so no credentials are stored in this repository.

## Run
```bash
npm test                 # all browsers
npm run test:chromium    # Chromium only
npm run test:headed      # watch the browser
npm run report           # open the HTML report
```

## Notes
- The duplicate-email test asserts the **current buggy behaviour** (BUG001) so the suite stays accurate. When the bug is fixed, update the assertion to check for a friendly message.
- Locators use accessible roles and names. Adding `data-testid` attributes to the app would make them more stable (see the recommendations in the Frontend QA report).
