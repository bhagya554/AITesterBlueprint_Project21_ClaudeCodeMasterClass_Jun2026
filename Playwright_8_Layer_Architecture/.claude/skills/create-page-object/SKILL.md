---
name: create-page-object
description: >-
  Scaffold a new Layer-4 Page Object (POM) for THIS Playwright 8-layer
  TypeScript framework, then wire it into the Layer-7 fixtures so tests can
  inject it. Use this skill whenever the user says "create a page object",
  "make a page object", "add a new page", "scaffold a POM", or invokes
  /create-page-object — even if they don't name the file or layer explicitly.
  The skill asks the user for the page's locators (or reads a URL/HTML if
  given), then generates src/pages/<name>.page.ts and registers the fixture in
  src/fixtures/test.fixture.ts following the exact conventions already used by
  login.page.ts and dashboard.page.ts. Trigger it for any request to add a new
  page/screen to this Playwright POM project.
---

# Create Page Object

Generate a new Layer-4 Page Object for this Playwright 8-layer framework and
wire it into the Layer-7 fixtures. The goal: the user gives a page name + its
locators, and out comes a `src/pages/<name>.page.ts` that looks like it was
hand-written by the same author as `login.page.ts`, plus a fixture entry so
specs consume it by dependency injection with zero manual construction.

## The 8 layers (why this skill stays in its lane)

This project separates concerns so each file has one job. A Page Object lives in
**Layer 4** and may compose **Layer 3** components. It must NOT reach into
config, data, or services directly — that wiring happens in fixtures (L7) and
tests (L8). Respecting this is the whole point of the architecture.

```
L1 Config      src/config/env.config.ts, playwright.config.ts
L2 Core        src/core/base.page.ts, base.component.ts, utils/{logger,helpers}.ts
L3 Components  src/components/*.component.ts        (extend BaseComponent)
L4 Pages (POM) src/pages/*.page.ts                  (extend BasePage)  <-- this skill
L5 Services    src/services/*.ts
L6 Data        src/data/{types,credentials,*.factory}.ts
L7 Fixtures    src/fixtures/test.fixture.ts         (DI wiring)         <-- this skill edits
L8 Tests       tests/**/*.spec.ts, tests/setup/*.setup.ts
```

## Workflow

### Step 1 — Get the page name and route
Ask (or infer from the prompt): what is the page called and what URL path does it
live at? Derive the conventional names:
- Class: `PascalCase` + `Page` suffix → e.g. `SettingsPage`
- File: `kebab-or-lower` + `.page.ts` → `src/pages/settings.page.ts`
- Route: the `path` field, e.g. `/settings`

### Step 2 — Ask the user for the locators
This is the core interaction. Ask the user to list the elements on the page they
want to interact with. For each, you need enough to build a **semantic locator**
(role + accessible name, or label) — this project never uses raw CSS/XPath.

Prompt them like this:

> What elements are on this page? For each, tell me its purpose and how a user
> sees it (button text, field label, heading, link text, etc.). E.g.
> "Save button, Email field, an error alert, a 'Delete account' link."

If the user instead gives you a **URL or HTML snippet**, inspect it and derive
the locators yourself, then show the user the list you extracted and let them
correct it before generating.

Also ask what **actions** the page should expose (the intent-revealing methods),
e.g. "save settings", "change password". If they don't specify, infer sensible
actions from the locators (a form → a submit-style method; inputs → fill them).

### Step 3 — Decide component composition
If the page renders the shared header or sidebar nav, compose the existing
Layer-3 components instead of re-declaring those locators — exactly like
`dashboard.page.ts` does with `HeaderComponent` and `NavComponent`. Only add new
locators for elements unique to this page.

### Step 4 — Generate `src/pages/<name>.page.ts`
Follow the conventions in the section below. Match the existing files exactly:
doc-comment banner, ESM `.js` import suffixes, `readonly` Locator fields assigned
in the constructor, `this.log` in actions, `expect*` assertion helpers.

