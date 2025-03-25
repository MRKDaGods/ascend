from Pages.Profile.profile_page import ProfiePage
from Pages.Profile.edit_profile_page import EditProfilePage
from Pages.Authentication.landing_page import LandingPage
from Pages.Feed.home_page import HomePage
from Pages.Profile.cover_photo_page import CoverPhotoPage
import time
from utility import UtilityFunctions 
from logger import logger
import pytest


@pytest.fixture
def setup_test(appium_driver):
    profile_page = ProfiePage(appium_driver)
    home_page = HomePage(appium_driver)
    landing_page = LandingPage(appium_driver)
    cover_photo_page = CoverPhotoPage(appium_driver)
    logger.info("Testing Cover photo page")
    # if user is logged in, open profile page then edit profile page , else login then open profile page 
    try:
        if home_page.get_text(home_page.SEARCH_BAR) == "Search":
            UtilityFunctions.open_profile_page(appium_driver)
            profile_page.click_edit_cover_image()
            time.sleep(2)
    except:
        try:
            # if the user in landing page , click sign in with email and proceed to login
            if landing_page.get_text(landing_page.JOIN_A_TRUSTED_COMMUNITY_MESSAGE) == "Join a trusted community of 1B professionals":
                logger.info("User is in landing page")
                landing_page.click_sign_in_with_email()
                UtilityFunctions.login(appium_driver)
                UtilityFunctions.open_profile_page(appium_driver)
                profile_page.click_edit_cover_image()
                time.sleep(2)
        except:
            #if the user is not in landing page , then the user is in login page , login then open profile page 
            UtilityFunctions.login(appium_driver)
            UtilityFunctions.open_profile_page(appium_driver)
            profile_page.click_edit_cover_image()

    return cover_photo_page, profile_page

def test_upload_invalid_corrupted_image(appium_driver, setup_test):
    cover_photo_page, _ = setup_test
    logger.info("Testing edit invalid cover image")
    cover_photo_page.click_upload_photo()
    time.sleep(2)
    cover_photo_page.click_upload_from_gallery()
    time.sleep(1)
    cover_photo_page.click_invalid_cover_photo()
    time.sleep(2)
    cover_photo_page.click_done()
    time.sleep(5)
    
    try:
        assert "Submission failed" in cover_photo_page.get_message(cover_photo_page.SUMBISSION_FAILED_MESSAGE), "Edit invalid corrupted cover image test failed"
        logger.info("Edit invalid cover image test passed") 
    except Exception as e:
        logger.error(f"Edit invalid corrupted cover image test failed: {e}")
        assert False, "Edit invalid corrupted cover image test failed"
        
def test_upload_valid_image(appium_driver, setup_test):
    cover_photo_page, profile_page = setup_test
    logger.info("Testing uploading valid Cover image")
    cover_photo_page.click_upload_photo()
    time.sleep(1)
    cover_photo_page.click_upload_from_gallery()
    time.sleep(2)
    cover_photo_page.click_valid_cover_photo()
    time.sleep(2)
    cover_photo_page.click_done()
    time.sleep(5)
    
    try:
        assert "Tark" in profile_page.get_message(profile_page.NAME), "Upload valid cover image test failed"
        logger.info("Upload valid cover image test passed") 
    except Exception as e:
        logger.error(f"Upload valid cover image test failed: {e}")
        assert False, "Upload valid cover image test failed"

def test_edit_valid_image(appium_driver, setup_test):
    cover_photo_page, profile_page = setup_test
    logger.info("Testing edit valid cover image")
    cover_photo_page.click_update_photo()
    time.sleep(1)
    cover_photo_page.click_upload_photo()
    time.sleep(2)
    cover_photo_page.click_upload_from_gallery()
    time.sleep(1)
    cover_photo_page.click_valid_cover_photo()
    time.sleep(2)
    cover_photo_page.click_done()
    time.sleep(5)
    cover_photo_page.click_close()
    time.sleep(1)
    try:
        assert "Tark" in profile_page.get_message(profile_page.NAME), "Edit valid cover image test failed"
        logger.info("Edit valid cover image test passed")
    except Exception as e:
        logger.error(f"Edit valid cover image test failed: {e}")
        assert False, "Edit valid cover image test failed"
        

    