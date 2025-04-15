from appium.webdriver.common.appiumby import AppiumBy as By  # Import AppiumBy
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from Pages.base_page import BasePage  # Import your base page class
from Pages.Authentication.locaters import LandingLocators  # Import your locators

class LandingPage(BasePage):

    AGREE_JOIN_BUTTON = LandingLocators.AGREE_JOIN_BUTTON
    CONTINUE_WITH_GOOGLE = LandingLocators.CONTINUE_WITH_GOOGLE
    SIGN_IN_WITH_EMAIL = LandingLocators.SIGN_IN_WITH_EMAIL
    JOIN_A_TRUSTED_COMMUNITY_MESSAGE = LandingLocators.JOIN_A_TRUSTED_COMMUNITY_MESSAGE
    SIGN_IN_WITH_EMAIL2 = LandingLocators.SIGN_IN_WITH_EMAIL2

    def click_continue_with_google(self):
        self.click(self.CONTINUE_WITH_GOOGLE)
    
    def click_agree_join_button(self):
        self.click(self.AGREE_JOIN_BUTTON)
    
    def click_sign_in_with_email(self):
        try:
            self.click(self.SIGN_IN_WITH_EMAIL)
        except:
            self.click(self.SIGN_IN_WITH_EMAIL2)