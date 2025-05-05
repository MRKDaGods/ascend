from logger import logger
import pytest
from Pages.Company.company_page import CompanyPage
from Pages.Authentication.Ascend_login import AscendLoginPage
import time
from utility import UtilityFunctions
###############################################################
# to import enter key
from appium import webdriver
from appium.webdriver.extensions.android.nativekey import AndroidKey

@pytest.fixture
def setup_test(appium_driver):
    company_page = CompanyPage(appium_driver)
    login_page = AscendLoginPage(appium_driver)
    utils = UtilityFunctions(appium_driver)
    time.sleep(2)
    try:
        if login_page.is_visible(login_page.WELCOME_MESSAGE):
            company_page.click_Jobs_Button()
            time.sleep(2)
            return company_page
    except Exception as e:
        logger.info(f"error here {e}")
        utils.ascend_login()
        company_page.click_Jobs_Button()
        return company_page
    

def test_create_company(appium_driver, setup_test):
    company_page = setup_test
    logger.info("Test: Create Company")
    company_page.click_Manage_Company_Button()
    time.sleep(2)
    company_page.click_Create_New_Company_Button()
    time.sleep(2)
    company_page.enter_Company_Name_Text_Box("cross testing trial")
    appium_driver.hide_keyboard()
    time.sleep(1)
    company_page.enter_Description_Text_Box("testing trial")
    appium_driver.hide_keyboard()
    time.sleep(1)
    company_page.enter_Industry_Text_Box("testing")
    appium_driver.hide_keyboard()
    time.sleep(1)
    company_page.enter_Location_Text_Box("egypt")
    appium_driver.hide_keyboard()
    time.sleep(1)
    company_page.enter_Domain_Name_Text_Box("cross.com")
    appium_driver.hide_keyboard()
    time.sleep(1)
    company_page.click_Upload_Profile_Photo_Button()
    time.sleep(1)
    company_page.click_Valid_Profile_Photo_Button()
    time.sleep(1)
    company_page.click_Upload_Cover_Photo_Button()
    time.sleep(1)
    company_page.click_Valid_Cover_Photo_Button()
    time.sleep(1)
    company_page.click_Create_Company_Button()
    time.sleep(4)
    
    try:
        assert  company_page.is_visible(company_page.COMPANY_CREATED_MESSAGE), "Company creation failed!"
        logger.info("Company created successfully")
    except Exception as e:
        logger.error(f"Company creation failed: {e}")
        assert False, "Company creation failed"

def test_edit_company_image(appium_driver, setup_test):
    company_page = setup_test
    logger.info("Test: Edit Company Image")
    company_page.click_Manage_Company_Button()
    time.sleep(2)
    company_page.click_Chosen_Company_To_Edit_Button()
    time.sleep(1)
    company_page.click_Edit_Company_Button()
    time.sleep(1)
    company_page.click_Upload_Profile_Photo_Button()
    time.sleep(1)
    company_page.click_Valid_Profile_Photo_Button()
    time.sleep(1)
    company_page.enter_Domain_Name_Text_Box("cross.com")
    appium_driver.hide_keyboard()
    time.sleep(1)
    company_page.click_Update_Company_Button()
    time.sleep(1)
    try:
        assert  company_page.is_visible(company_page.COMPANY_UPDATED_MESSAGE), "Company image update failed!"
        logger.info("Company image updated successfully")
    except Exception as e:
        logger.error(f"Company image update failed: {e}")
        assert False, "Company image update failed"
    

def test_edit_company_description(appium_driver, setup_test):
    company_page = setup_test
    logger.info("Test: Edit Company Description")
    time.sleep(2)
    company_page.click_Manage_Company_Button()
    time.sleep(3)
    company_page.click_Chosen_Company_To_Edit_Button()
    time.sleep(1)
    company_page.click_Edit_Company_Button()
    time.sleep(2)
    company_page.enter_Edit_Description_Text_Box("made by Sasa cross")
    time.sleep(1)
    company_page.enter_Domain_Name_Text_Box("cross.com")
    appium_driver.hide_keyboard()
    time.sleep(1)
    company_page.click_Update_Company_Button()
    time.sleep(1)
    
    try:
        assert company_page.is_visible(company_page.COMPANY_UPDATED_MESSAGE), "Company description update failed!"
        logger.info("Company description updated successfully")
    except Exception as e:
        logger.error(f"Company description update failed: {e}")
        assert False, "Company description update failed"


    
