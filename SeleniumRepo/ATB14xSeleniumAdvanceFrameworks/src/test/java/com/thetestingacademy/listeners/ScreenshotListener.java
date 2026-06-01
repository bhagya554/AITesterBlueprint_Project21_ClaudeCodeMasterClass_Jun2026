package com.thetestingacademy.listeners;

import io.qameta.allure.Allure;
import org.apache.commons.io.FileUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.testng.ITestListener;
import org.testng.ITestResult;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Calendar;

import static com.thetestingacademy.driver.DriverManager.getDriver;

public class ScreenshotListener implements ITestListener {

    private static final Logger logger = LogManager.getLogger(ScreenshotListener.class);

    @Override
    public void onTestFailure(ITestResult result) {
        WebDriver driver = getDriver();
        String methodName = result.getName();
        String className = result.getTestClass().getName();

        Calendar calendar = Calendar.getInstance();
        SimpleDateFormat formatter = new SimpleDateFormat("dd_MM_yyyy_hh_mm_ss");

        if (driver != null) {
            try {
                // Take screenshot as bytes for Allure (FIXED: use byte array, not file path)
                byte[] screenshotBytes = ((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES);

                // Create screenshot file path
                String timestamp = formatter.format(calendar.getTime());
                String screenshotFileName = methodName + "_" + timestamp + ".png";
                String screenshotPath = "failure_screenshots/" + screenshotFileName;

                // Ensure directory exists
                File screenshotDir = new File("failure_screenshots");
                if (!screenshotDir.exists()) {
                    screenshotDir.mkdirs();
                }

                // Save screenshot to file
                File scrFile = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
                FileUtils.copyFile(scrFile, new File(screenshotPath));

                // Add screenshot link to TestNG report
                org.testng.Reporter.log("<a href='" + screenshotPath + "'> Screenshot</a>");

                // FIXED: Attach screenshot to Allure using InputStream (not file path string)
                Allure.addAttachment(
                        "Screenshot on Failure - " + methodName,
                        "image/png",
                        new ByteArrayInputStream(screenshotBytes),
                        "png");

                logger.info("Screenshot captured for failed test: {} in class: {}", methodName, className);
                logger.info("Screenshot saved to: {}", screenshotPath);

            } catch (IOException e) {
                logger.error("Failed to capture screenshot for test: {}", methodName, e);
            } catch (Exception e) {
                logger.error("Unexpected error while capturing screenshot: {}", e.getMessage(), e);
            }
        } else {
            logger.warn("WebDriver is null, cannot capture screenshot for test: {}", methodName);
        }
    }

    @Override
    public void onTestStart(ITestResult result) {
        logger.info("Starting test: {}", result.getName());
    }

    @Override
    public void onTestSuccess(ITestResult result) {
        logger.info("Test passed: {}", result.getName());
    }

    @Override
    public void onTestSkipped(ITestResult result) {
        logger.warn("Test skipped: {}", result.getName());
    }
}
