package com.sofka.automation.runners;

import io.cucumber.junit.CucumberOptions;
import net.serenitybdd.cucumber.CucumberWithSerenity;
import org.junit.runner.RunWith;

@RunWith(CucumberWithSerenity.class)
@CucumberOptions(
	features = "src/test/resources/features/kudos_send.feature",
	glue = "com.sofka.automation.stepdefinitions",
	tags = "not @skip",
	plugin = {"pretty", "html:build/reports/cucumber-send-report.html"}
)
public class RunKudosSendTest {
}
