from appium.webdriver.common.appiumby import AppiumBy as By  # Import AppiumBy
from Pages.base_page import BasePage  # Import BasePage
from Pages.Feed.locaters import HomeLocators  # Import LoginLocators

class HomePage(BasePage):
    """ Page Object for Login Page """
    
    SIDEBAR_BUTTON = HomeLocators.SIDEBAR_BUTTON
    WELCOME_MESSAGE = HomeLocators.WELCOME_MESSAGE
    CLOSE_BUTTON = HomeLocators.CLOSE_BUTTON
    SEARCH_BAR = HomeLocators.SEARCH_BAR
    
        
    def click_Sidebar(self):
        self.click(self.SIDEBAR_BUTTON)
    
    def click_close_button(self):
        self.click(self.CLOSE_BUTTON)
    
    def click_search_bar(self):
        self.click(self.SEARCH_BAR)
    
    def get_message(self , message):
        return self.get_text(message)
    
    def get_message(self):
        return self.get_text(self.MESSAGE)
    
        