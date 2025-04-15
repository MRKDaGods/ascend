from Pages.Feed.home_page import HomePage
from Pages.Navigation.sidebar_page import SideBarPage
from Pages.Authentication.login_page import LoginPage
from Pages.Authentication.landing_page import LandingPage
from Pages.Feed.home_page import HomePage
from Pages.Profile.profile_page import ProfiePage
from Pages.Navigation.searchbar_page import SearchBarPage
from Test_Cases_Data.Authentication import LoginTestCasesData as TC
from logger import logger
import time

class UtilityFunctions:
    def __init__(self, appium_driver):
        self.driver = appium_driver
        self.home_page = HomePage(appium_driver)
        self.sidebar_page = SideBarPage(appium_driver)
        self.login_page = LoginPage(appium_driver)
        self.landing_page = LandingPage(appium_driver)
        self.search_bar_page = SearchBarPage(appium_driver)
        self.profile_page = ProfiePage(appium_driver)  # if needed

    def signout(self):
        self.home_page.click_sidebar()
        self.sidebar_page.click_Settings()
        time.sleep(5)
        self.driver.swipe(500, 1400, 500, 100, 1000)
        self.sidebar_page.click_Signout()
        time.sleep(1)
        self.sidebar_page.click_Confirm_Signout()
        time.sleep(1)
        
    def login(self):
        try:
            self.landing_page.click_sign_in_with_email()
        except Exception as e:
            logger.info(f"error here {e}")
            pass
        self.login_page.enter_email(TC.TEST_EMAIL)
        self.driver.hide_keyboard()
        time.sleep(2)
        self.login_page.enter_password(TC.TEST_VALID_PASSWORD)
        self.driver.hide_keyboard()
        time.sleep(2)
        self.login_page.click_remember_me()
        time.sleep(1)
        self.login_page.click_continue()
        time.sleep(2)
        try:
            self.home_page.click_close_button()
        except: 
            pass
    
    def open_profile_page(self):
        self.home_page.click_sidebar()
        time.sleep(1)
        self.sidebar_page.click_Myprofile()
        time.sleep(1)
    
    def navigation_to_profile_then_click(self, click, swipe):
        try:
            if self.search_bar_page.is_visible(self.search_bar_page.SEARCH_BAR_BUTTON):
                logger.info("Search bar button found")
                self.open_profile_page()
                if swipe:
                    self.driver.swipe(583, 1900, 583, 50, 1000)
                    self.driver.swipe(583, 1000, 583, 400, 1000)
                click()
                time.sleep(2)
        except Exception as e:
            logger.info(f"error here {e}")
            # Uncomment and adapt fallback flow as needed
            try:
                if self.landing_page.get_text(self.landing_page.JOIN_A_TRUSTED_COMMUNITY_MESSAGE) == "Join a trusted community of 1B professionals":
                    logger.info("User is in landing page")
                    self.landing_page.click_sign_in_with_email()
                    self.login()
                    self.open_profile_page()
                    if swipe:
                        self.driver.swipe(583, 1900, 583, 50, 1000)
                        self.driver.swipe(583, 1000, 583, 400, 1000)
                    click()
                    time.sleep(2)
            except:
                self.login()
                self.open_profile_page()
                if swipe:
                    self.driver.swipe(583, 1900, 583, 50, 1000)
                    self.driver.swipe(583, 1000, 583, 400, 1000)
                click()
