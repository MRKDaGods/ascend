from Pages.Profile.profile_page import ProfiePage
from Pages.Navigation.sidebar import SideBarPage
from Pages.Feed.home_page import HomePage
from Pages.Profile.work_experience_page import WorkExperiencePage
from Pages.Profile.profile_page import ProfiePage
from Pages.Profile.edit_profile_page import EditProfilePage
from Pages.Authentication.landing_page import LandingPage
from Pages.Profile.cover_photo_page import CoverPhotoPage
from Test_Cases_Data.Profile.ProfileModule import WorkExperienceTestCasesData as TC
import time
from utility import UtilityFunctions 
from logger import logger
import pytest


@pytest.fixture
def setup_test(appium_driver):
    profile_page = ProfiePage(appium_driver) 
    home_page = HomePage(appium_driver)
    experience_page = WorkExperiencePage(appium_driver)
    sidebar_page = SideBarPage(appium_driver)
    logger.info("Testing experience page")
    # if user is logged in, open profile page then edit profile page , else login then open profile page 
    UtilityFunctions.navigation_to_profile_then_click(appium_driver, profile_page.click_add_experience , swipe = True)

    return experience_page, profile_page

def test_valid_work_experience(appium_driver, setup_test):
    
    experience_page, profile_page = setup_test
    experience_page.enter_title(TC.VALID_TITLE)
    appium_driver.hide_keyboard()
    time.sleep(1)
    experience_page.select_employment_type(TC.VALID_EMPLOYMENT_TYPE)
    experience_page.enter_company_name(TC.VALID_COMPANY_NAME)
    time.sleep(2)
    appium_driver.hide_keyboard()
    experience_page.check_currently_working()
    time.sleep(3)
    experience_page.click_start_date()
    experience_page.click_start_month()
    experience_page.click_start_year()
    time.sleep(1)
    experience_page.click_set_date()
    appium_driver.swipe(500,1500,500,100,1000)
    time.sleep(1)
    experience_page.click_end_date()
    time.sleep(2)
    experience_page.click_end_month()
    experience_page.click_end_year()
    time.sleep(1)
    experience_page.click_set_date()
    experience_page.enter_location(TC.VALID_LOCATION)
    appium_driver.hide_keyboard()
    time.sleep(2)
    experience_page.enter_description(TC.VALID_DESCRIPTION)
    appium_driver.hide_keyboard()
    experience_page.enter_profile_headline(TC.VALID_PROFILE_HEADLINE)
    time.sleep(1)
    experience_page.click_save()
    time.sleep(5)
    experience_page.click_close()
    time.sleep(1)
    
    try:
        assert "Experience" in profile_page.get_text(profile_page.EXPERIENCE_MESSAGE), "Valid Experience test failed"
        logger.info("Valid Experience test passed") 
    except Exception as e:
        logger.error(f"Valid Experience test failed: {e}")
        assert False, "Valid Experience test failed"