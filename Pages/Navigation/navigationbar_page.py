from appium.webdriver.common.appiumby import AppiumBy as By  # Import AppiumBy
from Pages.base_page import BasePage  # Import BasePage
from Pages.Navigation.locaters import NavigationBarLocaters  

class  NavigationBarPage(BasePage):
    """ Page Object for Navigation Bar """
    
    HOME_BUTTON = NavigationBarLocaters.HOME_BUTTON
    MY_NETWORK_BUTTON = NavigationBarLocaters.MY_NETWORK_BUTTON
    JOBS_BUTTON = NavigationBarLocaters.JOBS_BUTTON
    NOTIFICATIONS_BUTTON = NavigationBarLocaters.NOTIFICATIONS_BUTTON
    NEW_POST_BUTTON = NavigationBarLocaters.NEW_POST_BUTTON

    def click_Home(self):
        self.click(self.HOME_BUTTON)
    
    def click_MyNetwork(self):
        self.click(self.MY_NETWORK_BUTTON)
    
    def click_Jobs(self):
        self.click(self.JOBS_BUTTON)
    
    def click_Notifications(self):
        self.click(self.NOTIFICATIONS_BUTTON)
    
    def click_NewPost(self):
        self.click(self.NEW_POST_BUTTON)
        