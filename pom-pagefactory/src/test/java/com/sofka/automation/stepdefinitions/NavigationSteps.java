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

import static org.assertj.core.api.Assertions.assertThat;

public class NavigationSteps {

    private final WebDriver driver = BaseRunner.getDriver();
    private NavigationBar navigationBar;
    private KudosListPage kudosListPage;
    private KudoSendPage kudoSendPage;
    private LandingPage landingPage;

    @Given("el usuario se encuentra en la landing page de Sofkianos")
    public void elUsuarioSeEncuentraEnLaLandingPageDeSofkianos() {
        driver.get(TestConstants.BASE_URL + "/");
        navigationBar = new NavigationBar(driver);
        landingPage = new LandingPage(driver);
    }

    @When("selecciona {string} en la barra de navegación")
    public void seleccionaEnLaBarraDeNavegacion(String linkText) {
        switch (linkText) {
            case "Explorar Kudos" -> kudosListPage = navigationBar.navigateToExploreKudos();
            case "Acceder" -> kudoSendPage = navigationBar.navigateToSendKudos();
        }
    }

    @Then("accede a la página de exploración de kudos")
    public void accedeALaPaginaDeExploracionDeKudos() {
        assertThat(kudosListPage.isPageTitleDisplayed()).isTrue();
    }

    @Then("accede al formulario de envío de kudos")
    public void accedeAlFormularioDeEnvioDeKudos() {
        assertThat(kudoSendPage.isPageHeadingDisplayed()).isTrue();
    }

    @When("selecciona el logo de SofkianOS en la barra de navegación")
    public void seleccionaElLogoDeSofkianosEnLaBarraDeNavegacion() {
        navigationBar = new NavigationBar(driver);
        landingPage = navigationBar.navigateToHome();
    }

    @Then("regresa a la landing page principal")
    public void regresaALaLandingPagePrincipal() {
        assertThat(landingPage.isHeroTitleDisplayed()).isTrue();
    }
}
