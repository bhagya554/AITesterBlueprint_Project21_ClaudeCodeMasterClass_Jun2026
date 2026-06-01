package com.thetestingacademy.pages.POM.vwo.normal_POM;

import com.thetestingacademy.utils.PropertiesReader;
import com.thetestingacademy.utils.WaitHelpers;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class DashboardPage {

    WebDriver driver;

    public DashboardPage(WebDriver driver) {
        this.driver = driver;
    }

    private By userNameOnDashboard = By.xpath("//span[@data-qa=\"lufexuloga\"]");


    public String loggedInUserName(){
        WaitHelpers.waitJVM(10000);
        driver.get(PropertiesReader.readKey("url_dashboard"));
        return driver.findElement(userNameOnDashboard).getText();
    }

}
