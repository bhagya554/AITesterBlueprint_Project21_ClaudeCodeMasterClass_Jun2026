package com.thetestingacademy.driver;

import com.thetestingacademy.utils.PropertiesReader;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.edge.EdgeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;
import org.openqa.selenium.remote.RemoteWebDriver;

import java.net.MalformedURLException;
import java.net.URL;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

/**
 * Thread-safe WebDriver Manager using ThreadLocal for parallel test execution.
 * Supports local browsers, headless mode, and remote execution (Selenoid/Grid).
 */
public class DriverManager {

    private static final Logger logger = LogManager.getLogger(DriverManager.class);

    // ThreadLocal ensures each thread gets its own WebDriver instance
    private static final ThreadLocal<WebDriver> driverThreadLocal = new ThreadLocal<>();

    /**
     * Get the WebDriver instance for the current thread.
     * 
     * @return WebDriver instance
     */
    public static WebDriver getDriver() {
        return driverThreadLocal.get();
    }

    /**
     * Set the WebDriver instance for the current thread.
     * 
     * @param driver WebDriver instance
     */
    public static void setDriver(WebDriver driver) {
        driverThreadLocal.set(driver);
    }

    /**
     * Initialize WebDriver based on configuration.
     * Supports local, headless, and remote (Selenoid/Grid) execution.
     */
    public static void init() {
        String browser = PropertiesReader.readKey("browser");
        String executionMode = PropertiesReader.readKey("execution_mode");
        String headless = PropertiesReader.readKey("headless");

        browser = browser != null ? browser.toLowerCase() : "chrome";
        executionMode = executionMode != null ? executionMode.toLowerCase() : "local";
        boolean isHeadless = "true".equalsIgnoreCase(headless);

        logger.info("Initializing WebDriver - Browser: {}, Mode: {}, Headless: {}",
                browser, executionMode, isHeadless);

        WebDriver driver;

        if ("remote".equals(executionMode)) {
            driver = createRemoteDriver(browser, isHeadless);
        } else {
            driver = createLocalDriver(browser, isHeadless);
        }

        if (driver != null) {
            driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
            driver.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(30));
            setDriver(driver);
            logger.info("WebDriver initialized successfully for thread: {}", Thread.currentThread().getId());
        }
    }

    /**
     * Create a local WebDriver instance.
     */
    private static WebDriver createLocalDriver(String browser, boolean isHeadless) {
        WebDriver driver = null;

        switch (browser) {
            case "edge":
                EdgeOptions edgeOptions = new EdgeOptions();
                edgeOptions.addArguments("--start-maximized");
                edgeOptions.addArguments("--guest");
                if (isHeadless) {
                    edgeOptions.addArguments("--headless=new");
                }
                addCommonArguments(edgeOptions);
                driver = new EdgeDriver(edgeOptions);
                break;

            case "chrome":
                ChromeOptions chromeOptions = new ChromeOptions();
                chromeOptions.addArguments("--start-maximized");
                if (isHeadless) {
                    chromeOptions.addArguments("--headless=new");
                }
                addCommonArguments(chromeOptions);
                driver = new ChromeDriver(chromeOptions);
                break;

            case "firefox":
                FirefoxOptions firefoxOptions = new FirefoxOptions();
                firefoxOptions.addArguments("--start-maximized");
                if (isHeadless) {
                    firefoxOptions.addArguments("--headless");
                }
                driver = new FirefoxDriver(firefoxOptions);
                break;

            default:
                logger.error("Browser not supported: {}", browser);
                throw new IllegalArgumentException("Browser not supported: " + browser);
        }

        return driver;
    }

    /**
     * Create a Remote WebDriver instance for Selenoid or Selenium Grid.
     */
    private static WebDriver createRemoteDriver(String browser, boolean isHeadless) {
        String remoteUrl = PropertiesReader.readKey("remote_url");
        if (remoteUrl == null || remoteUrl.isEmpty()) {
            remoteUrl = "http://localhost:4444/wd/hub";
        }

        logger.info("Connecting to remote WebDriver at: {}", remoteUrl);

        try {
            switch (browser) {
                case "chrome":
                    ChromeOptions chromeOptions = new ChromeOptions();
                    if (isHeadless) {
                        chromeOptions.addArguments("--headless=new");
                    }
                    addCommonArguments(chromeOptions);
                    addSelenoidCapabilities(chromeOptions);
                    return new RemoteWebDriver(new URL(remoteUrl), chromeOptions);

                case "firefox":
                    FirefoxOptions firefoxOptions = new FirefoxOptions();
                    if (isHeadless) {
                        firefoxOptions.addArguments("--headless");
                    }
                    addSelenoidCapabilities(firefoxOptions);
                    return new RemoteWebDriver(new URL(remoteUrl), firefoxOptions);

                case "edge":
                    EdgeOptions edgeOptions = new EdgeOptions();
                    if (isHeadless) {
                        edgeOptions.addArguments("--headless=new");
                    }
                    addCommonArguments(edgeOptions);
                    addSelenoidCapabilities(edgeOptions);
                    return new RemoteWebDriver(new URL(remoteUrl), edgeOptions);

                default:
                    throw new IllegalArgumentException("Browser not supported for remote: " + browser);
            }
        } catch (MalformedURLException e) {
            logger.error("Invalid remote URL: {}", remoteUrl, e);
            throw new RuntimeException("Invalid remote URL: " + remoteUrl, e);
        }
    }

    /**
     * Add common Chrome/Edge arguments for stability.
     */
    private static void addCommonArguments(ChromeOptions options) {
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        options.addArguments("--disable-gpu");
        options.addArguments("--window-size=1920,1080");
        options.addArguments("--disable-extensions");
        options.addArguments("--remote-allow-origins=*");
    }

    private static void addCommonArguments(EdgeOptions options) {
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        options.addArguments("--disable-gpu");
        options.addArguments("--window-size=1920,1080");
        options.addArguments("--disable-extensions");
    }

    /**
     * Add Selenoid-specific capabilities for video recording and VNC.
     */
    private static void addSelenoidCapabilities(ChromeOptions options) {
        String enableVideo = PropertiesReader.readKey("selenoid_video");
        String enableVnc = PropertiesReader.readKey("selenoid_vnc");

        Map<String, Object> selenoidOptions = new HashMap<>();
        selenoidOptions.put("enableVideo", "true".equalsIgnoreCase(enableVideo));
        selenoidOptions.put("enableVNC", "true".equalsIgnoreCase(enableVnc));
        selenoidOptions.put("name", "Test - " + Thread.currentThread().getId());
        options.setCapability("selenoid:options", selenoidOptions);
    }

    private static void addSelenoidCapabilities(FirefoxOptions options) {
        String enableVideo = PropertiesReader.readKey("selenoid_video");
        String enableVnc = PropertiesReader.readKey("selenoid_vnc");

        Map<String, Object> selenoidOptions = new HashMap<>();
        selenoidOptions.put("enableVideo", "true".equalsIgnoreCase(enableVideo));
        selenoidOptions.put("enableVNC", "true".equalsIgnoreCase(enableVnc));
        selenoidOptions.put("name", "Test - " + Thread.currentThread().getId());
        options.setCapability("selenoid:options", selenoidOptions);
    }

    private static void addSelenoidCapabilities(EdgeOptions options) {
        String enableVideo = PropertiesReader.readKey("selenoid_video");
        String enableVnc = PropertiesReader.readKey("selenoid_vnc");

        Map<String, Object> selenoidOptions = new HashMap<>();
        selenoidOptions.put("enableVideo", "true".equalsIgnoreCase(enableVideo));
        selenoidOptions.put("enableVNC", "true".equalsIgnoreCase(enableVnc));
        selenoidOptions.put("name", "Test - " + Thread.currentThread().getId());
        options.setCapability("selenoid:options", selenoidOptions);
    }

    /**
     * Quit the WebDriver and remove from ThreadLocal.
     */
    public static void down() {
        WebDriver driver = getDriver();
        if (driver != null) {
            try {
                driver.quit();
                logger.info("WebDriver quit successfully for thread: {}", Thread.currentThread().getId());
            } catch (Exception e) {
                logger.error("Error while quitting WebDriver", e);
            } finally {
                driverThreadLocal.remove();
            }
        }
    }
}
