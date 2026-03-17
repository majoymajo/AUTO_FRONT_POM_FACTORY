package com.sofka.automation.runners;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.edge.EdgeOptions;

import java.util.Locale;

public abstract class BaseRunner {

    private static final ThreadLocal<WebDriver> DRIVER = new ThreadLocal<>();

    protected BaseRunner() {
    }

    public static WebDriver getDriver() {
        WebDriver current = DRIVER.get();
        if (current != null) {
            return current;
        }

        String browser = System.getProperty("browser",
                System.getenv().getOrDefault("BROWSER", "edge")).toLowerCase(Locale.ROOT);
        WebDriver created = "chrome".equals(browser) ? createChromeDriver() : createEdgeDriver();
        created.manage().window().setSize(new Dimension(1000, 800));
        DRIVER.set(created);
        return created;
    }

    public static void quitDriver() {
        WebDriver current = DRIVER.get();
        if (current != null) {
            current.quit();
            DRIVER.remove();
        }
    }

    private static WebDriver createEdgeDriver() {
        try {
            // Try to use WebDriverManager first (for CI/CD environments)
            WebDriverManager.edgedriver().setup();
        } catch (Exception e) {
            // Fallback for local development when WebDriverManager can't download
            System.out.println("[INFO] WebDriverManager download failed (network issue), using system Edge driver");
        }
        
        EdgeOptions options = new EdgeOptions();
        options.addArguments(
                "--remote-allow-origins=*",
                "--test-type",
                "--no-sandbox",
                "--ignore-certificate-errors",
                "--window-size=1000,800",
                "--incognito",
                "--disable-infobars",
                "--disable-gpu",
                "--disable-default-apps",
                "--disable-popup-blocking",
                "--disable-dev-shm-usage",
                "--disable-extensions",
                "--disable-web-security",
                "--disable-translate",
                "--disable-logging"
        );
        return new EdgeDriver(options);
    }

    private static WebDriver createChromeDriver() {
        String driverPath = System.getProperty("webdriver.chrome.driver");
        if (driverPath == null || driverPath.isEmpty()) {
            try {
                // Try to use WebDriverManager first (for CI/CD environments)
                WebDriverManager.chromedriver().setup();
            } catch (Exception e) {
                // Fallback for local development when WebDriverManager can't download
                System.out.println("[INFO] WebDriverManager download failed (network issue), using system Chrome driver");
            }
        } else {
            System.out.println("[INFO] Using system ChromeDriver from: " + driverPath);
        }
        
        ChromeOptions options = new ChromeOptions();
        options.addArguments(
                "--headless",              // Required in CI: no display server available
                "--remote-allow-origins=*",
                "--test-type",
                "--no-sandbox",
                "--ignore-certificate-errors",
                "--window-size=1000,800",
                "--incognito",
                "--disable-infobars",
                "--disable-gpu",
                "--disable-default-apps",
                "--disable-popup-blocking",
                "--disable-dev-shm-usage",
                "--disable-extensions",
                "--disable-web-security",
                "--disable-translate",
                "--disable-logging"
        );
        return new ChromeDriver(options);
    }
}