def test_edit_company_industry(appium_driver, setup_test):
    company_page = setup_test
    logger.info("Test: Edit Company Industry")
    company_page.click_Manage_Company_Button()
    time.sleep(3)
    company_page.click_Chosen_Company_To_Edit_Button()
    time.sleep(1)
    company_page.click_Edit_Company_Button()
    time.sleep(2)
    company_page.enter_Edit_Industry_Text_Box("anime")
    appium_driver.hide_keyboard()
    time.sleep(1)
    company_page.enter_Domain_Name_Text_Box("cross.com")
    appium_driver.hide_keyboard()
    time.sleep(1)
    company_page.click_Update_Company_Button()
    time.sleep(1)
    
    try:
        assert company_page.is_visible(company_page.COMPANY_UPDATED_MESSAGE), "Company industry update failed!"
        logger.info("Company industry updated successfully")
    except Exception as e:
        logger.error(f"Company industry update failed: {e}")
        assert False, "Company industry update failed"

def test_post_job(appium_driver, setup_test):
    company_page = setup_test
    logger.info("Test: Post Job")
    company_page.click_Manage_Company_Button()
    time.sleep(2)
    company_page.click_Chosen_Company_To_Add_Job_Button()
    time.sleep(1)
    company_page.click_Add_Job_Button()
    time.sleep(1)
    company_page.enter_Job_Title_Text_Box("QA Tester")
    appium_driver.hide_keyboard()
    time.sleep(1)
    company_page.enter_Job_Description_Text_Box("Test and maintain software applications.")
    appium_driver.hide_keyboard()
    time.sleep(1)
    company_page.enter_Job_Industry_Text_Box("Software Development")
    appium_driver.hide_keyboard()
    time.sleep(1)
    company_page.enter_Job_Location_Text_Box("Remote")
    appium_driver.hide_keyboard()
    time.sleep(1)
    appium_driver.swipe(500, 1400, 500, 300 , 1000)
    company_page.click_Create_Job_Button()
    time.sleep(1)
    
    try:
        assert company_page.is_visible(company_page.JOB_CREATED_MESSAGE), "Job posting failed!"
        logger.info("Job posted successfully")
    except Exception as e:
        logger.error(f"Job posting failed: {e}")
        assert False, "Job posting failed"

def test_track_job_applicants(appium_driver, setup_test):
    company_page = setup_test
    logger.info("Test: Track Job Applicants")
    company_page.click_Manage_Company_Button()
    time.sleep(2)
    company_page.click_Chosen_Company_To_Add_Job_Button()
    time.sleep(1)
    company_page.click_Chosen_Job()
    time.sleep(2)
    
    try:
        assert company_page.is_visible(company_page.ASSERT_JOB_APPLICANTS), "Job applicants tracking failed!"
        logger.info("Job applicants tracking is working")
    except Exception as e:
        logger.error(f"Job applicants tracking failed: {e}")
        assert False, "Job applicants tracking failed"

def test_filter_by_salary(appium_driver, setup_test):
    company_page = setup_test
    logger.info("Test: Filter by Salary")
    company_page.click_Jobs_Search_Bar()
    time.sleep(1)
    company_page.click_Jobs_Search_Bar_Text()
    time.sleep(1)
    appium_driver.press_keycode(AndroidKey.ENTER)
    time.sleep(1)
    appium_driver.swipe(800, 300, 100, 300 , 1000)
    time.sleep(1)
    company_page.click_Filter_By_Salary()
    time.sleep(1)
    appium_driver.swipe(110, 1716, 330, 1716 , 1000)
    time.sleep(1)
    company_page.click_Show_Results_Button()
    time.sleep(2)
    
    try:
        assert company_page.is_visible(company_page.JOB_SEARCH_BAR), "Salary filter failed!"
        logger.info("Salary filter is working")
    except Exception as e:
        logger.error(f"Salary filter failed: {e}")
        assert False, "Salary filter failed"