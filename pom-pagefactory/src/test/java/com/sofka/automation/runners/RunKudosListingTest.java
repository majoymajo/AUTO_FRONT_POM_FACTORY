package com.sofka.automation.runners;

import io.cucumber.junit.platform.engine.Constants;
import org.junit.platform.suite.api.*;

@Suite
@IncludeEngines("cucumber")
@SelectClasspathResource("src/test/resources/features/kudos_listing.feature")
@ConfigurationParameter(key = Constants.GLUE_PROPERTY_NAME, value = "com.sofka.automation.stepdefinitions")
@ConfigurationParameter(key = Constants.FILTER_TAGS_PROPERTY_NAME, value = "not @skip")
public class RunKudosListingTest {
}
