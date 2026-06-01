package com.thetestingacademy.pages.POM.TTABank;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class TTABankLoginPage {


    WebDriver driver;

    public TTABankLoginPage(WebDriver driver) {
        this.driver = driver;
    }

    // Step 1 - Page locators
    private By username = By.xpath("//input[@placeholder='you@example.com']");
    private By password = By.xpath("//input[@placeholder='••••••••']");
    private By signButton = By.xpath("//button[normalize-space()='Sign In']");
    private By error_message = By.id("js-notification-box-msg");


    public void loginWithCreds(String usr, String pwd) {
    }
}
