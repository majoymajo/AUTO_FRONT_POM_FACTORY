package com.sofka.automation.stepdefinitions;

import com.sofka.automation.runners.BaseRunner;
import io.cucumber.java.After;
import io.cucumber.java.Before;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.remote.RemoteWebDriver;

public class Hooks {

    @Before
    public void setUp() {
        System.out.println("\n" + "═".repeat(80));
        System.out.println("🔧 BEFORE HOOK: Initializing WebDriver");
        System.out.println("═".repeat(80));
        
        try {
            WebDriver driver = BaseRunner.getDriver();
            
            // ✅ Log successful browser initialization
            if (driver instanceof RemoteWebDriver) {
                RemoteWebDriver remoteDriver = (RemoteWebDriver) driver;
                String browserName = remoteDriver.getCapabilities().getBrowserName();
                String browserVersion = remoteDriver.getCapabilities().getBrowserVersion();
                System.out.println("✅ WebDriver initialized successfully");
                System.out.println("   • Browser: " + browserName + " v" + browserVersion);
                System.out.println("   • Window Size: " + driver.manage().window().getSize());
                System.out.println("   • URL: " + driver.getCurrentUrl());
            } else {
                System.out.println("✅ WebDriver initialized (Chrome)");
            }
            
            // ✅ Verify frontend is accessible
            String baseUrl = TestConstants.BASE_URL;
            System.out.println("   • Base URL: " + baseUrl);
            System.out.println("═".repeat(80) + "\n");
            
        } catch (Exception e) {
            System.err.println("❌ HOOK ERROR: Failed to initialize WebDriver!");
            System.err.println("   Exception: " + e.getClass().getSimpleName());
            System.err.println("   Message: " + e.getMessage());
            System.err.println("   Cause: " + (e.getCause() != null ? e.getCause().getMessage() : "N/A"));
            e.printStackTrace();
            throw new RuntimeException("Hook setup failed - unable to initialize WebDriver", e);
        }
    }

    @After
    public void tearDown() {
        System.out.println("\n" + "═".repeat(80));
        System.out.println("🧹 AFTER HOOK: Cleaning up WebDriver");
        System.out.println("═".repeat(80) + "\n");
        
        try {
            BaseRunner.quitDriver();
            System.out.println("✅ WebDriver closed successfully");
        } catch (Exception e) {
            System.err.println("⚠️  Warning: Error closing WebDriver");
            System.err.println("   " + e.getMessage());
        }
    }
}
