package com.thetestingacademy.baseTest;

import com.thetestingacademy.driver.DriverManager;
import io.qameta.allure.Allure;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.testng.ITestResult;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;

import java.io.ByteArrayInputStream;

public class CommonToAllTest {

    private static final Logger logger = LogManager.getLogger(CommonToAllTest.class);

    @BeforeMethod
    public void setUp() {
        DriverManager.init();
    }

    @AfterMethod
    public void tearDown(ITestResult result) {
        WebDriver driver = DriverManager.getDriver();

        // Capture screenshot on failure BEFORE quitting the driver
        if (result.getStatus() == ITestResult.FAILURE && driver != null) {
            try {
                byte[] screenshotBytes = ((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES);
                Allure.addAttachment(
                        "Screenshot on Failure - " + result.getName(),
                        "image/png",
                        new ByteArrayInputStream(screenshotBytes),
                        "png");
                logger.info("Screenshot attached to Allure for failed test: {}", result.getName());
            } catch (Exception e) {
                logger.error("Failed to capture screenshot for test: {}", result.getName(), e);
            }
        }

        DriverManager.down();
    }

}
