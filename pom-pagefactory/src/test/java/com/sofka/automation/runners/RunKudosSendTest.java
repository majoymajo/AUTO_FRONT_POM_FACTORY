package com.sofka.automation.runners;

import io.cucumber.junit.CucumberOptions;
import net.serenitybdd.cucumber.CucumberWithSerenity;
import org.junit.runner.RunWith;

@SuppressWarnings({"deprecation", "removal"})
@RunWith(CucumberWithSerenity.class)
@CucumberOptions(
        features = "src/test/resources/features/kudos_send.feature",
        glue = "com.sofka.automation.stepdefinitions",
        tags = "not @skip",
        plugin = {"pretty", "json:target/cucumber-report/kudos_send.json"}
)
public class RunKudosSendTest {
}