### Step 5 — Wire the fixture in `src/fixtures/test.fixture.ts`
1. Import the new page class (with the `.js` suffix).
2. Add it to the `Pages` type.
3. Add a fixture initializer. Default to **lazy** construction like
   `dashboardPage` (`await use(new SettingsPage(page))`). Only auto-`open()` in
   the fixture (like `loginPage`) if this page is the natural entry point of a
   journey and the user confirms — auto-navigating surprises tests that arrive
   via in-app navigation.

### Step 6 — Typecheck
Run `npm run typecheck` (`tsc --noEmit`) to confirm the new file and the edited
fixture compile. Report the result. Fix any type errors before finishing.

## Page Object conventions (match these exactly)

- **Module system is ESM.** `package.json` has `"type": "module"`, so every
  relative import MUST end in `.js` (even though the source is `.ts`):
  `import { BasePage } from '../core/base.page.js';`
- **Extend `BasePage`** — it already provides `page`, `log`, `open()`,
  `navigate()`, `waitForPageLoad()`, `getTitle()`, `takeScreenshot()`. Do not
  re-implement these.
- **`protected readonly path = '/route';`** — `open()` uses it. Required.
- **Locators are `readonly` fields**, declared on the class and assigned in the
  constructor after `super(page)`.
- **Semantic locators only.** Prefer, in order: `getByRole(role, { name })`,
  `getByLabel(...)`, `getByText(...)`, `getByPlaceholder(...)`. No `page.locator('.css')`
  or XPath. Scope component-internal locators to a root (see components).
- **Action methods reveal user intent** (`login`, `search`, `saveSettings`) and
  log via `this.log.info(...)`. They return `Promise<void>` unless they yield a value.
- **Assertion helpers** are named `expect…` and use `expect()` from
  `@playwright/test` (e.g. `expectErrorMessage`, `expectLoaded`).
- **Doc-comment banner** at the top naming the layer, mirroring siblings.
- **No data/config/service imports** inside the page. Pass values in as method
  args; tests supply them from L6 data via L7 fixtures.

## Reference example — the exact shape to emit

A simple form page (modeled on the real `login.page.ts`):

```ts
/**
 * Layer 4 - Pages (POM)
 * Settings page. Encapsulates selectors + user-intent actions only.
 */
import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from '../core/base.page.js';

export class SettingsPage extends BasePage {
  protected readonly path = '/settings';

  readonly displayNameInput: Locator;
  readonly saveButton: Locator;
  readonly savedToast: Locator;

  constructor(page: Page) {
    super(page);
    this.displayNameInput = page.getByLabel('Display name');
    this.saveButton = page.getByRole('button', { name: 'Save changes' });
    this.savedToast = page.getByRole('status');
  }

  async updateDisplayName(name: string): Promise<void> {
    this.log.info(`update display name -> ${name}`);
    await this.displayNameInput.fill(name);
    await this.saveButton.click();
  }

  async expectSaved(): Promise<void> {
    await expect(this.savedToast).toBeVisible();
  }
}
```

A page that composes Layer-3 components (modeled on `dashboard.page.ts`):

```ts
import { HeaderComponent } from '../components/header.component.js';
import { NavComponent } from '../components/nav.component.js';
// ...
readonly header: HeaderComponent;
readonly nav: NavComponent;
// in constructor:
this.header = new HeaderComponent(page);
this.nav = new NavComponent(page);
```

## Fixture wiring — the exact shape to emit

In `src/fixtures/test.fixture.ts`:

```ts
import { SettingsPage } from '../pages/settings.page.js';   // 1. import

type Pages = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  settingsPage: SettingsPage;                               // 2. add to type
};

export const test = base.extend<Pages & Services>({
  // ...existing...
  settingsPage: async ({ page }, use) => {                  // 3. lazy initializer
    await use(new SettingsPage(page));
  },
});
```

After wiring, a spec can do `async ({ settingsPage }) => { ... }` with no manual
construction — that is the success condition.

## Quick self-check before finishing
- [ ] File at `src/pages/<name>.page.ts`, class extends `BasePage`, has `path`.
- [ ] All imports use `.js` suffix; only semantic locators used.
- [ ] Fixture imported, added to `Pages` type, initializer added.
- [ ] `npm run typecheck` passes.
