package com.sofka.automation.pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class KudoSendPage {

    private final WebDriver driver;
    private final WebDriverWait wait;
    private final Actions actions;

    @FindBy(xpath = "//h2[contains(.,'Reconoce a un')]")
    private WebElement pageHeading;

    @FindBy(xpath = "//label[contains(text(),'De (Remitente)')]/following-sibling::div//select")
    private WebElement senderSelect;

    @FindBy(xpath = "//label[contains(text(),'Para (Destino)')]/following-sibling::div//select")
    private WebElement recipientSelect;

    @FindBy(xpath = "//label[contains(text(),'Categoría')]/following-sibling::div//select")
    private WebElement categorySelect;

    @FindBy(xpath = "//textarea[@placeholder='Escribe tu mensaje...']")
    private WebElement messageTextArea;

    @FindBy(xpath = "//span[contains(text(),'Desliza para enviar')]")
    private WebElement slideToSendLabel;

    // Assuming the slider handle is a div with a specific class or a sibling of the label
    @FindBy(xpath = "//div[contains(@class, 'bg-brand') and .//*[local-name()='svg']]")
    private WebElement sliderHandle;

    @FindBy(xpath = "//p[contains(text(),'No pudimos enviar tu Kudo')]")
    private WebElement serverErrorBanner;

    @FindBy(css = "img[alt='Identity']")
    private WebElement recipientAvatarPreview;

    public KudoSendPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        this.actions = new Actions(driver);
        PageFactory.initElements(driver, this);
    }

    public boolean isPageHeadingDisplayed() {
        return waitForVisibility(pageHeading).isDisplayed();
    }

    public void selectSender(String senderName) {
        waitForVisibility(senderSelect).sendKeys(senderName);
    }

    public void selectRecipient(String recipientName) {
        waitForVisibility(recipientSelect).sendKeys(recipientName);
    }

    public void selectCategory(String category) {
        waitForVisibility(categorySelect).sendKeys(category);
    }

    public void writeMessage(String message) {
        WebElement area = waitForVisibility(messageTextArea);
        area.clear();
        area.sendKeys(message);
    }

    public boolean isSlideToSendVisible() {
        return waitForVisibility(slideToSendLabel).isDisplayed();
    }

    public void performSlideToSend() {
        WebElement handle = waitForVisibility(sliderHandle);
        int width = slideToSendLabel.getSize().getWidth();
        // Slide to the right
        actions.clickAndHold(handle)
                .moveByOffset(width - 5, 0) // Full slide
                .release()
                .perform();
    }

    public String getSelectedCategory() {
        return new org.openqa.selenium.support.ui.Select(waitForVisibility(categorySelect))
                .getFirstSelectedOption().getText();
    }

    public boolean isRecipientAvatarDisplayed() {
        return waitForVisibility(recipientAvatarPreview).isDisplayed();
    }

    public boolean isServerErrorDisplayed() {
        try {
            // Increased synchronization for React rendering
            return wait.until(ExpectedConditions.visibilityOf(serverErrorBanner)).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public void fillKudoForm(String sender, String recipient, String category, String message) {
        selectSender(sender);
        selectRecipient(recipient);
        selectCategory(category);
        writeMessage(message);
    }

    /**
     * Helper method to simulate a robust WebElementFacade pattern
     * Ensures stability by waiting for visibility before any action.
     */
    private WebElement waitForVisibility(WebElement element) {
        return wait.until(ExpectedConditions.visibilityOf(element));
    }
}
