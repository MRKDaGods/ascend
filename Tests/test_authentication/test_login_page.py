from Pages.Authentication.login_page import LoginPage
from Pages.Authentication.landing_page import LandingPage
from Pages.Feed.home_page import HomePage
import time
import pytest
from logger import logger
from Test_Cases_Data.Authentication import LoginTestCasesData as TC
from utility import UtilityFunctions

#login with google is not yet tested
@pytest.fixture
def setup_test(appium_driver):
    """Setup function to initialize pages and ensure user is logged out before test"""
    login_page = LoginPage(appium_driver)
    landing_page = LandingPage(appium_driver)
    home_page = HomePage(appium_driver)

    # Ensure user is signed out if already logged in
    try:
        if home_page.get_text(home_page.SEARCH_BAR) == "Search":
            UtilityFunctions.signout(appium_driver)
    except:
        pass

    return login_page, landing_page, home_page

def test_valid_login(appium_driver, setup_test):
    """Test case for valid login"""
    login_page, landing_page, home_page = setup_test
    logger.info("Testing Valid Login")

    try:
        landing_page.click_sign_in_with_email()
    except:
        pass

    login_page.enter_email(TC.TEST_EMAIL)
    appium_driver.hide_keyboard()
    time.sleep(2)
    login_page.enter_password(TC.TEST_VALID_PASSWORD)
    appium_driver.hide_keyboard()
    time.sleep(2)
    login_page.click_remember_me()
    time.sleep(1)
    login_page.click_continue()
    time.sleep(5)  # Wait for login process

    try:
        assert "Search" in home_page.get_text(home_page.SEARCH_BAR), "Login failed!"
        logger.info("Valid login test passed")
    except Exception as e:
        logger.error(f" Valid Login test failed: {e}")
        assert False, "Valid login test failed"

def test_invalid_password(appium_driver, setup_test):
    """Test case for login with an invalid password"""
    login_page, landing_page, home_page = setup_test
    logger.info("Testing Invalid Password")

    try:
        landing_page.click_sign_in_with_email()
    except:
        pass

    login_page.enter_email(TC.TEST_EMAIL)
    appium_driver.hide_keyboard()
    time.sleep(2)
    login_page.enter_password(TC.TEST_INVALID_PASSWORD)
    appium_driver.hide_keyboard()
    time.sleep(2)
    login_page.click_remember_me()
    time.sleep(1)
    login_page.click_continue()
    time.sleep(3)  # Wait for error message

    try:
        assert "Wrong username or password." in login_page.get_text(login_page.WRONG_PASSWORD_OR_EMAIL_MESSAGE), "Error message not found!"
        logger.info("Invalid password test passed")
    except Exception as e:
        logger.error(f"Invalid password test failed: {e}")
        assert False, "Invalid password test failed"

def test_invalid_email(appium_driver, setup_test):
    """Test case for login with an invalid email"""
    login_page, landing_page, home_page = setup_test
    logger.info("Testing Invalid Email")

    try:
        landing_page.click_sign_in_with_email()
    except:
        pass

    login_page.enter_email(TC.TEST_INVALID_EMAIL)
    appium_driver.hide_keyboard()
    time.sleep(2)
    login_page.enter_password(TC.TEST_VALID_PASSWORD)
    appium_driver.hide_keyboard()
    time.sleep(2)
    login_page.click_remember_me()
    time.sleep(1)

    try:
        assert "Email address or phone number is not valid." in login_page.get_text(login_page.EMAIL_ADDRESS_IS_NOT_VALID), "Error message not found!"
        logger.info("Invalid email test passed")
    except Exception as e:
        logger.error(f"Invalid email test failed: {e}")
        assert False, "Invalid email test failed"

def test_empty_email(appium_driver, setup_test):
    """Test case for login with empty email"""
    login_page, landing_page, home_page = setup_test
    logger.info("Testing Empty Email and Password")

    try:
        landing_page.click_sign_in_with_email()
    except:
        pass
    login_page.enter_password(TC.TEST_VALID_PASSWORD)
    appium_driver.hide_keyboard()
    time.sleep(2)
    login_page.click_remember_me()
    time.sleep(1)
    login_page.click_continue()
    appium_driver.hide_keyboard()
    time.sleep(3)  # Wait for error message

    try:
        assert "Please enter your email address or phone number" in login_page.get_text(login_page.EMAIL_ADDRESS_IS_NOT_VALID), "Error message not found!"
        logger.info("Empty email and password test passed")
    except Exception as e:
        logger.error(f"Empty email test failed: {e}")
        assert False, "Empty email and password test failed"
    
def test_empty_password(appium_driver, setup_test):
    """Test case for login with empty password"""
    login_page, landing_page, home_page = setup_test
    logger.info("Testing Empty Password")

    try:
        landing_page.click_sign_in_with_email()
    except:
        pass
    login_page.enter_email(TC.TEST_EMAIL)
    appium_driver.hide_keyboard()
    time.sleep(2)
    login_page.click_remember_me()
    time.sleep(1)
    login_page.click_continue()
    time.sleep(2) 
    appium_driver.hide_keyboard()
    time.sleep(3)  # Wait for error message

    try:
        assert "Please enter a password" in login_page.get_text(login_page.EMPTY_PASSWORD), "Error message not found!"
        logger.info("Empty password test passed")
    except Exception as e:
        logger.error(f"Empty password test failed: {e}")
        assert False, "Empty password test failed"
        
def test_case_senstive_mail(appium_driver, setup_test):
        """Test case for login with case sensitive email"""
        login_page, landing_page, home_page = setup_test
        logger.info("Testing Case Sensitive Email")

        try:
            landing_page.click_sign_in_with_email()
        except:
            pass

        login_page.enter_email(TC.TEST_CASE_SENSTIVE_MAIL)
        appium_driver.hide_keyboard()
        time.sleep(2)
        login_page.enter_password(TC.TEST_VALID_PASSWORD)
        appium_driver.hide_keyboard()
        time.sleep(2)
        login_page.click_remember_me()
        time.sleep(1)
        login_page.click_continue()
        time.sleep(3)
        
        try:
            assert "Search" in home_page.get_text(home_page.SEARCH_BAR), "Login failed!"
            UtilityFunctions.signout(appium_driver)
            logger.info("Case senstive email login test passed")

        except Exception as e:
            logger.error(f" Case senstive email login test failed: {e}")
            assert False, "Case senstive email login test failed"