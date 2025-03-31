from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.actions.pointer_input import PointerInput
from selenium.webdriver.common.actions.interaction import POINTER_INPUT


class BasePage:
    def __init__(self, driver):
        """ Initialize the BasePage with the Appium driver """
        self.driver = driver

    def find_element(self, locator, timeout=10):
        """ Wait for an element to be present and return it """
        return WebDriverWait(self.driver, timeout).until(
                EC.visibility_of_element_located(locator))
    def click(self, locator):
        """ Click an element after waiting for it to be visible """
        element = self.find_element(locator)
        element.click()

    def send_keys(self, locator, text):
        """ Find an element and enter text into it """
        element = self.find_element(locator)
        element.send_keys(text)

    def get_text(self, locator):
        """ Get text from an element """
        return self.find_element(locator).text

    def hold_click(self, element, duration=3):
        """Hold click on an element for a given duration (in seconds)."""

        actions = ActionChains(self.driver)
        pointer = PointerInput(POINTER_INPUT, "touch")

        actions.w3c_actions.add_action(pointer.create_pointer_move(0, 'viewport', element))
        actions.w3c_actions.add_action(pointer.create_pointer_down(0))  # Press down
        actions.w3c_actions.add_action(pointer.create_pause(duration))  # Hold for 'duration' seconds
        actions.w3c_actions.add_action(pointer.create_pointer_up(0))  # Release
        actions.perform()
