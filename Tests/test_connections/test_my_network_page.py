from utility import UtilityFunctions 
from Pages.Authentication.landing_page import LandingPage
from Pages.Feed.home_page import HomePage
from logger import logger
import pytest
from Pages.Navigation.sidebar_page import SideBarPage
from Pages.Navigation.navigationbar_page import NavigationBarPage
from Pages.Connections.my_network_page import MyNetworkPage
from Pages.Navigation.searchbar_page import SearchBarPage
from Test_Cases_Data.My_network import MyNetworkTestCases as TC
from Pages.Connections.others_profile_page import OtherProfilePage
import time
from Pages.Navigation.sidebar_page import SideBarPage
###############################################################
# to import enter key 
from appium import webdriver
from appium.webdriver.extensions.android.nativekey import AndroidKey

@pytest.fixture
def setup_test(appium_driver):
    search_bar_page = SearchBarPage(appium_driver)
    navigation_bar_page = NavigationBarPage(appium_driver)
    utils = UtilityFunctions(appium_driver)
    my_network_page = MyNetworkPage(appium_driver)
    others_profile_page = OtherProfilePage(appium_driver)
    
    
    if search_bar_page.is_visible(search_bar_page.SEARCH_BAR_BUTTON):
        navigation_bar_page.click_MyNetwork()
    else:
        utils.login()
        time.sleep(3)
        navigation_bar_page.click_MyNetwork()

    return my_network_page, search_bar_page, others_profile_page
        

def test_search_by_fullname(appium_driver, setup_test):
    my_network_page, search_bar_page, _ = setup_test
    search_bar_page.click_Search_Bar()
    time.sleep(1)
    search_bar_page.enter_search(TC.FULL_NAME)
    try:
        assert search_bar_page.is_visible(search_bar_page.SEARCHED_ITEM), "Searched item should be visible but it's not"
        logger.info("search_by_fullnamee test passed") 
    except Exception as e:
        logger.error(f"search_by_fullname test failed: {e}")
        assert False, "search_by_fullname test failed"


def test_search_by_company(appium_driver, setup_test):
    my_network_page, search_bar_page, _ = setup_test
    search_bar_page.click_Search_Bar()
    time.sleep(1)
    search_bar_page.enter_search(TC.COMPANY_NAME)
    time.sleep(1)
    search_bar_page.click_See_All_Results()
    time.sleep(1)
    search_bar_page.click_filter_people_by_company()
    try:
        assert search_bar_page.is_visible(search_bar_page.SEARCHED_PEOPLE_ITEM), "Employees working in company should be visible but it's not"
        logger.info("test_search_for_employees_by_company test passed") 
    except Exception as e:
        logger.error(f"test_search_by_company test failed: {e}")
        assert False, "test_search_by_company test failed"
        
def test_search_by_industry(appium_driver, setup_test):
    my_network_page, search_bar_page, _ = setup_test
    search_bar_page.click_Search_Bar()
    time.sleep(1)
    search_bar_page.enter_search(TC.INDUSTRY_NAME)
    time.sleep(1)
    search_bar_page.click_See_All_Results()
    time.sleep(1)
    search_bar_page.click_filter_people_by_industry()
    try:
        assert search_bar_page.is_visible(search_bar_page.SEARCHED_PEOPLE_ITEM), "Employees working in industry should be visible but it's not"
        logger.info("test_search_for_employees_by_industry test passed") 
    except Exception as e:
        logger.error(f"test_search_by_industry test failed: {e}")
        assert False, "test_search_by_industry test failed"
        
def test_empty_search_query(appium_driver, setup_test):
    my_network_page, search_bar_page, _ = setup_test
    search_bar_page.click_Search_Bar()
    time.sleep(1)
    search_bar_page.enter_search('')
    time.sleep(1)
    appium_driver.press_keycode(AndroidKey.ENTER)
    time.sleep(1)
    try:
        assert search_bar_page.is_visible(search_bar_page.ERROR_MESSAGE), "Error Message should be visible but it's not"
        logger.info("test_empty_search_query test passed") 
    except Exception as e:
        logger.error(f"test_empty_search_query test failed: {e}")
        assert False, "test_empty_search_query test failed"
    
def test_send_request(appium_driver, setup_test):
    my_network_page, search_bar_page, others_profile_page = setup_test
    search_bar_page.click_Search_Bar()
    time.sleep(1)
    search_bar_page.enter_search(TC.FRIEND_NAME)
    time.sleep(1)
    search_bar_page.click_Searched_Person()
    time.sleep(1)
    others_profile_page.click_Connect_Button()
    # others_profile_page.click_More_Options_Button()
    time.sleep(2)
    try:
        #assert others_profile_page.is_visible(others_profile_page.CONNECT_BUTTON1), "Sent Request should be visible but it's not"
        assert others_profile_page.is_visible(others_profile_page.INVITATION_SENT_MESSAGE), "Invitation Sent Message should be visible but it's not"
        logger.info("test_send_request test passed") 
    except Exception as e:
        logger.error(f"test_send_request test failed: {e}")
        assert False, "test_send_request test failed"
        

def test_accept_request(appium_driver, setup_test):
    my_network_page, search_bar_page, others_profile_page = setup_test
    if my_network_page.is_visible(my_network_page.ACCEPT_CONNECTION_BUTTON):
        my_network_page.click_accept_connection_button()
        time.sleep(1)
        try:
            assert my_network_page.is_visible(my_network_page.PERSON_IS_NOW_CONNECTION_MESSAGE), "Person is now connected message should be visible"
            logger.info("test_accept_request test passed") 
        except Exception as e:
            logger.error(f"test_accept_request test failed: {e}")
            assert False, "test_accept_request test failed"
    else:
        assert False, "Accept connection button not visible"
    

