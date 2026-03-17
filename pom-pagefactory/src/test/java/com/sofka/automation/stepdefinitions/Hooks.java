package com.sofka.automation.stepdefinitions;

import com.sofka.automation.runners.BaseRunner;
import io.cucumber.java.After;
import io.cucumber.java.Before;

public class Hooks {

    @Before
    public void setUp() {
        BaseRunner.getDriver();
    }

    @After
    public void tearDown() {
        BaseRunner.quitDriver();
    }
}
