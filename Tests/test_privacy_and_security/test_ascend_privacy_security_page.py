from logger import logger
import pytest
from Pages.Privacy_and_security.ascend_privacy_security_page import AscendPrivacyAndSecurityPage
from Pages.Authentication.Ascend_login import AscendLoginPage
import time
from utility import UtilityFunctions
###############################################################
# to import enter key
from appium import webdriver
from appium.webdriver.extensions.android.nativekey import AndroidKey

@pytest.fixture
def setup_test(appium_driver):

    login_page = AscendLoginPage(appium_driver)
    utils = UtilityFunctions(appium_driver)
    ascend_privacy_security_page = AscendPrivacyAndSecurityPage(appium_driver)
    time.sleep(2)
    try:
        if login_page.is_visible(login_page.CONTINUE_BUTTON):
            utils.ascend_login()
            time.sleep(2)
            return ascend_privacy_security_page
        else:
            return ascend_privacy_security_page
    except Exception as e:
        logger.info(f"error here {e}")
        return ascend_privacy_security_page

def test_allow_connection_requests(appium_driver, setup_test):
    ascend_privacy_security_page = setup_test
    logger.info("Test: Allow Connection Requests")
    time.sleep(2)
    ascend_privacy_security_page.click_Side_Bar_Button()
    time.sleep(2)
    ascend_privacy_security_page.click_Settings_Button()
    time.sleep(2)
    ascend_privacy_security_page.click_Connections_Preferences_Button()
    time.sleep(2)
    ascend_privacy_security_page.click_Allow_Connection_Requests_Button()
    time.sleep(2)
    ascend_privacy_security_page.click_Save_Button()
    time.sleep(2)
    
    try:
        assert ascend_privacy_security_page.is_visible(ascend_privacy_security_page.ALLOW_CONNNECTION_REQUESTS_BUTTON), "Allow Connection Requests test failed."
        logger.info("Allow Connection Requests test passed.")
    except:
        logger.error("Allow Connection Requests test failed.")
        assert False, "Allow Connection Requests test failed."

def test_report_user(appium_driver, setup_test):
    ascend_privacy_security_page = setup_test
    logger.info("Test: Report User")
    time.sleep(2)
    ascend_privacy_security_page.click_First_User()
    time.sleep(2)
    ascend_privacy_security_page.click_More_Options_Button()
    time.sleep(2)
    ascend_privacy_security_page.click_Report_Block_Button()
    time.sleep(2)
    
    try:
        assert not ascend_privacy_security_page.is_visible(ascend_privacy_security_page.REPORT_BLOCK_MESSAGE), "Report User test failed."
        logger.info("Report User test passed.")
    except:
        logger.error("Report User test failed.")
        assert False, "Report User test failed."

def test_blocked_users(appium_driver, setup_test):
    ascend_privacy_security_page = setup_test
    logger.info("Test: Blocked Users")
    time.sleep(2)
    ascend_privacy_security_page.click_Side_Bar_Button()
    time.sleep(2)
    ascend_privacy_security_page.click_Settings_Button()
    time.sleep(2)
    ascend_privacy_security_page.click_Blocked_Users_Button()
    time.sleep(2)
    
    try:
        assert ascend_privacy_security_page.is_visible(ascend_privacy_security_page.BLOCKED_USERS_BUTTON), "Blocked Users test failed."
        logger.info("Blocked Users test passed.")
    except:
        logger.error("Blocked Users test failed.")
        assert False, "Blocked Users test failed."
    

def test_unblock_user(appium_driver, setup_test):
    ascend_privacy_security_page = setup_test
    logger.info("Test: Unblock User")
    time.sleep(2)
    ascend_privacy_security_page.click_Side_Bar_Button()
    time.sleep(2)
    ascend_privacy_security_page.click_Settings_Button()
    time.sleep(2)
    ascend_privacy_security_page.click_Blocked_Users_Button()
    time.sleep(2)
    ascend_privacy_security_page.click_Unblock_User_Button()
    time.sleep(2)
    
    try:
        assert not ascend_privacy_security_page.is_visible(ascend_privacy_security_page.UNBLOCK_USER_BUTTON), "Unblock User test failed."
        logger.info("Unblock User test passed.")
    except:
        logger.error("Unblock User test failed.")
        assert False, "Unblock User test failed."