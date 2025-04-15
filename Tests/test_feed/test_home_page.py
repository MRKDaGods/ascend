from utility import UtilityFunctions 
from Pages.Authentication.landing_page import LandingPage
from Pages.Feed.home_page import HomePage
from logger import logger
import pytest
from Pages.Navigation.navigationbar_page import NavigationBarPage
from Pages.Navigation.sidebar_page import SideBarPage
from Pages.Navigation.searchbar_page import SearchBarPage
from Pages.Profile.profile_page import ProfiePage
from Pages.Profile.profile_photo_page import ProfilePhotoPage

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
        
def test_edit_post(appium_driver, setup_test):
    home_page, navigation_bar_page = setup_test
    profile_page = ProfiePage(appium_driver)
    utils = UtilityFunctions(appium_driver)
    utils.open_profile_page()
    time.sleep(2)
    appium_driver.swipe(500, 1300, 500, 100 ,1000)
    profile_page.click_show_all_posts()
    time.sleep(1)
    profile_page.click_post_options()
    time.sleep(1)
    profile_page.click_edit_post()
    time.sleep(1)
    home_page.click_write_post("This is a test for editing a post")
    time.sleep(1)
    home_page.click_post_button()
    time.sleep(1)
    try:
        assert home_page.is_visible(profile_page.EDIT_POST_MESSAGE), "Post was not edited "
        logger.info("Post edited successfully")
    except Exception as e:
        logger.error(f"Error: {e}")
        assert False, "Post was not edited successfully"
        
def test_like_post(appium_driver, setup_test):
    home_page, navigation_bar_page = setup_test
    profile_page = ProfiePage(appium_driver)
    utils = UtilityFunctions(appium_driver)
    utils.open_profile_page()
    appium_driver.swipe(500, 1300, 500, 100 ,1000)
    profile_page.click_show_all_posts()
    time.sleep(1)
    home_page.click_like_button()
    time.sleep(2)
    try:
        assert home_page.is_visible(home_page.REACTIONS_COUNT), "Post was not liked successfully"
        logger.info("Post liked successfully")
    except Exception as e:
        logger.error(f"Error: {e}")
        assert False, "Post was not liked successfully"
        
def test_delete_post(appium_driver, setup_test):
    home_page, navigation_bar_page = setup_test
    profile_page = ProfiePage(appium_driver)
    utils = UtilityFunctions(appium_driver)
    utils.open_profile_page()
    time.sleep(1)
    appium_driver.swipe(500, 1500, 500, 100 ,1000)
    profile_page.click_show_all_posts()
    time.sleep(1)
    profile_page.click_post_options()
    time.sleep(1)
    profile_page.click_delete_post()
    time.sleep(1)
    profile_page.click_confirm_delete()
    try:
        assert  home_page.is_visible(home_page.EMPTY_POSTS_MESSAGE), "Post was not deleted successfully"
        logger.info("Post deleted successfully")
    except Exception as e:
        logger.error(f"Error: {e}")
        assert False, "Post was not deleted successfully"
        
        
def test_create_text_post(appium_driver, setup_test):
    home_page, navigation_bar_page = setup_test
    navigation_bar_page.click_NewPost()
    time.sleep(2)
    home_page.click_write_post("This is a test post")
    time.sleep(2)
    home_page.click_post_button()
    time.sleep(5)
    try:
        if home_page.is_visible(home_page.NOTIFICATION_FREEZE_BUTTON):
            home_page.click_notification_freeze_button()
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
    home_page.click_write_document_title("Project Document")
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
        if home_page.is_visible(home_page.NOTIFICATION_FREEZE_BUTTON):
            home_page.click_notification_freeze_button()
        assert home_page.is_visible(home_page.POST_UPLOADED_SUCCESFUL_MESSAGE), "Document Post was not created successfully"
        logger.info("Document Post created successfully")
    except Exception as e:
        logger.error(f"Error: {e}")
        assert False, "Document Post was not created successfully"
    
