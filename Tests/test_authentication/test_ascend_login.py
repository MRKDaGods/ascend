from Pages.Authentication.Ascend_login import AscendLoginPage

import time
import pytest
from logger import logger
from Test_Cases_Data.Authentication import AscendLoginTestCasesData as TC
from utility import UtilityFunctions

#login with google is not yet tested
@pytest.fixture
def setup_test(appium_driver):
    """Setup function to initialize pages and ensure user is logged out before test"""
    login_page = AscendLoginPage(appium_driver)
    try:
        login_page.click_allow_notifications()
    except:
        pass
    try:    
        login_page.click_sign_in()
    except:
        pass
    return login_page

def test_valid_login(appium_driver, setup_test):
    """Test case for valid login"""
    login_page = setup_test
    logger.info("Testing Valid Login")

    try:
        login_page.click_allow_notifications()
    except Exception as e:
        logger.info(e)
    login_page.click_sign_in()
    login_page.enter_email(TC.TEST_EMAIL)
    appium_driver.hide_keyboard()
    time.sleep(2)
    login_page.enter_password(TC.TEST_VALID_PASSWORD)
    appium_driver.hide_keyboard()
    time.sleep(2)
    login_page.click_continue()
    time.sleep(5)  # Wait for login process

    try:
        assert "" in login_page.get_text(login_page.WELCOME_MESSAGE), "Login failed!"
        logger.info("Valid login test passed")
    except Exception as e:
        logger.error(f" Valid Login test failed: {e}")
        assert False, "Valid login test failed"

def test_invalid_password(appium_driver, setup_test):
    """Test case for login with an invalid password"""
    login_page = setup_test
    logger.info("Testing Invalid Password")
  
    time.sleep(2)
    login_page.enter_email(TC.TEST_EMAIL)
    appium_driver.hide_keyboard()
    time.sleep(2)
    login_page.enter_password(TC.TEST_INVALID_PASSWORD)
    appium_driver.hide_keyboard()
    time.sleep(2)
    login_page.click_continue()
    time.sleep(3)  # Wait for error message

    try:
        assert "" in login_page.get_text(login_page.WRONG_PASSWORD_OR_EMAIL_MESSAGE), "Error message not found!"
        logger.info("Invalid password test passed")
    except Exception as e:
        logger.error(f"Invalid password test failed: {e}")
        assert False, "Invalid password test failed"

def test_invalid_email(appium_driver, setup_test):
    """Test case for login with an invalid email"""
    login_page = setup_test
    logger.info("Testing Invalid Email")


    login_page.enter_email(TC.TEST_INVALID_EMAIL)
    appium_driver.hide_keyboard()
    time.sleep(2)
    login_page.enter_password(TC.TEST_VALID_PASSWORD)
    appium_driver.hide_keyboard()
    time.sleep(2)
    login_page.click_continue()
    time.sleep(3)  # Wait for error message

    try:
        assert "" in login_page.get_text(login_page.EMAIL_ADDRESS_IS_NOT_VALID), "Error message not found!"
        logger.info("Invalid email test passed")
    except Exception as e:
        logger.error(f"Invalid email test failed: {e}")
        assert False, "Invalid email test failed"

def test_empty_email(appium_driver, setup_test):
    """Test case for login with empty email"""
    login_page = setup_test
    logger.info("Testing Empty Email and Password")

    login_page.enter_password(TC.TEST_VALID_PASSWORD)
    appium_driver.hide_keyboard()
    time.sleep(2)
    login_page.click_continue()
    time.sleep(3)  # Wait for error message

    try:
        assert "" in login_page.get_text(login_page.EMAIL_ADDRESS_IS_NOT_VALID), "Error message not found!"
        logger.info("Empty email and password test passed")
    except Exception as e:
        logger.error(f"Empty email test failed: {e}")
        assert False, "Empty email and password test failed"
    
def test_empty_password(appium_driver, setup_test):
    """Test case for login with empty password"""
    login_page = setup_test
    logger.info("Testing Empty Password")

    login_page.enter_email(TC.TEST_EMAIL)
    appium_driver.hide_keyboard()
    time.sleep(2)
    login_page.click_continue()
    time.sleep(3)  # Wait for error message

    try:
        assert "" in login_page.get_text(login_page.EMPTY_PASSWORD), "Error message not found!" #locater 
        logger.info("Empty password test passed")
    except Exception as e:
        logger.error(f"Empty password test failed: {e}")
        assert False, "Empty password test failed"
        
def test_case_senstive_mail(appium_driver, setup_test):
        """Test case for login with case sensitive email"""
        login_page = setup_test
        logger.info("Testing Case Sensitive Email")

        login_page.enter_email(TC.TEST_CASE_SENSTIVE_MAIL)
        appium_driver.hide_keyboard()
        time.sleep(2)
        login_page.enter_password(TC.TEST_VALID_PASSWORD)
        appium_driver.hide_keyboard()
        time.sleep(2)
        time.sleep(1)
        login_page.click_continue()
        time.sleep(3)
        
        try:
            assert "" in login_page.get_text(login_page.WELCOME_MESSAGE), "Login failed!"
            logger.info("Case senstive email login test passed")

        except Exception as e:
            logger.error(f" Case senstive email login test failed: {e}")
            assert False, "Case senstive email login test failed"

def test_forget_password(appium_driver, setup_test):
    """Test case for forget password functionality"""
    login_page = setup_test
    logger.info("Testing Forget Password")

    login_page.click_forgot_password()
    time.sleep(2)
    login_page.enter_forgot_password_email(TC.TEST_EMAIL)
    appium_driver.hide_keyboard()
    time.sleep(2)
    login_page.click_next_in_forgot_password()
    time.sleep(3)  # Wait for error message

    try:
        assert "" in login_page.get_text(login_page.VERFICATION_CODE_MESSAGE), "Error message not found!"
        logger.info("Forget password test passed")
    except Exception as e:
        logger.error(f"Forget password test failed: {e}")
        assert False, "Forget password test failed"