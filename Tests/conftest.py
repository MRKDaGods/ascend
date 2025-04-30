import pytest
import json
import os
from appium import webdriver
from appium.options.android import UiAutomator2Options
from appium.options.common import AppiumOptions
from appium.webdriver.common.appiumby import AppiumBy 
from logger import logger
  
  
# @pytest.hookimpl(tryfirst=True, hookwrapper=True)
# def pytest_runtest_makereport(item, call):
#     """ Attach screenshots to pytest-html report """
#     outcome = yield
#     report = outcome.get_result()

#     if report.failed:
#         driver = item.funcargs.get("appium_driver", None)
#         if driver:
#             screenshot_path = f"screenshots/{item.name}.png"
#             driver.save_screenshot(screenshot_path)
#             with open(screenshot_path, "rb") as f:
#                 pytest_html = item.config.pluginmanager.getplugin("html")
#                 extra = getattr(report, "extra", [])
#                 extra.append(pytest_html.extras.image(f.read()))
#                 report.extra = extra
                
@pytest.fixture(scope="function")
def appium_driver():
    """ Load desired capabilities from config.json (outside tests folder) and initialize Appium driver. """
    
    # Get project root directory
    root_dir = os.path.dirname(os.path.abspath(__file__))  # Gets 'tests/' folder path
    config_path = os.path.join(root_dir, "..", "config1.json")  # Moves one level up
    
    # Load capabilities from JSON
    with open(config_path, "r") as f:
        config = json.load(f)
    # Convert JSON to UiAutomator2Options
    options = UiAutomator2Options()
    for key, value in config.items():
        setattr(options, key, value)
    # Start Appium session
    driver = webdriver.Remote(command_executor="http://localhost:4723", options = options ) # Make sure 'options' is correctly set up
     # Explicitly activate the app in case Appium fails to launch it
    # driver.activate_app("com.linkedin.android")
    driver.activate_app("com.example.ascend_app") #adjust for linkedin ########################################################

    # Wait for LinkedIn to fully load (ensure activity is correct)
    # driver.wait_activity("com.linkedin.android.authenticator.LaunchActivityDefault", timeout=10)
    driver.wait_activity("com.example.ascend_app.MainActivity", timeout=10) #adjust for linkedin ########################################
    # driver.wait_activity("com.linkedin.android.infra.navigation.MainActivity", timeout=10)
    yield driver  # Provide driver to tests
    
    logger.info("Tearing down Appium driver")
    # driver.terminate_app("com.linkedin.android")  # Ensure app is stopped
    driver.terminate_app("com.example.ascend_app") #adjust for linkedin #######################################################
    driver.quit()  # Cleanup after test
