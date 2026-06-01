package com.thetestingacademy.pages.POM.vwo.normal_POM;

import com.thetestingacademy.utils.PropertiesReader;
import com.thetestingacademy.utils.WaitHelpers;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;

public class LoginPage {

    WebDriver driver;

    public LoginPage(WebDriver driver) {
        this.driver = driver;
    }

    // Step 1 - Page locators
    private By username = By.id("login-username");
    private By password = By.id("login-password");
    private By signButton = By.id("js-login-btn");
    private By error_message = By.id("js-notification-box-msg");

    // If you are not using it , don't keep.
    //private By signBySSO = By.xpath("//button[normalize-space()='Sign in using SSO']");
    //private By freeTrial = By.xpath("//button[normalize-space()='Sign in using SSO']");
    //private By rememberMeButton = By.xpath("//button[normalize-space()='Sign in using SSO']");


    // Step 2 - Page actions

    public String loginToVWOInvalidCreds(String usr, String pwd) {
        driver.get(PropertiesReader.readKey("url"));
        driver.findElement(username).sendKeys(usr);
        driver.findElement(password).sendKeys(pwd);
        driver.findElement(signButton).click();

        WaitHelpers.checkVisibility(driver, error_message);

        String error_message_text = driver.findElement(error_message).getText();
        return error_message_text;

    }

    public void loginToVWOValidCreds(String usr, String pwd) {
        driver.get(PropertiesReader.readKey("url"));
        driver.findElement(username).sendKeys(usr);
        driver.findElement(password).sendKeys(pwd);
        driver.findElement(signButton).click();


    }


}
