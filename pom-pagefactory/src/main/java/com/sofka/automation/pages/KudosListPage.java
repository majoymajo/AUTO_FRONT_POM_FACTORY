package com.sofka.automation.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;

public class KudosListPage {

    private final WebDriver driver;
    private final WebDriverWait wait;

    @FindBy(xpath = "//h1[contains(.,'Explorar')]")
    private WebElement pageTitle;

    @FindBy(css = "[aria-label='Buscar kudos']")
    private WebElement searchInput;

    @FindBy(css = "[aria-label='Filtrar por categoría']")
    private WebElement categorySelect;

    @FindBy(css = "[aria-label='Fecha desde']")
    private WebElement startDateInput;

    @FindBy(css = "[aria-label='Fecha hasta']")
    private WebElement endDateInput;

    @FindBy(xpath = "//button[contains(text(),'Aplicar Filtros')]")
    private WebElement applyFiltersButton;

    @FindBy(xpath = "//button[contains(text(),'Limpiar')]")
    private WebElement clearFiltersButton;

    @FindBy(css = "[aria-label^='Ordenar por fecha']")
    private WebElement sortToggleButton;

    @FindBy(css = "table tbody tr")
    private List<WebElement> kudoTableRows;

    @FindBy(css = "table thead th")
    private List<WebElement> tableHeaders;

    @FindBy(xpath = "//p[contains(text(),'kudos encontrados') or contains(text(),'kudo encontrado')]")
    private WebElement totalElementsIndicator;

    @FindBy(css = "[aria-label='Página siguiente']")
    private WebElement nextPageButton;

    @FindBy(css = "[aria-label='Página anterior']")
    private WebElement previousPageButton;

    @FindBy(css = "[aria-current='page']")
    private WebElement currentPageIndicator;

    @FindBy(xpath = "//nav[@aria-label='Paginación de kudos']//p")
    private WebElement paginationRangeText;

    @FindBy(xpath = "//h3[contains(text(),'No se encontraron kudos')]")
    private WebElement emptyStateMessage;

    @FindBy(xpath = "//h3[contains(text(),'Error al cargar kudos')]")
    private WebElement errorStateTitle;

    @FindBy(xpath = "//button[contains(text(),'Reintentar')]")
    private WebElement retryButton;

    @FindBy(css = "[role='alert']")
    private WebElement dateValidationError;

    public KudosListPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        PageFactory.initElements(driver, this);
    }

    public boolean isPageTitleDisplayed() {
        wait.until(ExpectedConditions.visibilityOf(pageTitle));
        return pageTitle.isDisplayed();
    }

    public void searchByText(String text) {
        searchInput.clear();
        searchInput.sendKeys(text);
    }

    public void selectCategory(String category) {
        wait.until(ExpectedConditions.visibilityOf(categorySelect));
        wait.until(ExpectedConditions.elementToBeClickable(categorySelect));
        try {
            categorySelect.click();
            categorySelect.sendKeys(category);
        } catch (Exception ex) {
            // Fallback for custom selects that intermittently reject keyboard input.
            ((JavascriptExecutor) driver).executeScript(
                "arguments[0].value = arguments[1]; arguments[0].dispatchEvent(new Event('change', { bubbles: true }));",
                categorySelect,
                category
            );
        }
    }

    public void setStartDate(String date) {
        startDateInput.sendKeys(date);
    }

    public void setEndDate(String date) {
        endDateInput.sendKeys(date);
    }

    public void applyFilters() {
        applyFiltersButton.click();
        waitForResults();
    }

    private void waitForResults() {
        wait.until(driver -> 
            (kudoTableRows.size() > 0 && kudoTableRows.get(0).isDisplayed()) || 
            isEmptyStateDisplayed() || 
            isErrorStateDisplayed()
        );
    }

    public void clearFilters() {
        clearFiltersButton.click();
    }

    public void toggleSortDirection() {
        sortToggleButton.click();
    }

    public String getCurrentSortLabel() {
        return sortToggleButton.getText();
    }

    public int getDisplayedKudoCount() {
        return kudoTableRows.size();
    }

    public List<String> getTableHeaderLabels() {
        return tableHeaders.stream()
                .map(WebElement::getText)
                .toList();
    }

    public String getKudoCellText(int rowIndex, int columnIndex) {
        return kudoTableRows.get(rowIndex)
                .findElements(By.cssSelector("td"))
                .get(columnIndex)
                .getText();
    }

    public String getTotalElementsText() {
        return totalElementsIndicator.getText();
    }

    public void goToNextPage() {
        wait.until(ExpectedConditions.elementToBeClickable(nextPageButton)).click();
        waitForResults();
    }

    public void goToPreviousPage() {
        wait.until(ExpectedConditions.elementToBeClickable(previousPageButton)).click();
        waitForResults();
    }

    public boolean isNextPageEnabled() {
        try {
            return nextPageButton.isDisplayed() && nextPageButton.isEnabled();
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isPreviousPageEnabled() {
        try {
            return previousPageButton.isDisplayed() && previousPageButton.isEnabled();
        } catch (Exception e) {
            return false;
        }
    }

    public String getCurrentPageNumber() {
        return currentPageIndicator.getText();
    }

    public String getPaginationRangeText() {
        return paginationRangeText.getText();
    }

    public boolean isEmptyStateDisplayed() {
        try {
            return emptyStateMessage.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isErrorStateDisplayed() {
        try {
            return errorStateTitle.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public void retryAfterError() {
        retryButton.click();
    }

    public boolean isDateValidationErrorDisplayed() {
        return dateValidationError.isDisplayed();
    }

    public String getDateValidationErrorText() {
        return dateValidationError.getText();
    }
}
