package com.sofka.automation.pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class KudoSendPage {

    private final WebDriver driver;
    private final WebDriverWait wait;

    @FindBy(xpath = "//h2[contains(.,'Reconoce a un')]")
    private WebElement pageHeading;

    @FindBy(xpath = "//select[..//label[contains(text(),'De (Remitente)')]]")
    private WebElement senderSelect;

    @FindBy(xpath = "//select[..//label[contains(text(),'Para (Destino)')]]")
    private WebElement recipientSelect;

    @FindBy(xpath = "//select[../label[contains(text(),'Categoría')]]")
    private WebElement categorySelect;

    @FindBy(xpath = "//textarea[@placeholder='Escribe tu mensaje...']")
    private WebElement messageTextArea;

    @FindBy(xpath = "//span[contains(text(),'Desliza para enviar')]")
    private WebElement slideToSendLabel;

    @FindBy(xpath = "//p[contains(text(),'No pudimos enviar tu Kudo')]")
    private WebElement serverErrorBanner;

    @FindBy(css = "img[alt='Identity']")
    private WebElement recipientAvatarPreview;

    public KudoSendPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        PageFactory.initElements(driver, this);
    }

    public boolean isPageHeadingDisplayed() {
        wait.until(ExpectedConditions.visibilityOf(pageHeading));
        return pageHeading.isDisplayed();
    }

    public void selectSender(String senderName) {
        senderSelect.sendKeys(senderName);
    }

    public void selectRecipient(String recipientName) {
        recipientSelect.sendKeys(recipientName);
    }

    public void selectCategory(String category) {
        categorySelect.sendKeys(category);
    }

    public void writeMessage(String message) {
        messageTextArea.clear();
        messageTextArea.sendKeys(message);
    }

    public boolean isSlideToSendVisible() {
        return slideToSendLabel.isDisplayed();
    }

    public boolean isRecipientAvatarDisplayed() {
        wait.until(ExpectedConditions.visibilityOf(recipientAvatarPreview));
        return recipientAvatarPreview.isDisplayed();
    }

    public boolean isServerErrorDisplayed() {
        return serverErrorBanner.isDisplayed();
    }

    public void fillKudoForm(String sender, String recipient, String category, String message) {
        selectSender(sender);
        selectRecipient(recipient);
        selectCategory(category);
        writeMessage(message);
    }
}
