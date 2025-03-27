# from Pages.signup_page import SignupPage
from Pages.Authentication.landing_page import LandingPage
from Pages.Authentication.signup_page import SignupPage
from utility import UtilityFunctions
from Pages.Authentication.login_page import LoginPage
from Test_Cases_Data.Authentication import SignupTestCasesData as TC
from logger import logger
import time
import pytest

@pytest.fixture
def setup_test(appium_driver):
    """Setup function to initialize pages and ensure user is logged out before test"""
    login_page = LoginPage(appium_driver)
    landing_page = LandingPage(appium_driver)
    signip_page = SignupPage(appium_driver)

    try:
        if  landing_page.get_text(landing_page.JOIN_A_TRUSTED_COMMUNITY_MESSAGE) == "Join a trusted community of 1B professionals":
            landing_page.click_agree_join_button()
            is_from_landing_page = True
    except:
        login_page.click_join_linkedin()
        is_from_landing_page = False

    return  signip_page, is_from_landing_page




def test_invalid_name(appium_driver, setup_test):
    """Test case for invalid name"""
    signup_page, is_from_landing_page = setup_test
    logger.info("Testing Invalid Name")
    if is_from_landing_page:
        signup_page.enter_first_name(TC.TEST_INVALID_FIRST_NAME)
        appium_driver.hide_keyboard()
        time.sleep(2)
        signup_page.enter_last_name(TC.TEST_INVALID_LAST_NAME)
        appium_driver.hide_keyboard()
        time.sleep(3)
        signup_page.click_continue()
        time.sleep(1)
        try:
            assert "Please enter a valid name" in signup_page.get_text(signup_page.MESSAGE), "Error message not found!"
            logger.info("Invalid Name test passed")
        except Exception as e:
            logger.error(f"Invalid Name test failed: {e}")
            assert False, "Invalid Name test failed"
    else:
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
        signup_page.enter_first_name(TC.TEST_INVALID_FIRST_NAME)
        appium_driver.hide_keyboard()
        time.sleep(2)
        signup_page.enter_last_name(TC.TEST_INVALID_LAST_NAME)
        appium_driver.hide_keyboard()
        time.sleep(3)
        signup_page.click_continue()
        time.sleep(1)
        try:
            assert "Please enter a valid name" in signup_page.get_text(signup_page.MESSAGE), "Error message not found!"
            logger.info("Invalid Name test passed")
        except Exception as e:
            logger.error(f"Invalid Name test failed: {e}")
            assert False, "Invalid Name test failed"
            
def test_invalid_email(appium_driver, setup_test):
    """Test case for invalid email"""
    signup_page, is_from_landing_page = setup_test
    logger.info("Testing Invalid Email")
    if is_from_landing_page:
        signup_page.enter_first_name(TC.TEST_FIRST_NAME)
        appium_driver.hide_keyboard()
        time.sleep(2)
        signup_page.enter_last_name(TC.TEST_LAST_NAME)
        appium_driver.hide_keyboard()
        time.sleep(3)
        signup_page.click_continue()
        time.sleep(1)
        signup_page.enter_email(TC.TEST_INVALID_EMAIL)
        appium_driver.hide_keyboard()
        time.sleep(2)
        signup_page.click_continue()
        time.sleep(1)
        try:
            assert "Email address or phone number is not valid." in signup_page.get_text(signup_page.INVALID_EMAIL), "Error message not found!"
            logger.info("Invalid Email test passed")
        except Exception as e:
            logger.error(f"Invalid Email test failed: {e}")
            assert False, "Invalid Email test failed"
    else:
        signup_page.enter_email(TC.TEST_INVALID_EMAIL)
        appium_driver.hide_keyboard()
        time.sleep(2)
        try:
            assert "Email address or phone number is not valid." in signup_page.get_text(signup_page.INVALID_EMAIL), "Error message not found!"
            logger.info("Invalid Email test passed")
        except Exception as e:
            logger.error(f"Invalid Email test failed: {e}")
            assert False, "Invalid Email test failed"

