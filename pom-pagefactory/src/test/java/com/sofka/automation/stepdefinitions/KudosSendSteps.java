package com.sofka.automation.stepdefinitions;

import com.sofka.automation.pages.KudoSendPage;
import com.sofka.automation.pages.NavigationBar;
import com.sofka.automation.runners.BaseRunner;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.openqa.selenium.WebDriver;

import static org.assertj.core.api.Assertions.assertThat;

public class KudosSendSteps {

    private final WebDriver driver = BaseRunner.getDriver();
    private KudoSendPage kudoSendPage;

    @Given("el usuario se encuentra en el formulario de envío de kudos")
    public void elUsuarioSeEncuentraEnElFormularioDeEnvioDeKudos() {
        driver.get(TestConstants.BASE_URL + "/kudos");
        kudoSendPage = new KudoSendPage(driver);
    }

    @When("navega hacia la sección de envío de kudos")
    public void navegaHaciaLaSeccionDeEnvioDeKudos() {
        NavigationBar navbar = new NavigationBar(driver);
        kudoSendPage = navbar.navigateToSendKudos();
    }

    @Then("se muestra el formulario de reconocimiento con los campos Remitente, Destinatario, Categoría y Mensaje")
    public void seMuestraElFormularioDeReconocimiento() {
        assertThat(kudoSendPage.isPageHeadingDisplayed()).isTrue();
        assertThat(kudoSendPage.isSlideToSendVisible()).isTrue();
    }

    @When("completa el formulario con remitente, destinatario, categoría y mensaje válidos")
    public void completaElFormularioConDatosValidos() {
        kudoSendPage.fillKudoForm(
                "Ana García",
                "Carlos López",
                "Innovation",
                "Excelente trabajo liderando la iniciativa de automatización del equipo");
    }

    @Then("se muestra la previsualización del avatar del destinatario")
    public void seMuestraLaPrevisualizacionDelAvatarDelDestinatario() {
        assertThat(kudoSendPage.isRecipientAvatarDisplayed()).isTrue();
    }

    @Then("el control de envío por deslizamiento está visible")
    public void elControlDeEnvioPorDeslizamientoEstaVisible() {
        assertThat(kudoSendPage.isSlideToSendVisible()).isTrue();
    }

    @Given("el usuario ha completado el formulario de envío de kudos")
    public void elUsuarioHaCompletadoElFormularioDeEnvioDeKudos() {
        driver.get(TestConstants.BASE_URL + "/kudos");
        kudoSendPage = new KudoSendPage(driver);
        kudoSendPage.fillKudoForm(
                "Ana García",
                "Carlos López",
                "Teamwork",
                "Gracias por tu apoyo constante en las reuniones de planificación");
    }

    @When("el envío es rechazado por el servidor")
    public void elEnvioEsRechazadoPorElServidor() {
        kudoSendPage.performSlideToSend();
    }

    @Then("se muestra el banner de error con el detalle de los campos inválidos")
    public void seMuestraElBannerDeErrorConElDetalleDeLosCamposInvalidos() {
        assertThat(kudoSendPage.isServerErrorDisplayed())
                .withFailMessage("Expected server error banner to be displayed but it was not.")
                .isTrue();
    }

    @When("selecciona la categoría {string}")
    public void seleccionaLaCategoria(String category) {
        kudoSendPage.selectCategory(category);
    }

    @Then("la categoría {string} queda seleccionada en el formulario")
    public void laCategoriaQuedaSeleccionadaEnElFormulario(String category) {
        assertThat(kudoSendPage.getSelectedCategory())
                .isEqualTo(category);
    }
}
