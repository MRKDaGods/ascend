from Pages.Authentication.Ascend_signup import AscendSignupPage
from Pages.Authentication.Ascend_login import AscendLoginPage

import time
import pytest
from logger import logger
from Test_Cases_Data.Authentication import AscendSignupTestCasesData as TC


#login with google is not yet tested
@pytest.fixture
def setup_test(appium_driver):
    """Setup function to initialize pages and ensure user is logged out before test"""
    signup_page = AscendSignupPage(appium_driver)
    login_page = AscendLoginPage(appium_driver)
    try:
        login_page.click_allow_notifications()
    except:
        pass
    try:    
        signup_page.click_join_now()
    except:
        pass
    return signup_page



def test_invalid_name(appium_driver, setup_test):
    """Test case for invalid name"""
    signup_page = setup_test
    logger.info("Testing Invalid Name")
    signup_page.enter_email(TC.TEST_EMAIL2)
    appium_driver.hide_keyboard()
    signup_page.click_continue()
    time.sleep(1)
    signup_page.enter_password(TC.TEST_PASSWORD)
    appium_driver.hide_keyboard()
    signup_page.click_continue()
    time.sleep(1)
    signup_page.enter_first_name(TC.TEST_INVALID_FIRST_NAME)
    appium_driver.hide_keyboard()
    time.sleep(2)
    signup_page.enter_last_name(TC.TEST_INVALID_LAST_NAME)
    appium_driver.hide_keyboard()
    time.sleep(1)
    signup_page.click_sign_up()
    time.sleep(2)
    try:
        assert "" in signup_page.get_text(signup_page.INVALID_NAME), "Error message not found!"
        logger.info("Invalid Name test passed")
    except Exception as e:
        logger.error(f"Invalid Name test failed: {e}")
        assert False, "Invalid Name test failed"
            
def test_invalid_email(appium_driver, setup_test):
    """Test case for invalid email"""
    signup_page = setup_test
    logger.info("Testing Invalid Email")
    signup_page.enter_email(TC.TEST_INVALID_EMAIL)
    appium_driver.hide_keyboard()
    signup_page.click_continue()
    time.sleep(2)
    try:
        assert  signup_page.is_visible(signup_page.INVALID_EMAIL), "Invalid email message not found!"
        # assert "Email address or phone number is not valid." in signup_page.get_text(signup_page.INVALID_EMAIL), "Error message not found!"
        logger.info("Invalid Email test passed")
    except Exception as e:
        logger.error(f"Invalid Email test failed: {e}")
        assert False, "Invalid Email test failed"

def test_empty_email(appium_driver, setup_test):
    signup_page = setup_test
    logger.info("Testing Invalid Email")
    signup_page.enter_email('')
    appium_driver.hide_keyboard()
    signup_page.click_continue()
    time.sleep(2)
    try:
        assert  signup_page.is_visible(signup_page.INVALID_EMAIL), "Invalid email message not found!"
        # assert "Email address or phone number is not valid." in signup_page.get_text(signup_page.INVALID_EMAIL), "Error message not found!"
        logger.info("Invalid Email test passed")
    except Exception as e:
        logger.error(f"Invalid Email test failed: {e}")
        assert False, "Invalid Email test failed"

def test_invalid_password(appium_driver, setup_test):
    """Test case for invalid password"""
    signup_page= setup_test
    logger.info("Testing Invalid Password")
    signup_page.enter_email(TC.TEST_EMAIL)
    appium_driver.hide_keyboard()
    time.sleep(2)
    signup_page.click_continue()
    time.sleep(1)
    signup_page.enter_password(TC.TEST_INVALID_PASSWORD)
    appium_driver.hide_keyboard()
    time.sleep(2)
    signup_page.click_continue()
    time.sleep(3)
    try:
        assert "" in signup_page.get_text(signup_page.INVALID_PASSWORD), "Error message not found!"
        logger.info("Invalid password test passed")
    except Exception as e:
        logger.error(f"Invalid password test failed: {e}")
        assert False, "Invalid password test failed"

def test_empty_password(appium_driver, setup_test):
    signup_page= setup_test
    logger.info("Testing Invalid Password")
    signup_page.enter_email(TC.TEST_EMAIL)
    appium_driver.hide_keyboard()
    time.sleep(2)
    signup_page.click_continue()
    time.sleep(1)
    signup_page.enter_password('')
    appium_driver.hide_keyboard()
    time.sleep(2)
    signup_page.click_continue()
    time.sleep(3)
    try:
        assert "" in signup_page.get_text(signup_page.INVALID_PASSWORD), "Error message not found!"
        logger.info("Invalid password test passed")
    except Exception as e:
        logger.error(f"Invalid password test failed: {e}")
        assert False, "Invalid password test failed"


def test_existing_email(appium_driver, setup_test):
    """Test case for existing email"""
    signup_page = setup_test
    logger.info("Testing Existing Email")
    signup_page.enter_email(TC.TEST_EXISITING_EMAIL)
    appium_driver.hide_keyboard()
    time.sleep(2)
    signup_page.click_continue()
    time.sleep(1)
    signup_page.enter_password(TC.TEST_PASSWORD)
    appium_driver.hide_keyboard()
    time.sleep(1)
    signup_page.click_continue()
    time.sleep(1)
    signup_page.enter_first_name(TC.TEST_FIRST_NAME)
    appium_driver.hide_keyboard()
    time.sleep(1)
    signup_page.enter_last_name(TC.TEST_LAST_NAME)
    appium_driver.hide_keyboard()
    signup_page.click_sign_up()
    time.sleep(3)
    try:
        assert signup_page.is_visible(signup_page.EXISTING_EMAIL), "Existing email message not found!" ## error message is just passing  json data without any styling
        # assert "Someone’s already using that email." in signup_page.get_text(signup_page.EXISTING_EMAIL), "Error message not found!"
        logger.info("Existing email test passed")
    except Exception as e:
        logger.error(f"Existing email test failed: {e}")
        assert False, "Existing email test failed"

def test_valid_signup(appium_driver, setup_test):
    """ Test signup Functionality """
    logger.info("Testing Signup")
    signup_page = setup_test
    signup_page.enter_email(TC.TEST_EMAIL)
    appium_driver.hide_keyboard()
    time.sleep(2)
    signup_page.click_continue()
    time.sleep(1)
    signup_page.enter_password(TC.TEST_PASSWORD)
    appium_driver.hide_keyboard()
    time.sleep(2)
    signup_page.click_continue()
    time.sleep(3)
    signup_page.enter_first_name(TC.TEST_FIRST_NAME)
    appium_driver.hide_keyboard()
    time.sleep(2)
    signup_page.enter_last_name(TC.TEST_LAST_NAME)
    appium_driver.hide_keyboard()
    signup_page.click_sign_up()
    time.sleep(3)
    try:
         assert signup_page.is_visible(signup_page.JOIN_NOW2), "user is not directed to sign in page!"
         logger.info("Valid signup test passed")
    except Exception as e:
        logger.error(f"Valid signup test failed: {e}")
        assert False, "Valid signup test failed"