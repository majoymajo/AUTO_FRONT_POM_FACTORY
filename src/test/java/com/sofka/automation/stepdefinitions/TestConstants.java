package com.sofka.automation.stepdefinitions;

public final class TestConstants {

    public static final String BASE_URL = System.getProperty("base.url", "http://localhost:5173");
    public static final int TIMEOUT = Integer.getInteger("webdriver.wait", 10);

    private TestConstants() {
    }
}