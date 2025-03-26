from Pages.Feed.home_page import HomePage
from Pages.Navigation.sidebar import SideBarPage
from Pages.Authentication.login_page import LoginPage
from Pages.Authentication.landing_page import LandingPage
from Pages.Profile.profile_page import ProfiePage
from Test_Cases_Data.Authentication import LoginTestCasesData as TC
from Pages.Feed.home_page import HomePage
from Pages.Profile.profile_page import ProfiePage
import time
from logger import logger

class UtilityFunctions:
    def signout(appium_driver):
        home_page = HomePage(appium_driver)
        side_bar_page = SideBarPage(appium_driver)
        home_page.click_Sidebar()
        side_bar_page.click_Settings()
        time.sleep(5)
        appium_driver.swipe(500, 1400, 500, 100, 1000)
        side_bar_page.click_Signout()
        side_bar_page.click_Confirm_Signout()
        
    def login(appium_driver):
        login_page = LoginPage(appium_driver)
        landing_page = LandingPage(appium_driver)
        try:
            landing_page.click_sign_in_with_email()
        except:
            pass
        login_page.enter_email(TC.TEST_EMAIL)
        appium_driver.hide_keyboard()
        time.sleep(2)
        login_page.enter_password(TC.TEST_VALID_PASSWORD)
        appium_driver.hide_keyboard()
        time.sleep(2)
        login_page.click_remember_me()
        time.sleep(1)
        login_page.click_continue()
        time.sleep(2)
        try:
            HomePage.click_close_button()
        except: 
            pass
    

    def open_profile_page(appium_driver):
        home_page = HomePage(appium_driver)
        sidebar_page = SideBarPage(appium_driver)
        home_page.click_Sidebar()
        time.sleep(1)
        sidebar_page.click_Myprofile()
        time.sleep(1)
    
    def navigation_to_profile_then_click(appium_driver, click, swipe = False):
            landing_page = LandingPage(appium_driver)
            home_page = HomePage(appium_driver)
            try:
                if home_page.get_text(home_page.SEARCH_BAR) == "Search":
                    UtilityFunctions.open_profile_page(appium_driver)
                    if swipe:
                        appium_driver.swipe(583, 1900, 583, 50, 1000)
                        appium_driver.swipe(583, 1000, 583, 400, 1000)
                    click()
                    time.sleep(2)
            except:
                try:
                    # if the user in landing page , click sign in with email and proceed to login
                    if landing_page.get_text(landing_page.JOIN_A_TRUSTED_COMMUNITY_MESSAGE) == "Join a trusted community of 1B professionals":
                        logger.info("User is in landing page")
                        landing_page.click_sign_in_with_email()
                        UtilityFunctions.login(appium_driver)
                        UtilityFunctions.open_profile_page(appium_driver)
                        if swipe:
                            appium_driver.swipe(583, 1900, 583, 50, 1000)
                            appium_driver.swipe(583, 1000, 583, 400, 1000)
                        click()
                        time.sleep(2)
                except:
                    #if the user is not in landing page , then the user is in login page , login then open profile page and edit profile page
                    UtilityFunctions.login(appium_driver)
                    UtilityFunctions.open_profile_page(appium_driver)
                    if swipe:
                        appium_driver.swipe(583, 1900, 583, 50, 1000)
                        appium_driver.swipe(583, 1000, 583, 400, 1000)
                    click()