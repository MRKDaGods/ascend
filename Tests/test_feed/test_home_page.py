from utility import UtilityFunctions 
from Pages.Authentication.landing_page import LandingPage
from Pages.Feed.home_page import HomePage
from logger import logger
import pytest
from Pages.Navigation.navigationbar_page import NavigationBarPage
from Pages.Navigation.searchbar_page import SearchBarPage
from Pages.Profile.edit_profile_page import EditProfilePage

import time

###############################################################
# to import enter key 
from appium import webdriver
from appium.webdriver.extensions.android.nativekey import AndroidKey

@pytest.fixture
def setup_test(appium_driver):
    search_bar_page = SearchBarPage(appium_driver)
    navigation_bar_page = NavigationBarPage(appium_driver)
    home_page = HomePage(appium_driver)
    utils = UtilityFunctions(appium_driver)

    if search_bar_page.is_visible(search_bar_page.SEARCH_BAR_BUTTON):
        return home_page, navigation_bar_page
    else:
        utils.login()
        time.sleep(3)
        return home_page, navigation_bar_page
    
def test_display_posts_in_chronoligical_order(appium_driver, setup_test):
    home_page, navigation_bar_page = setup_test
    try:
        assert home_page.is_visible(home_page.POST_INFO), "Posts are not displayed in chronological order"
        logger.info("Posts are displayed in chronological order")
    except Exception as e:
        logger.error(f"Error: {e}")
        assert False, "Posts are not displayed in chronological order"
        
def test_create_text_post(appium_driver, setup_test):
    home_page, navigation_bar_page = setup_test
    navigation_bar_page.click_NewPost()
    time.sleep(2)
    home_page.click_write_post("This is a test post")
    time.sleep(2)
    home_page.click_post_button()
    time.sleep(5)
    try:
        assert home_page.is_visible(home_page.POST_UPLOADED_SUCCESFUL_MESSAGE), "Text Post was not created successfully"
        logger.info("Text Post created successfully")
    except Exception as e:
        logger.error(f"Error: {e}")
        assert False, "Text Post was not created successfully"
    
def test_add_document_to_post(appium_driver, setup_test):
    home_page, navigation_bar_page = setup_test
    navigation_bar_page.click_NewPost()
    time.sleep(2)
    home_page.click_more_button()
    home_page.click_add_document_to_post()
    time.sleep(1)
    home_page.WRITE_DOCUMENT_TITLE("Project Document")
    time.sleep(2)
    home_page.click_choose_document_file()
    home_page.click_document_file()
    time.sleep(3)
    home_page.click_next_button()
    time.sleep(1)
    home_page.click_write_post("This is a test post with a document")
    time.sleep(2)
    home_page.click_post_button()
    try:
        assert home_page.is_visible(home_page.POST_UPLOADED_SUCCESFUL_MESSAGE), "Document Post was not created successfully"
        logger.info("Document Post created successfully")
    except Exception as e:
        logger.error(f"Error: {e}")
        assert False, "Document Post was not created successfully"
    
#def test_add_image_to_post(appium_driver, setup_test):
    home_page, navigation_bar_page = setup_test
    navigation_bar_page.click_NewPost()
    time.sleep(2)
    home_page.click_add_photo_to_post()
    # choose photo from galery 
    home_page.click_next_button()
    time.sleep(1)
    home_page.click_write_post("This is a test post with a photo")
    time.sleep(2)
    home_page.click_post_button()
    time.sleep(5)
    try:
        assert home_page.is_visible(home_page.POST_UPLOADED_SUCCESFUL_MESSAGE), "Image Post was not created successfully"
        logger.info("Image Post created successfully")
    except Exception as e:
        logger.error(f"Error: {e}")
        assert False, "Image Post was not created successfully"
    
#def test_add_video_to_post(appium_driver, setup_test):
    home_page, navigation_bar_page = setup_test
    navigation_bar_page.click_NewPost()
    home_page.ADD_PHOTO_TO_POST()
    ##Choose video form galery 
    home_page.click_next_button()
    time.sleep(1)
    home_page.click_write_post("This is a test post with a photo")
    time.sleep(2)
    home_page.click_post_button()
    time.sleep(5)
    try:
        assert home_page.is_visible(home_page.POST_UPLOADED_SUCCESFUL_MESSAGE), "Video Post was not created successfully"
        logger.info("Video Post created successfully")
    except Exception as e:
        logger.error(f"Error: {e}")
        assert False, "Video Post was not created successfully"
    
#def test_add_link_to_post(appium_driver, setup_test):
    #there is no icon to attach link in the app

def test_edit_post(appium_driver, setup_test):
    home_page, navigation_bar_page = setup_test
    edit_profile_page = EditProfilePage(appium_driver)
    utils = UtilityFunctions(appium_driver)
    utils.open_profile_page()
    edit_profile_page.c
    