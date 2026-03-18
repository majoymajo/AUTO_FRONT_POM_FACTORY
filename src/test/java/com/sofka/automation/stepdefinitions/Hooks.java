package com.sofka.automation.stepdefinitions;

import com.sofka.automation.runners.BaseRunner;
import io.cucumber.java.After;
import io.cucumber.java.Before;

public class Hooks {

    @Before
    public void setUp() {
        System.out.println("[BEFORE] Initializing WebDriver...");
        BaseRunner.getDriver();
        System.out.println("[BEFORE] WebDriver initialized - Base URL: " + TestConstants.BASE_URL);
    }

    @After
    public void tearDown() {
        System.out.println("[AFTER] Closing WebDriver...");
        BaseRunner.quitDriver();
        System.out.println("[AFTER] WebDriver closed");
    }
}