from Pages.Profile.profile_page import ProfiePage
from Pages.Profile.edit_profile_page import EditProfilePage
from Pages.Authentication.landing_page import LandingPage
from Pages.Feed.home_page import HomePage
import time
from utility import UtilityFunctions 
from logger import logger
import pytest


@pytest.fixture
def setup_test(appium_driver):
    profile_page = ProfiePage(appium_driver)
    edit_profile_page = EditProfilePage(appium_driver)
    home_page = HomePage(appium_driver)
    landing_page = LandingPage(appium_driver)
    utils = UtilityFunctions(appium_driver)
    logger.info("Testing edit profile page")
    # if user is logged in, open profile page then edit profile page , else login then open profile page and edit profile page
    utils.navigation_to_profile_then_click(profile_page.click_edit_profile, False)
    # try:
    #     if home_page.get_text(home_page.SEARCH_BAR) == "Search":
    #         UtilityFunctions.open_profile_page(appium_driver)
    #         profile_page.click_edit_profile()
    #         time.sleep(2)
    # except:
    #     try:
    #         # if the user in landing page , click sign in with email and proceed to login
    #         if landing_page.get_text(landing_page.JOIN_A_TRUSTED_COMMUNITY_MESSAGE) == "Join a trusted community of 1B professionals":
    #             landing_page.click_sign_in_with_email()
    #             UtilityFunctions.login(appium_driver)
    #             UtilityFunctions.open_profile_page(appium_driver)
    #             profile_page.click_edit_profile()
    #             time.sleep(2)
    #     except:
    #         #if the user is not in landing page , then the user is in login page , login then open profile page and edit profile page
    #         UtilityFunctions.login(appium_driver)
    #         UtilityFunctions.open_profile_page(appium_driver)
    #         profile_page.click_edit_profile()

    return edit_profile_page, profile_page

def test_edit_valid_name(appium_driver, setup_test):
    edit_profile_page, profile_page = setup_test
    logger.info("Testing edit valid name")
    edit_profile_page.edit_first_name("Tark")
    appium_driver.hide_keyboard()
    time.sleep(2)
    edit_profile_page.edit_last_name("mahmoud")
    appium_driver.hide_keyboard()
    time.sleep(1)
    edit_profile_page.click_save()
    time.sleep(5)
    try:
        assert "Tark" in profile_page.get_message(profile_page.NAME), "Edit valid name test failed"
        logger.info("Edit valid name test passed")
    except Exception as e:
        logger.error(f"Edit valid name test failed: {e}")
        assert False, "Edit valid name test failed"
    
    
def test_edit_invalid_name(appium_driver, setup_test):
    edit_profile_page, _ = setup_test
    logger.info("Testing edit invalid name")
    edit_profile_page.edit_first_name("Tark3@")
    appium_driver.hide_keyboard()
    time.sleep(2)
    edit_profile_page.edit_last_name("mahmoud33")
    appium_driver.hide_keyboard()
    time.sleep(2)
    try:
        error_message = "Please remove any special characters or numbers, and try again."
        assert (error_message in edit_profile_page.get_message(edit_profile_page.NAME_ERROR_MESSAGE_1) and
                error_message in edit_profile_page.get_message(edit_profile_page.NAME_ERROR_MESSAGE_2)), "Edit invalid name test failed"
        logger.info("Edit invalid name test passed")
    except Exception as e:
        logger.error(f"Edit invalid name test failed: {e}")
        assert False, "Edit invalid name test failed"
    

def test_edit_valid_headline(appium_driver, setup_test):
    edit_profile_page, profile_page = setup_test
    logger.info("Testing edit valid headline")
    edit_profile_page.edit_headline("Software Engineer")
    appium_driver.hide_keyboard()
    time.sleep(2)
    edit_profile_page.click_save()
    time.sleep(1)
    edit_profile_page.click_dismiss()
    time.sleep(5)
    try:
        assert "Software Engineer" in profile_page.get_message(profile_page.HEADLINE), "Edit valid headline test failed"
        logger.info("Edit valid headline test passed")
    except Exception as e:
        logger.error(f"Edit valid headline test failed: {e}")
        assert False, "Edit valid headline test failed"
   
    
def test_edit_invalid_headline(appium_driver, setup_test):
    edit_profile_page, _ = setup_test
    logger.info("Testing edit invalid headline")
    edit_profile_page.edit_headline("Software Engineer<>?!*^")
    appium_driver.hide_keyboard()
    time.sleep(2)
    try:
        error_message = "Please remove any special characters or numbers, and try again."
        assert error_message in edit_profile_page.get_message(edit_profile_page.HEADLINE_ERROR_MESSAGE), "Edit invalid headline test failed"
        logger.info("Edit invalid headline test passed")
    except Exception as e:
        logger.error(f"Edit invalid headline test failed: {e}")
        assert False, "Edit invalid headline test failed"