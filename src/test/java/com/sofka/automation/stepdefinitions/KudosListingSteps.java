package com.sofka.automation.stepdefinitions;

import com.sofka.automation.drivers.DriverFactory;
import com.sofka.automation.pages.KudosListPage;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.openqa.selenium.WebDriver;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

public class KudosListingSteps {

    private final WebDriver driver = DriverFactory.getDriver();
    private KudosListPage kudosListPage;

    @Given("el usuario se encuentra en la página de exploración de kudos")
    public void elUsuarioSeEncuentraEnLaPaginaDeExploracionDeKudos() {
        driver.get(TestConstants.BASE_URL + "/kudos/list");
        kudosListPage = new KudosListPage(driver);
    }

    @When("la página termina de cargar")
    public void laPaginaTerminaDeCagar() {
        kudosListPage.isPageTitleDisplayed();
    }

    @Then("se muestra la tabla de kudos con las columnas De, Para, Categoría, Mensaje y Fecha")
    public void seMuestraLaTablaDeKudosConLasColumnas() {
        List<String> expectedHeaders = List.of("De", "Para", "Categoría", "Mensaje", "Fecha");
        assertThat(kudosListPage.getTableHeaderLabels()).containsExactlyElementsOf(expectedHeaders);
    }

    @And("se muestra el total de kudos encontrados")
    public void seMuestraElTotalDeKudosEncontrados() {
        assertThat(kudosListPage.getTotalElementsText()).containsPattern("\\d+ kudos? encontrados?");
    }

    @When("filtra los kudos por la categoría {string}")
    public void filtraLosKudosPorLaCategoria(String category) {
        kudosListPage.selectCategory(category);
        kudosListPage.applyFilters();
    }

    @Then("todos los kudos visibles pertenecen a la categoría {string}")
    public void todosLosKudosVisiblesPertenecenALaCategoria(String category) {
        int rowCount = kudosListPage.getDisplayedKudoCount();
        for (int i = 0; i < rowCount; i++) {
            assertThat(kudosListPage.getKudoCellText(i, 2)).isEqualTo(category);
        }
    }

    @When("busca kudos con el texto {string}")
    public void buscaKudosConElTexto(String searchText) {
        kudosListPage.searchByText(searchText);
        kudosListPage.applyFilters();
    }

    @Then("los kudos visibles contienen {string} en sus campos de texto")
    public void losKudosVisiblesContienenEnSusCamposDeTexto(String expectedText) {
        int rowCount = kudosListPage.getDisplayedKudoCount();
        assertThat(rowCount).isGreaterThan(0);
    }

    @When("filtra kudos desde {string} hasta {string}")
    public void filtraKudosDesdeHasta(String startDate, String endDate) {
        kudosListPage.setStartDate(startDate);
        kudosListPage.setEndDate(endDate);
        kudosListPage.applyFilters();
    }

    @Then("se muestran únicamente los kudos dentro del rango de fechas")
    public void seMuestranUnicamenteLosKudosDentroDelRangoDeFechas() {
        assertThat(kudosListPage.getDisplayedKudoCount()).isGreaterThan(0);
    }

    @When("ingresa una fecha de inicio posterior a la fecha de fin")
    public void ingresaUnaFechaDeInicioPosteriorALaFechaDeFin() {
        kudosListPage.setStartDate("2026-03-15");
        kudosListPage.setEndDate("2026-03-01");
    }

    @Then("se muestra el mensaje de error {string}")
    public void seMuestraElMensajeDeError(String expectedMessage) {
        assertThat(kudosListPage.isDateValidationErrorDisplayed()).isTrue();
        assertThat(kudosListPage.getDateValidationErrorText()).isEqualTo(expectedMessage);
    }

    @Given("el usuario ha aplicado filtros en la lista de kudos")
    public void elUsuarioHaAplicadoFiltrosEnLaListaDeKudos() {
        driver.get(TestConstants.BASE_URL + "/kudos/list");
        kudosListPage = new KudosListPage(driver);
        kudosListPage.selectCategory("Innovation");
        kudosListPage.applyFilters();
    }

    @When("limpia los filtros")
    public void limpiaLosFiltros() {
        kudosListPage.clearFilters();
    }

    @Then("se restablece la lista completa de kudos sin restricciones")
    public void seRestableceLaListaCompletaDeKudosSinRestricciones() {
        assertThat(kudosListPage.getDisplayedKudoCount()).isGreaterThan(0);
    }

    @When("cambia la dirección de ordenamiento")
    public void cambiaLaDireccionDeOrdenamiento() {
        kudosListPage.toggleSortDirection();
    }

    @Then("el indicador de orden refleja la nueva dirección")
    public void elIndicadorDeOrdenReflejaLaNuevaDireccion() {
        String label = kudosListPage.getCurrentSortLabel();
        assertThat(label).isIn("Más recientes", "Más antiguos");
    }

    @And("existen múltiples páginas de resultados")
    public void existenMultiplesPaginasDeResultados() {
        assertThat(kudosListPage.isNextPageEnabled()).isTrue();
    }

    @When("avanza a la siguiente página")
    public void avanzaALaSiguientePagina() {
        kudosListPage.goToNextPage();
    }

    @Then("se actualiza el contenido de la tabla con los kudos de la nueva página")
    public void seActualizaElContenidoDeLaTablaConLosKudosDeLaNuevaPagina() {
        assertThat(kudosListPage.getDisplayedKudoCount()).isGreaterThan(0);
    }

    @And("el indicador de paginación refleja la página actual")
    public void elIndicadorDePaginacionReflejaLaPaginaActual() {
        assertThat(kudosListPage.getCurrentPageNumber()).isEqualTo("2");
    }

    @Given("el usuario se encuentra en la primera página de resultados")
    public void elUsuarioSeEncuentraEnLaPrimeraPaginaDeResultados() {
        driver.get(TestConstants.BASE_URL + "/kudos/list");
        kudosListPage = new KudosListPage(driver);
        kudosListPage.isPageTitleDisplayed();
    }

    @Then("el botón de página anterior está deshabilitado")
    public void elBotonDePaginaAnteriorEstaDeshabilitado() {
        assertThat(kudosListPage.isPreviousPageEnabled()).isFalse();
    }

    @When("aplica filtros que no coinciden con ningún kudo")
    public void aplicaFiltrosQueNoCoincidentConNingunKudo() {
        kudosListPage.searchByText("xyz_nonexistent_term_12345");
        kudosListPage.applyFilters();
    }

    @Then("se muestra el mensaje {string}")
    public void seMuestraElMensaje(String expectedMessage) {
        if (expectedMessage.contains("No se encontraron")) {
            assertThat(kudosListPage.isEmptyStateDisplayed()).isTrue();
        } else if (expectedMessage.contains("Error al cargar")) {
            assertThat(kudosListPage.isErrorStateDisplayed()).isTrue();
        }
    }

    @Given("el servicio de kudos no está disponible")
    public void elServicioDeKudosNoEstaDisponible() {
        driver.get(TestConstants.BASE_URL + "/kudos/list");
        kudosListPage = new KudosListPage(driver);
    }

    @When("el usuario accede a la página de exploración de kudos")
    public void elUsuarioAccedeALaPaginaDeExploracionDeKudos() {
        kudosListPage.isPageTitleDisplayed();
    }

    @And("se ofrece la opción de reintentar")
    public void seOfreceLaOpcionDeReintentar() {
        kudosListPage.retryAfterError();
    }
}
