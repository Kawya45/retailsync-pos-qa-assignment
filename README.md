# RetailSync POS – User & Role Management: QA Assignment

A full QA assignment for the **User Management** and **Role Management** modules of *RetailSync Enterprise POS*. It covers **backend API testing (Postman)**, **manual UI testing** and **end-to-end automation (Playwright, TypeScript)**, together with formal bug reports and a final QA summary.

**62 executed tests · 3 testing layers · 6 defects found · 3 browsers automated**

---

## Results at a Glance

| Layer | Tool | Executed | Passed | Failed | Blocked |
|---|---|:---:|:---:|:---:|:---:|
| Backend / API | Postman | 37 | 32 | 5 | – |
| Frontend (manual) | Browser (Chrome) | 15 | 13 | 2 | – |
| Frontend (automated) | Playwright | 8 | 8 | 0 | – |
| User-Role Management | – | – | – | – | 2 |
| **Total** | | **62** | **53** | **7** | **2** |

The **User-Role Management** module was marked **Blocked**: its backend only exposes a placeholder endpoint, so role assignment and revocation could not be tested.

## Scope

| Module | Backend (Postman) | Frontend (manual) | Frontend (Playwright) |
|---|:---:|:---:|:---:|
| User Management | ✅ 22 tests | ✅ 8 tests | ✅ 2 tests × 3 browsers |
| Role Management | ✅ 15 tests | ✅ 7 tests | ✅ 2 tests × Chromium |
| User-Role Management | ⛔ Blocked | ⛔ Blocked | ⛔ Blocked |

**Environment:** React (Vite) frontend on `localhost:5173`, Node.js backend on `localhost:5000`, MongoDB (Mongoose).
**Roles used:** SUPER_ADMIN, AUDITOR, CASHIER, EMPLOYEE.

## What I Tested

**Backend / API**
- Authentication: missing token and invalid token (`401`)
- Role-based access control: Cashier blocked from user and role endpoints (`403`); Auditor limited to view-only
- CRUD for users and roles, status change (PATCH), password reset and role change
- Validation: missing required fields (`422`), duplicate email (`409`), duplicate role name, password mismatch
- Negative and edge cases: malformed IDs vs. valid-but-missing IDs, empty strings and `null` values
- Data consistency: confirmed deleted records are really gone

**Frontend**
- Create, edit, deactivate and search users; form validation messages
- Create, edit and delete roles; duplicate role name; system roles cannot be deleted
- RBAC in the UI: the *User & Role Management* menu is hidden for CASHIER and AUDITOR

**Automation (Playwright)**
- Create a user and see it in the table
- Duplicate-email error
- Create a custom role
- Duplicate role-name error

## Defects Found

### Backend ([Bug Report](reports/Bug_Report.pdf))

| ID | Title | Severity | Endpoint |
|---|---|:---:|---|
| BUG001 | User is permanently deleted instead of soft-deleted (violates business rule BR-USR-002) | High | `DELETE /api/v1/user-management/:id` |
| BUG002 | `500` error and raw Mongoose error when `branchId` is an empty string | High | `PUT /api/v1/user-management/:id` |
| BUG003 | Role can be created with an empty permissions array | Low | `POST /api/v1/role-management` |
| BUG004 | `500` error leaking internal Mongoose details on a malformed ID (violates REQ-SEC-006) | High | `GET /api/v1/role-management/:id`, `GET /api/v1/user-management/:id` |

### Frontend ([Frontend QA Report](reports/QA_Report_Frontend_Playwright.pdf))

| ID | Title | Severity |
|---|---|:---:|
| UI-1 | Duplicate email shows the raw message "Request failed with status code 409" | Medium |
| UI-2 | Editing a user with "No branch assigned" causes a `500` error (likely the UI symptom of BUG002) | High |

> **Note on bug IDs:** the Frontend QA Report and Final QA Summary number the two UI defects BUG001 and BUG004. They are listed here as UI-1 and UI-2 to avoid confusion with the numbering in the Backend Bug Report.

## Repository Structure

```
retailsync-pos-qa-assignment/
├── reports/
│   ├── QA_Report_Backend_API.pdf
│   ├── QA_Report_Frontend_Playwright.pdf
│   ├── Bug_Report.pdf
│   └── Final_QA_Summary.pdf
├── test-cases/
│   ├── Test_Cases_Backend.pdf
│   └── Test_Cases_Frontend.pdf
├── evidence/
│   ├── Postman_API_Screenshots.pdf
│   └── Playwright_Test_Results.pdf
└── playwright-tests/
    ├── tests/               (user-management.spec.ts, role-management.spec.ts)
    ├── playwright.config.ts
    ├── .env.example
    └── README.md            (setup and run instructions)
```

| Document | What it contains |
|---|---|
| [Backend API QA Report](reports/QA_Report_Backend_API.pdf) | Scope, test cases, results and screenshots for the API |
| [Frontend QA Report](reports/QA_Report_Frontend_Playwright.pdf) | Manual and Playwright results, defects and recommendations |
| [Bug Report](reports/Bug_Report.pdf) | 4 backend defects with steps to reproduce and evidence |
| [Final QA Summary](reports/Final_QA_Summary.pdf) | Overall statistics, blockers and conclusion |
| [Backend test cases](test-cases/Test_Cases_Backend.pdf) · [Frontend test cases](test-cases/Test_Cases_Frontend.pdf) | The test case lists |
| [Postman evidence](evidence/Postman_API_Screenshots.pdf) · [Playwright evidence](evidence/Playwright_Test_Results.pdf) | Execution screenshots |

## Running the Playwright Tests

The tests need the RetailSync app running locally, which is **not included** in this repository. See [`playwright-tests/README.md`](playwright-tests/README.md) for the full steps. In short:

```bash
cd playwright-tests
npm install
npx playwright install
cp .env.example .env     # then fill in your own values
npm test
```

Credentials are read from a `.env` file that is ignored by Git, so no passwords are stored in this repository.

## Highlights

- **Defects tied to requirements:** bugs were linked to the business rule or security requirement they violate (BR-USR-002, REQ-SEC-006), not just described as "wrong behaviour".
- **Cross-layer analysis:** the same weakness (unhandled empty or invalid IDs) was found through the API and again through the UI.
- **Automation that documents known bugs:** the duplicate-email test asserts the current behaviour of the open bug and says so in a code comment, so the suite stays accurate until the bug is fixed.
- **Honest reporting:** failed and blocked results are reported as they are, together with recommendations for the developers.

## Limitations & Next Steps

- Role Management automation was recorded on **Chromium only**; User Management ran on Chromium, Firefox and WebKit.
- The automated suite covers 4 key scenarios. Coverage of edit, delete and search flows could be extended.
- Locators rely on accessible names; adding `data-testid` attributes to the app would make them more stable.
- Postman requests were run manually. A next step is exporting them as a collection and running them with Newman in CI.

## Note on Test Data

All testing was done in a local development environment with test data. Authentication tokens, personal data and credentials were removed from the screenshots before publishing.

## Author

**Kawya Jinasoma**, Computer Science student and aspiring QA Engineer
GitHub: [@Kawya45](https://github.com/Kawya45) ·