def test_invalid_password(appium_driver, setup_test):
    """Test case for invalid password"""
    signup_page, is_from_landing_page = setup_test
    logger.info("Testing Invalid Password")
    if is_from_landing_page:
        signup_page.enter_first_name(TC.TEST_FIRST_NAME)
        appium_driver.hide_keyboard()
        time.sleep(2)
        signup_page.enter_last_name(TC.TEST_LAST_NAME)
        appium_driver.hide_keyboard()
        time.sleep(3)
        signup_page.click_continue()
        time.sleep(1)
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
            assert "Enter a more secure password and use 6 or more characters" in signup_page.get_text(signup_page.INVALID_PASSWORD), "Error message not found!"
            logger.info("Invalid password test passed")
        except Exception as e:
            logger.error(f"Invalid password test failed: {e}")
            assert False, "Invalid password test failed"
    else:
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
            assert "Enter a more secure password and use 6 or more characters" in signup_page.get_text(signup_page.INVALID_PASSWORD), "Error message not found!"
            logger.info("Invalid password test passed")
        except Exception as e:
            logger.error(f"Invalid password test failed: {e}")
            assert False, "Invalid password test failed"

def test_existing_email(appium_driver, setup_test):
    """Test case for existing email"""
    signup_page, is_from_landing_page = setup_test
    logger.info("Testing Existing Email")
    if is_from_landing_page:
        signup_page.enter_first_name(TC.TEST_FIRST_NAME)
        appium_driver.hide_keyboard()
        time.sleep(2)
        signup_page.enter_last_name(TC.TEST_LAST_NAME)
        appium_driver.hide_keyboard()
        time.sleep(3)
        signup_page.click_continue()
        time.sleep(1)
        signup_page.enter_email(TC.TEST_VALID_EXISTING_EMAIL)
        appium_driver.hide_keyboard()
        time.sleep(2)
        signup_page.click_continue()
        time.sleep(1)
        signup_page.enter_password(TC.TEST_PASSWORD)
        appium_driver.hide_keyboard()
        time.sleep(2)
        signup_page.click_continue()
        time.sleep(3)
        try:
            assert "Someone’s already using that email." in signup_page.get_text(signup_page.EXISTING_EMAIL), "Error message not found!"
            logger.info("Existing email test passed")
        except Exception as e:
            logger.error(f"Existing email test failed: {e}")
            assert False, "Existing email test failed"
    else:
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
        try:
            assert "Someone’s already using that email." in signup_page.get_text(signup_page.EXISTING_EMAIL), "Error message not found!"
            logger.info("Existing email test passed")
        except Exception as e:
            logger.error(f"Existing email test failed: {e}")
            assert False, "Existing email test failed"

def test_valid_signup(appium_driver, setup_test):
    """ Test signup Functionality """
    logger.info("Testing Signup")
    signup_page, is_from_landing_page = setup_test
    if is_from_landing_page:
        signup_page.enter_first_name(TC.TEST_FIRST_NAME)
        appium_driver.hide_keyboard()
        time.sleep(2)
        signup_page.enter_last_name(TC.TEST_LAST_NAME)
        appium_driver.hide_keyboard()
        time.sleep(3)
        signup_page.click_continue()
        time.sleep(1)
        signup_page.enter_email(TC.TEST_EMAIL)
        appium_driver.hide_keyboard()
        time.sleep(2)
        signup_page.click_continue()
        time.sleep(1)
        signup_page.enter_password(TC.TEST_PASSWORD)
        appium_driver.hide_keyboard()
        time.sleep(2)
        # signup_page.click_continue()
        # time.sleep(5)
        
    else:
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
        time.sleep(3)
        # signup_page.click_continue()
        # time.sleep(5)
        # assert "Continue" in signup_page.get_text(signup_page.CONTINUE_BUTTON), "signup failed!"