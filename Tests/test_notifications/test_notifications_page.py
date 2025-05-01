from utility import UtilityFunctions
from logger import logger
import pytest
from Pages.Notifications.notifications_page import NotificationsPage
from Pages.Navigation.searchbar_page import SearchBarPage
from Pages.Navigation.navigationbar_page import NavigationBarPage
import time


@pytest.fixture
def setup_test(appium_driver):
    search_bar_page = SearchBarPage(appium_driver)
    navigation_bar_page = NavigationBarPage(appium_driver)
    notifications_page = NotificationsPage(appium_driver)
    utils = UtilityFunctions(appium_driver)

    if search_bar_page.is_visible(search_bar_page.SEARCH_BAR_BUTTON):
        navigation_bar_page.click_Notifications()
        time.sleep(2)
        return notifications_page
    else:
        utils.login()
        time.sleep(3)
        navigation_bar_page.click_Notifications()
        time.sleep(3)
        return notifications_page

def test_mark_notification_as_read(appium_driver, setup_test):
    notifications_page = setup_test
    logger.info("Test: Mark Notification as Read")

    # Click on the first notification in the list
    notifications_page.click_First_Notification()
    time.sleep(2)
    notifications_page.click_Back_Button()
    time.sleep(1)

    # Verify that the notification is marked as read
    try:
        assert notifications_page.is_visible(notifications_page.FIRST_NOTIFICATION), "Notification is not marked as read."
        logger.info("Notification is marked as read.")
    except:
        logger.error("Notification is not marked as read.")
        assert False, "Notification is not marked as read."
    
def test_delete_notification(appium_driver, setup_test):
    notifications_page = setup_test
    logger.info("Test: Delete Notification")
    notifications_page.click_Notification_Options()
    time.sleep(1)
    # Click on the first notification in the list
    notifications_page.click_Delete_Notification()
    time.sleep(1)

    # Verify that the notification is deleted
    try:
        assert notifications_page.is_visible(notifications_page.FIRST_NOTIFICATION), "Notification is not deleted."
        logger.info("Notification is deleted.")
    except:
        logger.error("Notification is not deleted.")
        assert False, "Notification is not deleted."

def test_filter_by_jobs(appium_driver, setup_test):
    notifications_page = setup_test
    logger.info("Test: Filter by Jobs")
    notifications_page.click_Filter_By_Jobs()
    time.sleep(2)

    # Verify that the filter is applied
    try:
        assert notifications_page.is_visible(notifications_page.NO_NEW_JOBS_POSTS_MENTIONS_MESSAGE), "Filter by Jobs is not applied."
        logger.info("Filter by Jobs is applied.")
    except:
        logger.error("Filter by Jobs is not applied.")
        assert False, "Filter by Jobs is not applied."

def test_filter_by_my_posts(appium_driver, setup_test):
    notifications_page = setup_test
    logger.info("Test: Filter by My Posts")
    notifications_page.click_Filter_By_My_Posts()
    time.sleep(2)

    # Verify that the filter is applied
    try:
        assert notifications_page.is_visible(notifications_page.NO_NEW_JOBS_POSTS_MENTIONS_MESSAGE), "Filter by My Posts is not applied."
        logger.info("Filter by My Posts is applied.")
    except:
        logger.error("Filter by My Posts is not applied.")
        assert False, "Filter by My Posts is not applied."

def test_filter_by_mentions(appium_driver, setup_test):
    notifications_page = setup_test
    logger.info("Test: Filter by Mentions")
    notifications_page.click_Filter_By_Mentions()
    time.sleep(2)

    # Verify that the filter is applied
    try:
        assert notifications_page.is_visible(notifications_page.NO_NEW_JOBS_POSTS_MENTIONS_MESSAGE), "Filter by Mentions is not applied."
        logger.info("Filter by Mentions is applied.")
    except:
        logger.error("Filter by Mentions is not applied.")
        assert False, "Filter by Mentions is not applied."
