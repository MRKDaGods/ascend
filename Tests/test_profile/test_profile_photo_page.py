from Pages.Profile.profile_page import ProfiePage
from Pages.Profile.edit_profile_page import EditProfilePage
from Pages.Authentication.landing_page import LandingPage
from Pages.Feed.home_page import HomePage
from Pages.Profile.profile_photo_page import ProfilePhotoPage
import time
from utility import UtilityFunctions 
from logger import logger
import pytest


@pytest.fixture
def setup_test(appium_driver):
    profile_page = ProfiePage(appium_driver)
    home_page = HomePage(appium_driver)
    landing_page = LandingPage(appium_driver)
    profile_photo_page = ProfilePhotoPage(appium_driver)
    logger.info("Testing profile photo page")
    # if user is logged in, open profile page then edit profile page , else login then open profile page and edit profile page
    try:
        if home_page.get_text(home_page.WELCOME_MESSAGE) == "Welcome to LinkedIn":
            UtilityFunctions.open_profile_page(appium_driver)
            profile_page.click_edit_profile_image()
            time.sleep(2)
    except:
        try:
            # if the user in landing page , click sign in with email and proceed to login
            if landing_page.get_text(landing_page.JOIN_A_TRUSTED_COMMUNITY_MESSAGE) == "Join a trusted community of 1B professionals":
                logger.info("User is in landing page")
                landing_page.click_sign_in_with_email()
                UtilityFunctions.login(appium_driver)
                UtilityFunctions.open_profile_page(appium_driver)
                profile_page.click_edit_profile_image()
                time.sleep(2)
        except:
            #if the user is not in landing page , then the user is in login page , login then open profile page and edit profile page
            UtilityFunctions.login(appium_driver)
            UtilityFunctions.open_profile_page(appium_driver)
            profile_page.click_edit_profile_image()

    return profile_photo_page, profile_page

#def test_upload_invalid_corrupted_image(appium_driver, setup_test):
    profile_photo_page, _ = setup_test
    logger.info("Testing edit invalid profile image")
    profile_photo_page.click_add_profile_photo()
    time.sleep(2)
    profile_photo_page.click_upload_from_photos_button()
    time.sleep(1)
    profile_photo_page.click_invalid_profile_photo()
    time.sleep(2)
    profile_photo_page.click_save()
    
    try:
        assert "Save" in profile_photo_page.get_message(profile_photo_page.SAVE_BUTTON), "Edit invalid corrupted profile image test failed"
        logger.info("Edit invalid profile image test passed") 
    except Exception as e:
        logger.error(f"Edit invalid corrupted profile image test failed: {e}")
        assert False, "Edit invalid corrupted profile image test failed"
        
def test_upload_valid_image(appium_driver, setup_test):
    profile_photo_page, profile_page = setup_test
    logger.info("Testing uploading valid profile image")
    profile_photo_page.click_add_profile_photo()
    time.sleep(2)
    profile_photo_page.click_upload_from_photos_button()
    time.sleep(1)
    profile_photo_page.click_valid_profile_photo()
    time.sleep(2)
    profile_photo_page.click_save()
    time.sleep(3)
    
    try:
        assert "Tark" in profile_page.get_message(profile_page.NAME), "Upload valid profile image test failed"
        logger.info("Upload valid profile image test passed") 
    except Exception as e:
        logger.error(f"Upload valid profile image test failed: {e}")
        assert False, "Upload valid profile image test failed"

def test_edit_valid_image(appium_driver, setup_test):
    profile_photo_page, profile_page = setup_test
    logger.info("Testing edit valid profile image")
    profile_photo_page.click_view_or_edit_profile_photo()
    time.sleep(3)
    profile_photo_page.click_update_profile_photo()
    time.sleep(1)
    profile_photo_page.click_upload_from_photos_button()
    time.sleep(1)
    profile_photo_page.click_valid_cover_photo()
    time.sleep(2)
    profile_photo_page.click_save()
    time.sleep(3)
    profile_photo_page.click_close()
    time.sleep(2)   
    try:
        assert "Tark" in profile_page.get_message(profile_page.NAME), "Edit valid profile image test failed"
        logger.info("Edit valid profile image test passed")
    except Exception as e:
        logger.error(f"Edit valid profile image test failed: {e}")
        assert False, "Edit valid profile image test failed"
        

    