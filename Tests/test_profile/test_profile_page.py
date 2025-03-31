from Pages.Profile.profile_page import ProfiePage
from Pages.Navigation.sidebar_page import SideBarPage
from Pages.Feed.home_page import HomePage
import time
from logger import logger

def test_profile_page(appium_driver):
    logger.info("Testing profile page")
    profile_page = ProfiePage(appium_driver) 
    home_page = HomePage(appium_driver)
    sidebar_page = SideBarPage(appium_driver)
    logger.info("clicking sidebar in home page")
    home_page.click_Sidebar()
    time.sleep(1)
    logger.info("clicking my profile in sidebar")
    sidebar_page.click_Myprofile()
    time.sleep(1)
    logger.info("clicking edit profile in profile page")
    
    profile_page.click_edit_profile()
    time.sleep(5)
    
    

    
def test_profile_page2(appium_driver):
    logger.info("Testing profile page 2")
    profile_page = ProfiePage(appium_driver) 
    home_page = HomePage(appium_driver)
    sidebar_page = SideBarPage(appium_driver)
    logger.info("clicking sidebar in home page")
    home_page.click_Sidebar()
    time.sleep(1)
    logger.info("clicking my profile in sidebar")
    sidebar_page.click_Myprofile()
    time.sleep(1)
    logger.info("clicking edit cover in profile page")
    
    profile_page.click_edit_cover_image()
    time.sleep(5)