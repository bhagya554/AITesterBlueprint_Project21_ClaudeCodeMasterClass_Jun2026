# Playwright 8-Layer Architecture

E2E framework split into 8 layers. Each layer depends **only downward** — tests
never touch raw selectors, pages never read `process.env`, data never imports
Playwright. This keeps every piece swappable and testable in isolation.

## Layers

| # | Layer | Folder | Responsibility | Depends on |
|---|-------|--------|----------------|-----------|
| 1 | **Config** | `src/config/`, `playwright.config.ts`, `.env` | Env vars, base URLs, projects, auth-state path | — |
| 2 | **Core / Utils** | `src/core/`, `src/utils/` | `BasePage`, `BaseComponent`, logger, pure helpers | 1 |
| 3 | **Components** | `src/components/` | Reusable UI widgets (header, nav) scoped to a root locator | 2 |
| 4 | **Pages (POM)** | `src/pages/` | Page objects: selectors + intent actions, compose components | 2, 3 |
| 5 | **Services / API** | `src/services/` | API client + domain services for fast setup/teardown | 1, 2, 6 |
| 6 | **Data** | `src/data/` | Types, factories, static/seeded test data | 1, 2 |
| 7 | **Fixtures** | `src/fixtures/` | DI wiring + automatic teardown of pages & services | 4, 5 |
| 8 | **Tests / Specs** | `tests/` | User-journey specs + `auth.setup.ts` | 6, 7 |

### Dependency direction

```
8 Tests ─► 7 Fixtures ─► 4 Pages ─► 3 Components ─► 2 Core/Utils ─► 1 Config
                    └──► 5 Services ─► 6 Data ──────────┘
```

## Directory tree

```
Playwright_8_Layer_Architecture/
├── playwright.config.ts          # L1
├── package.json / tsconfig.json
├── .env.example
├── src/
│   ├── config/   env.config.ts                       # L1
│   ├── core/     base.page.ts  base.component.ts      # L2
│   ├── utils/    logger.ts  helpers.ts                # L2
│   ├── components/ header.component.ts nav.component.ts # L3
│   ├── pages/    login.page.ts  dashboard.page.ts     # L4
│   ├── services/ api-client.ts  user.service.ts       # L5
│   ├── data/     types.ts  user.factory.ts credentials.ts # L6
│   └── fixtures/ test.fixture.ts                      # L7
└── tests/                                             # L8
    ├── setup/ auth.setup.ts
    └── e2e/
        ├── auth/      login.spec.ts
        └── dashboard/ dashboard.spec.ts
```

## Run

```bash
npm install
npx playwright install        # browsers
cp .env.example .env          # fill values
npm test                      # all projects
npm run test:smoke            # @smoke only
npm run test:ui               # UI mode
npm run typecheck             # tsc --noEmit
```

## Why each layer earns its place

- **Config** — one place changes when an environment changes.
- **Core/Utils** — shared lifecycle + pure logic, no duplication.
- **Components** — a widget on 10 pages is written once.
- **Pages** — tests read as intent (`loginPage.login(...)`), not DOM.
- **Services** — create data via API in ms instead of clicking through UI.
- **Data** — unique factory data guarantees test isolation.
- **Fixtures** — tests declare what they need; setup/teardown is automatic.
- **Tests** — thin, readable, parallel-safe user journeys.
