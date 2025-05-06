from logger import logger
import pytest
from Pages.Admin_panel.admin_panel_page import AdminPanelPage
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
    admin_panel = AdminPanelPage(appium_driver)
    time.sleep(2)
    try:
        if login_page.is_visible(login_page.CONTINUE_BUTTON):
            utils.ascend_login()
            time.sleep(4)
            admin_panel.click_Side_Bar_Button()
            time.sleep(1)
            admin_panel.click_Admin_Panel_Button()
            return admin_panel
        else:
            admin_panel.click_Side_Bar_Button()
            time.sleep(1)
            admin_panel.click_Admin_Panel_Button()
            return admin_panel
    except Exception as e:
        logger.info(f"error here {e}")
        return admin_panel

def test_view_platform_analytics(appium_driver, setup_test):
    admin_panel = setup_test
    logger.info('Testing Admin Platform Analytics')
    time.sleep(2)
    appium_driver.swipe(908, 428, 911, 428, 1000)
    time.sleep(2)
    admin_panel.click_Filter_By_Year()
    time.sleep(2)
    try:
        assert admin_panel.is_visible(admin_panel.ANALYTICS_ASSERT_MESSAGE), "View Platform Analytics test failed."
        logger.info("View Platform Analytics test passed.")
    except:
        logger.error("View Platform Analytics test failed.")
        assert False, "View Platform Analytics test failed."
    
def test_delete_reported_post(appium_driver, setup_test):
    admin_panel = setup_test
    logger.info('Testing Ignore Reported Post')
    time.sleep(2)
    admin_panel.click_Post_Tab()
    time.sleep(2)
    admin_panel.click_Delete_Post_Button()
    time.sleep(2)
    admin_panel.click_Confirm_Delete_Button()
    time.sleep(1)
    
    try:
        assert admin_panel.is_visible(admin_panel.POST_DELETED_MESSAGE), "Delete_Reported Post test failed."
        logger.info("Delete_ Reported Post test passed.")
    except:
        logger.error("Delete_ Reported Post test failed.")
        assert False, "Delete_ Reported Post test failed."
        
        

def test_delete_reported_user(appium_driver, setup_test):
    admin_panel = setup_test
    logger.info('Testing Delete Reported User')
    time.sleep(2)
    admin_panel.click_Users_Tab()
    time.sleep(2)
    admin_panel.click_Delete_User_Button()
    time.sleep(2)
    
    try:
        assert not admin_panel.is_visible(admin_panel.DELETE_USER_BUTTON), "Delete Reported User test failed."
        logger.info("Delete Reported User test passed.")
    except:
        logger.error("Delete Reported User test failed.")
        assert False, "Delete Reported User test failed."
        

def test_update_status_of_reported_job(appium_driver, setup_test):
    admin_panel = setup_test
    logger.info('Testing Update Status of Reported Job')
    time.sleep(2)
    admin_panel.click_Jobs_Tab()
    time.sleep(2)
    admin_panel.click_Show_Job_Reports()
    time.sleep(2)
    appium_driver.swipe(500, 900, 500, 700 , 1000)
    admin_panel.click_Mark_Job_As_Resolved()
    time.sleep(1)
    
    try:
        assert admin_panel.is_visible(admin_panel.MARK_JOB_AS_RESOLVED_MESSAGE), "Update Status of Reported Job test failed."
        logger.info("Update Status of Reported Job test passed.")
    except:
        logger.error("Update Status of Reported Job test failed.")
        assert False, "Update Status of Reported Job test failed."
    

def test_delete_reported_job(appium_driver, setup_test):
    admin_panel = setup_test
    logger.info('Testing Delete Reported Job')
    time.sleep(2)
    admin_panel.click_Jobs_Tab()
    time.sleep(2)
    admin_panel.click_Delete_Post_Button()
    time.sleep(2)
    admin_panel.click_Confirm_Delete_Button()
    time.sleep(1)
    
    try:
        assert admin_panel.is_visible(admin_panel.ASSERT_DELETE_JOB), "Delete Reported Job test failed."
        logger.info("Delete Reported Job test passed.")
    except:
        logger.error("Delete Reported Job test failed.")
        assert False, "Delete Reported Job test failed."