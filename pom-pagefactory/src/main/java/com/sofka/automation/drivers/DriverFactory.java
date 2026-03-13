package com.sofka.automation.drivers;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

public class DriverFactory {

    private static final ThreadLocal<WebDriver> DRIVER_THREAD_LOCAL = new ThreadLocal<>();

    private DriverFactory() {
    }

    public static WebDriver getDriver() {
        if (DRIVER_THREAD_LOCAL.get() == null) {
            WebDriverManager.chromedriver().setup();
            ChromeOptions options = new ChromeOptions();
            options.addArguments("--headless");
            options.addArguments("--disable-gpu");
            options.addArguments("--window-size=1920,1080");
            options.addArguments("--no-sandbox");
            DRIVER_THREAD_LOCAL.set(new ChromeDriver(options));
        }
        return DRIVER_THREAD_LOCAL.get();
    }

    public static void quitDriver() {
        WebDriver driver = DRIVER_THREAD_LOCAL.get();
        if (driver != null) {
            driver.quit();
            DRIVER_THREAD_LOCAL.remove();
        }
    }
}
