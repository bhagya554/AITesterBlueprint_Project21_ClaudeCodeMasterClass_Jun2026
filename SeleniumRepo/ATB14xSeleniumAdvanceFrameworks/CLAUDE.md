# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

`ATB14xSeleniumAdvanceFramework` — a Maven + Java 17 Selenium/TestNG UI automation framework (by Pramod Dutta / The Testing Academy). It demonstrates several page-object styles (Page Object Model and Page Factory) against demo apps, with thread-safe parallel execution, retry-on-failure, Allure reporting, and local/headless/remote (Selenoid) execution.

Most working tests target `app.vwo.com` login flows under `src/test/.../tests/vwo`. Other app folders (`orangeHRM`, `idrive`, `katalonStudio`, `TTABank`) are mostly empty `.gitkeep` placeholders or page objects without tests yet.

## Commands

Run from the repo root (PropertiesReader and UtilExcel resolve files via `user.dir` + a hardcoded relative path, so the working directory **must** be the project root).

```powershell
mvn clean test                  # compile + run the suite in pom property testng.suite.file
mvn test "-Dtest=TestVWOLogin_02_Prop_Improved_POM"   # run a single test class (overrides the suite)
mvn test "-Dtest=TestVWOLogin_02_Prop_Improved_POM#test_negative_vwo_login"  # single method
mvn "-Dsurefire.suiteXmlFiles=testng_vwo_screenshot_retry_prop_improved_pom_part4.xml" test  # run a specific suite

mvn -Pci test                   # headless profile (chrome, 8 threads) — but see config gotcha below
mvn -Premote test               # remote/Selenoid profile

mvn allure:serve                # open the Allure report from target/allure-results
mvn allure:report               # generate static report
```

There is no separate lint step; the README mentions SonarLint as an IDE plugin only.

### Selenoid (remote grid)

```powershell
docker-compose up -d            # start Selenoid + selenoid-ui (config in selenoid/, browsers.json)
```
Then run with `execution_mode=remote` and `remote_url=http://localhost:4444/wd/hub`.

## Architecture

Layered, with `main/` holding production framework code and `test/` holding tests, listeners, and test-only utilities.

- **Driver lifecycle — `driver/DriverManager.java`**: the heart of thread safety. Holds a `ThreadLocal<WebDriver>`; `init()` builds a local or `RemoteWebDriver` based on config (chrome/firefox/edge, headless, Selenoid video/VNC capabilities), `getDriver()` returns the current thread's driver, `down()` quits and clears it. Never store the driver elsewhere — always go through `DriverManager.getDriver()`.
- **Base page — `base/CommonToAll.java`**: thin reusable actions (`openVWOUrl`, `clickElement`, `enterInput`, `getText`) overloaded for both `By` and `WebElement`. Page Factory pages extend this; classic POM pages do not (they take a `WebDriver` via constructor instead).
- **Base test — `baseTest/CommonToAllTest.java`**: all test classes extend this. `@BeforeMethod` calls `DriverManager.init()`; `@AfterMethod` captures a screenshot into Allure on failure (before quitting) then calls `DriverManager.down()`. Lifecycle is per-method, which is what makes method-level parallelism safe.
- **Page objects — `pages/`**: two coexisting styles, intentionally, for teaching contrast:
  - `pages/POM/...` classic POM — `private By` locators, public action methods, `WebDriver` injected via constructor (e.g. `vwo/normal_POM/LoginPage.java`).
  - `pages/PF/...` Page Factory — `@FindBy` fields with `PageFactory.initElements(...)`, extends `CommonToAll`.
- **Listeners — `test/.../listeners/`**: `RetryAnalyzer` (`IRetryAnalyzer`, retries a failing test up to 3×), `RetryListener` (`IAnnotationTransformer`, registered in the suite XML — it force-applies `RetryAnalyzer` to **every** test, so retry is global, not opt-in), and `ScreenshotListener`.
- **Config & data — `main/resources/data.properties`** read by `utils/PropertiesReader.readKey(...)`; **Excel data** in `test/resources/TESTDATA.xlsx` read by `utilsExcel/UtilExcel.getTestDataFromExcel(sheetName)` (Apache POI) for TestNG `@DataProvider`. Waits live in `utils/WaitHelpers`. Logging via `log4j2.xml`.

### Test naming convention

VWO login tests are numbered to show a progression of techniques: `01_Normal_POM` → `02_Prop_Improved_POM` (externalize creds to properties) → `03_Retry...` → `04_TakeScreen_Retry...`, plus `_Without_POM` (anti-pattern baseline) and `_PF` (Page Factory). Match this scheme when adding tutorial-style tests.

## Configuration gotchas

- **`data.properties` is the real source of truth, not `-D` flags.** `DriverManager` reads `browser`, `execution_mode`, `headless`, `remote_url` exclusively via `PropertiesReader.readKey(...)`, which reads `src/main/resources/data.properties` directly — it does **not** read `System.getProperty(...)`. So the Maven profiles (`-Pci`, `-Premote`) and the CI's `-Dbrowser=.../-Dheadless=...` flags set surefire system properties that the driver code ignores. To actually change browser/headless/mode, edit `data.properties`.
- **Active suite is set in `pom.xml`** via the `testng.suite.file` property (default `testng_vwo_retry_prop_improved_pom_part4.xml`). The `smoke`/`regression` profiles point at `testng_smoke.xml` / `testng_regression.xml`, which **do not exist** in the repo. Only the two `testng_vwo_*_part4.xml` suites are real.
- **`data.properties` contains live demo credentials** for the VWO/OrangeHRM demo accounts. They are test fixtures, not secrets — but treat them as throwaway.
- **Windows long paths**: some generated/test filenames are long; this clone required `git config core.longpaths true`. Keep new file/class names short.
- Surefire runs `parallel=methods` with `perCoreThreadCount=true`, `rerunFailingTestsCount=1`, and `-Xmx2048m -XX:+UseG1GC`. Any shared state added to page/util classes must stay thread-safe.

## Versions

Java 17. Selenium 4.27.0, TestNG 7.10.2, Allure 2.29.0, Log4j 2.24.3, AssertJ 3.27.3, Apache POI 5.3.0 (versions are centralized as properties at the top of `pom.xml`; the README's dependency table is slightly out of date — trust `pom.xml`).