def test_add_image_to_post(appium_driver, setup_test):
    home_page, navigation_bar_page = setup_test
    profile_photo_page = ProfilePhotoPage(appium_driver)
    navigation_bar_page.click_NewPost()
    time.sleep(2)
    home_page.click_add_photo_to_post()
    time.sleep(1)
    profile_photo_page.click_valid_cover_photo()
    home_page.click_add_image_button()
    home_page.click_next_button()
    time.sleep(1)
    home_page.click_write_post("This is a test post with a photo")
    time.sleep(2)
    home_page.click_post_button()
    time.sleep(5)
    try:
        if home_page.is_visible(home_page.NOTIFICATION_FREEZE_BUTTON):
            home_page.click_notification_freeze_button()
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

def test_add_comment(appium_driver, setup_test):
    home_page, navigation_bar_page = setup_test
    profile_page = ProfiePage(appium_driver)
    utils = UtilityFunctions(appium_driver)
    utils.open_profile_page()
    time.sleep(1)
    appium_driver.swipe(500, 1600, 500, 100 ,1000)
    profile_page.click_show_all_posts()
    time.sleep(1)   
    home_page.click_comment_button()
    time.sleep(2)
    home_page.write_comment("This is a test comment")
    time.sleep(2)
    home_page.click_post_comment_button()
    try:
        assert home_page.is_visible(home_page.COMMENTS_AND_REPOST_COUNT), "Comment was not created successfully"
        logger.info("Comment created successfully")
    except Exception as e:
        logger.error(f"Error: {e}")
        assert False, "Comment was not created successfully"
    
# def test_share_post(appium_driver, setup_test):
#     home_page, navigation_bar_page = setup_test
#     profile_page = ProfiePage(appium_driver)
#     utils = UtilityFunctions(appium_driver)
#     utils.open_profile_page()
#     time.sleep(1)
#     appium_driver.swipe(500, 1300, 500, 100 ,1000)
#     profile_page.click_show_all_posts()
#     time.sleep(1)   
#     home_page.click_share_button()
#     time.sleep(2)
#     home_page.click_post_button()
#     try:
#         assert home_page.is_visible(home_page.POST_UPLOADED_SUCCESFUL_MESSAGE), "Post was not shared successfully"
#         logger.info("Post shared successfully")
#     except Exception as e:
#         logger.error(f"Error: {e}")
#         assert False, "Post was not shared successfully"
def test_tag_user_in_comment(appium_driver, setup_test):
    home_page, navigation_bar_page = setup_test
    profile_page = ProfiePage(appium_driver)
    utils = UtilityFunctions(appium_driver)
    utils.open_profile_page()
    time.sleep(1)
    appium_driver.swipe(500, 1300, 500, 100 ,1000)
    profile_page.click_show_all_posts()
    time.sleep(1)   
    home_page.click_reactions_count()
    time.sleep(2)
    home_page.write_comment("@apple")
    time.sleep(2)
    home_page.click_tag_user_button() # press enter key to select the user
    home_page.click_post_comment_button()
    try:
        assert home_page.is_visible(home_page.COMMENTS_AND_REPOST_COUNT), "Post was not tagged successfully"
        logger.info("Post tagged successfully")
    except Exception as e:
        logger.error(f"Error: {e}")
        assert False, "Post was not tagged successfully"
        
def test_save_unsave_post(appium_driver, setup_test):
    home_page, navigation_bar_page = setup_test
    side_bar_page = SideBarPage(appium_driver)
    home_page.click_post_options()
    time.sleep(1)
    home_page.click_save_post_button()
    time.sleep(1)
    home_page.click_sidebar()
    side_bar_page.click_Saved_Posts_Button()
    time.sleep(2)
    try:
        home_page.click_edit_saved_posts()
        
    except Exception as e:
        logger.error(f"Error: {e}")
        assert False, "Post was not saved successfully"
    
    home_page.click_unsave_post_button()
    try:
        assert home_page.is_visible(home_page.DISMISS_BUTOTN0),'post was not saved/unsaved correctly'
    except Exception as e:
        logger.error(f"Error: {e}")
        assert False, "Post was not saved/unsaved successfully"
  
