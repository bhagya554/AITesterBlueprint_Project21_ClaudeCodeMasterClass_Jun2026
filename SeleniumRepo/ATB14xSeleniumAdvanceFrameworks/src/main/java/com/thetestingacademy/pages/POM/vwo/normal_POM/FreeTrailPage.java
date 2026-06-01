package com.thetestingacademy.pages.POM.vwo.normal_POM;

import com.thetestingacademy.utils.PropertiesReader;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class FreeTrailPage {

    public FreeTrailPage(WebDriver driver) {
        this.driver = driver;
    }

    WebDriver driver;

    private By email_input = By.id("page-v1-step1-email");
    private By checkbox = By.id("page-free-trial-step1-cu-gdpr-consent-checkbox");
    private By submitButton = By.xpath("//button[text()=\"Create a Free Trial Account\"]");
    private By error_msg_xpath = By.xpath("//div[contains(@class,\"invalid-reason\")]");

    public String enterDetailsInvalid(String email) {
        driver.get(PropertiesReader.readKey("url_free_trial"));
        driver.findElement(email_input).sendKeys(email);
        driver.findElement(checkbox).click();
        driver.findElement(submitButton).click();
        String error_msg = driver.findElement(error_msg_xpath).getText();
        return error_msg;

    }
}