def test_decline_request(appium_driver, setup_test):
    my_network_page, search_bar_page, others_profile_page = setup_test
    if my_network_page.is_visible(my_network_page.DECLINE_CONNECTION_BUTTON):
        my_network_page.click_decline_connection_button()
        time.sleep(1)
        # try:
        #     #assert my_network_page.is_visible(my_network_page.PERSON_IS_NOW_CONNECTION_MESSAGE), "Person is now connected message should be visible"  ##add message for decline connection
        #     logger.info("test_decline_request test passed") 
        # except Exception as e:
        #     logger.error(f"test_decline_request test failed: {e}")
        #     assert False, "test_decline_request test failed"
    else:
        assert False, "Decline connection button not visible"

# def test_remove_request(appium_driver, setup_test):
#     my_network_page, search_bar_page, others_profile_page = setup_test
#     search_bar_page.click_Search_Bar()
#     search_bar_page.enter_search(TC.FRIEND_NAME)
#     search_bar_page.click_Searched_Person()
#     others_profile_page.click_More_Options_Button()
#     ## others_profile_page.click_remove_connection_button() ###add remove connection button
#     time.sleep(1)

def test_follow_public_profile(appium_driver, setup_test):
    my_network_page, search_bar_page, others_profile_page = setup_test
    search_bar_page.click_Search_Bar()
    search_bar_page.enter_search(TC.PUBLIC_PROFILE_NAME)
    search_bar_page.click_Searched_Person()
    time.sleep(1)
    others_profile_page.click_Follow_Button()
    time.sleep(1)
    try:
        assert others_profile_page.is_visible(others_profile_page.FOLLOWING_BUTTON), "Following message should be visible but it's not"
        logger.info("test_follow_public_profile test passed")
    except Exception as e:
        logger.error(f"test_follow_public_profile test failed: {e}")
        assert False, "test_follow_public_profile test failed"


def test_unfollow_public_profile(appium_driver, setup_test):
    my_network_page, search_bar_page, others_profile_page = setup_test
    search_bar_page.click_Search_Bar()
    search_bar_page.enter_search(TC.PUBLIC_PROFILE_NAME)
    search_bar_page.click_Searched_Person()
    time.sleep(1)
    others_profile_page.click_folllow_message()
    time.sleep(1)
    others_profile_page.click_Unfollow_Button()
    time.sleep(1)
    try:
        assert others_profile_page.is_visible(others_profile_page.FOLLOWING_BUTTON), "follow button should be visible but it's not"
        logger.info("test_unfollow_public_profile test passed")
    except Exception as e:
        logger.error(f"test_unfollow_public_profile test failed: {e}")
        assert False, "test_unfollow_public_profile test failed"
    

def test_block_profile(appium_driver, setup_test):
    my_network_page, search_bar_page, others_profile_page = setup_test
    my_network_page.click_First_Profile_Button()
    time.sleep(1)
    others_profile_page.click_More_Options_Button()
    time.sleep(1)
    others_profile_page.click_Block_Button()
    time.sleep(1)
    others_profile_page.click_Confirm_Block_Button()
    others_profile_page.click_Confirm_Again_Block_Button()
    time.sleep(1)
    try:
        assert others_profile_page.is_visible(others_profile_page.BLOCKED_MESSAGE), "Blocked message should be visible but it's not"
        logger.info("test_block_profile test passed")
    except Exception as e:
        logger.error(f"test_block_profile test failed: {e}")
        assert False, "test_block_profile test failed"
    
def test_view_blocked_users(appium_driver, setup_test):
    my_network_page, search_bar_page, others_profile_page = setup_test
    side_bar_page = SideBarPage(appium_driver)
    home_page = HomePage(appium_driver)
    home_page.click_sidebar()
    time.sleep(1)
    side_bar_page.click_Settings()
    time.sleep(1)
    side_bar_page.click_Profile_Visibility_Button()
    time.sleep(1)
    appium_driver.swipe(500, 900, 500 ,250, 1000)
    side_bar_page.click_Blocked_List_Button()
    time.sleep(3)
    assert side_bar_page.is_visible(side_bar_page.UNBLOCK_BUTTON), "Blocked list button should be visible but it's not"
    if side_bar_page.is_visible(side_bar_page.UNBLOCK_BUTTON):
        logger.info("test_view_blocked_users test passed")
    assert True, "Blocked users should be visible but it's not"
    logger.info("test_view_blocked_users test passed")

    
def test_unblock_profile(appium_driver, setup_test):
    my_network_page, search_bar_page, others_profile_page = setup_test
    side_bar_page = SideBarPage(appium_driver)
    home_page = HomePage(appium_driver)
    home_page.click_sidebar()
    time.sleep(1)
    side_bar_page.click_Settings()
    time.sleep(1)
    side_bar_page.click_Profile_Visibility_Button()
    time.sleep(1)
    appium_driver.swipe(500, 900, 500 ,250, 1000)
    side_bar_page.click_Blocked_List_Button()
    time.sleep(1)
    side_bar_page.click_Unblock_Button()
    time.sleep(1)
    if side_bar_page.is_visible(side_bar_page.CONFIRM_PASS_INPUT):
        side_bar_page.enter_Confirm_Pass_Input('123456789A')
        appium_driver.hide_keyboard()
        side_bar_page.click_Confirm_Unblock_Button()
    try:
        assert not side_bar_page.is_visible(side_bar_page.UNBLOCKED_MESSAGE), "Unblock button should be visible but it's is not visible"
        logger.info("test_unblock_profile test passed")
    except Exception as e:
        logger.error(f"test_unblock_profile test failed: {e}")
        assert False, "test_unblock_profile test failed"