package com.sofka.automation.pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

public class NavigationBar {

    private final WebDriver driver;

    @FindBy(xpath = "//button[contains(text(),'Explorar Kudos')]")
    private WebElement exploreKudosLink;

    @FindBy(xpath = "//button[contains(text(),'Acceder') or contains(text(),'Volver')]")
    private WebElement toggleViewButton;

    @FindBy(xpath = "//button[contains(.,'SofkianOS')]")
    private WebElement brandLogo;

    public NavigationBar(WebDriver driver) {
        this.driver = driver;
        PageFactory.initElements(driver, this);
    }

    public KudosListPage navigateToExploreKudos() {
        exploreKudosLink.click();
        return new KudosListPage(driver);
    }

    public KudoSendPage navigateToSendKudos() {
        toggleViewButton.click();
        return new KudoSendPage(driver);
    }

    public LandingPage navigateToHome() {
        brandLogo.click();
        return new LandingPage(driver);
    }
}