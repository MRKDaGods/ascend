from logger import logger
import pytest
from Pages.Company.company_page import CompanyPage
from Pages.Payment_to_premium.premium_plan_page import PremiumPage
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
    premium_page = PremiumPage(appium_driver)
    company_page = CompanyPage(appium_driver)
    time.sleep(2)
    try:
        if login_page.is_visible(login_page.CONTINUE_BUTTON):
            utils.ascend_login(1)
            time.sleep(4)
            return premium_page, company_page
        else:
          
            return premium_page, company_page
    except Exception as e:
        logger.info(f"error here {e}")
        return premium_page, company_page

def test_premium_plan(appium_driver, setup_test):
    premium_page, company_page = setup_test
    logger.info('Testing Premium Plan')
    time.sleep(2)
    company_page.click_Jobs_Button()
    time.sleep(2)
    appium_driver.swipe(500, 1300, 500, 400, 1000)
    time.sleep(2)
    premium_page.click_try_premium_button()
    time.sleep(1)
    premium_page.click_skip_button()
    time.sleep(1)
    while(premium_page.is_visible(premium_page.JOIN_PREMIUM_BUTTON)):
            premium_page.click_join_premium_button()
            time.sleep(2)
    time.sleep(5)
    premium_page.click_link_card_button()
    time.sleep(1)
    # appium_driver.swipe(500, 1300, 500, 400, 1000)
    # time.sleep(1)
    # premium_page.enter_address("123 Main St")
    # premium_page.enter_city("New York")
    # premium_page.enter_postal_code("91111")
    premium_page.click_pay_button()
    try:
        assert premium_page.is_visible(premium_page.PREMIUM_PLAN_ASSERT_MESSAGE), "Premium Plan test failed."
        logger.info("Premium Plan test passed.")
    except:
        logger.error("Premium Plan test failed.")
        assert False, "Premium Plan test failed."