package com.sofka.automation.pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

public class LandingPage {

    @FindBy(xpath = "//h1[contains(.,'SofkianOS')]")
    private WebElement pageHeading;

    @FindBy(id = "como-funciona")
    private WebElement howItWorksSection;

    @FindBy(id = "tecnologia")
    private WebElement technologySection;

    public LandingPage(WebDriver driver) {
        PageFactory.initElements(driver, this);
    }

    public boolean isHeroTitleDisplayed() {
        return pageHeading.isDisplayed();
    }

    public boolean isHowItWorksSectionVisible() {
        return howItWorksSection.isDisplayed();
    }

    public boolean isTechnologySectionVisible() {
        return technologySection.isDisplayed();
    }
}