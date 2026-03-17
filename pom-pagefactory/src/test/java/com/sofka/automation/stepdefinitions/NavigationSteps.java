package com.sofka.automation.stepdefinitions;

import com.sofka.automation.pages.KudoSendPage;
import com.sofka.automation.pages.KudosListPage;
import com.sofka.automation.pages.LandingPage;
import com.sofka.automation.pages.NavigationBar;
import com.sofka.automation.runners.BaseRunner;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.NoSuchElementException;

import static org.assertj.core.api.Assertions.assertThat;

public class NavigationSteps {

    private final WebDriver driver = BaseRunner.getDriver();
    private NavigationBar navigationBar;
    private KudosListPage kudosListPage;
    private KudoSendPage kudoSendPage;
    private LandingPage landingPage;

    @Given("el usuario se encuentra en la landing page de Sofkianos")
    public void elUsuarioSeEncuentraEnLaLandingPageDeSofkianos() {
        try {
            String baseUrl = TestConstants.BASE_URL + "/";
            System.out.println("📍 Navigating to: " + baseUrl);
            
            driver.get(baseUrl);
            
            System.out.println("✅ Navigation successful");
            System.out.println("   • Current URL: " + driver.getCurrentUrl());
            System.out.println("   • Page Title: " + driver.getTitle());
            
            navigationBar = new NavigationBar(driver);
            landingPage = new LandingPage(driver);
            
        } catch (TimeoutException e) {
            System.err.println("❌ TIMEOUT: Frontend at " + TestConstants.BASE_URL + " did not respond");
            System.err.println("   Verify that http://localhost:5173 is running and accessible");
            throw new RuntimeException("Frontend is not accessible at " + TestConstants.BASE_URL, e);
        } catch (NoSuchElementException e) {
            System.err.println("❌ PAGE ELEMENT NOT FOUND: Landing page structure may have changed");
            System.err.println("   Current URL: " + driver.getCurrentUrl());
            throw new RuntimeException("Landing page elements not found", e);
        } catch (Exception e) {
            System.err.println("❌ ERROR: " + e.getClass().getSimpleName());
            System.err.println("   Message: " + e.getMessage());
            System.err.println("   Current URL: " + driver.getCurrentUrl());
            throw new RuntimeException("Failed to navigate to landing page", e);
        }
    }

    @When("selecciona {string} en la barra de navegación")
    public void seleccionaEnLaBarraDeNavegacion(String linkText) {
        try {
            System.out.println("🔍 Selecting navigation link: " + linkText);
            switch (linkText) {
                case "Explorar Kudos" -> {
                    kudosListPage = navigationBar.navigateToExploreKudos();
                    System.out.println("✅ Navigated to: Explorar Kudos");
                }
                case "Acceder" -> {
                    kudoSendPage = navigationBar.navigateToSendKudos();
                    System.out.println("✅ Navigated to: Acceder (Send Kudos)");
                }
            }
        } catch (TimeoutException e) {
            System.err.println("❌ TIMEOUT: Navigation took too long");
            System.err.println("   Link: " + linkText);
            throw new RuntimeException("Navigation timeout for: " + linkText, e);
        } catch (Exception e) {
            System.err.println("❌ ERROR: Navigation failed");
            System.err.println("   Link: " + linkText);
            System.err.println("   Exception: " + e.getMessage());
            throw new RuntimeException("Failed to navigate to: " + linkText, e);
        }
    }

    @Then("accede a la página de exploración de kudos")
    public void accedeALaPaginaDeExploracionDeKudos() {
        try {
            boolean isDisplayed = kudosListPage.isPageTitleDisplayed();
            assertThat(isDisplayed).as("Kudos List page title should be displayed").isTrue();
            System.out.println("✅ Assertion passed: Kudos List page title is displayed");
        } catch (AssertionError | NoSuchElementException e) {
            System.err.println("❌ ASSERTION FAILED: Kudos List page title not found");
            System.err.println("   Current URL: " + driver.getCurrentUrl());
            System.err.println("   Page Source (first 500 chars): " + driver.getPageSource().substring(0, Math.min(500, driver.getPageSource().length())));
            throw e;
        }
    }

    @Then("accede al formulario de envío de kudos")
    public void accedeAlFormularioDeEnvioDeKudos() {
        try {
            boolean isDisplayed = kudoSendPage.isPageHeadingDisplayed();
            assertThat(isDisplayed).as("Send Kudos form heading should be displayed").isTrue();
            System.out.println("✅ Assertion passed: Send Kudos form heading is displayed");
        } catch (AssertionError | NoSuchElementException e) {
            System.err.println("❌ ASSERTION FAILED: Send Kudos form heading not found");
            System.err.println("   Current URL: " + driver.getCurrentUrl());
            throw e;
        }
    }

    @When("selecciona el logo de SofkianOS en la barra de navegación")
    public void seleccionaElLogoDeSofkianosEnLaBarraDeNavegacion() {
        try {
            navigationBar = new NavigationBar(driver);
            landingPage = navigationBar.navigateToHome();
            System.out.println("✅ Clicked Sofkianos logo - navigating to home");
        } catch (Exception e) {
            System.err.println("❌ ERROR: Failed to click Sofkianos logo");
            throw new RuntimeException("Failed to navigate to home via logo", e);
        }
    }

    @Then("regresa a la landing page principal")
    public void regresaALaLandingPagePrincipal() {
        try {
            boolean isDisplayed = landingPage.isHeroTitleDisplayed();
            assertThat(isDisplayed).as("Landing page hero title should be displayed").isTrue();
            System.out.println("✅ Assertion passed: Returned to landing page");
        } catch (AssertionError | NoSuchElementException e) {
            System.err.println("❌ ASSERTION FAILED: Landing page hero title not found");
            System.err.println("   Current URL: " + driver.getCurrentUrl());
            throw e;
        }
    }
}
