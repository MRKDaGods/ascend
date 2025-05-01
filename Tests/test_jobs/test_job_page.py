from utility import UtilityFunctions
from logger import logger
import pytest
from Pages.Jobs.jobs_page import JobPage
from Pages.Navigation.searchbar_page import SearchBarPage
from Pages.Navigation.navigationbar_page import NavigationBarPage
import time
###############################################################
# to import enter key
from appium import webdriver
from appium.webdriver.extensions.android.nativekey import AndroidKey

@pytest.fixture
def setup_test(appium_driver):
    search_bar_page = SearchBarPage(appium_driver)
    navigation_bar_page = NavigationBarPage(appium_driver)
    job_page = JobPage(appium_driver)
    utils = UtilityFunctions(appium_driver)

    if search_bar_page.is_visible(search_bar_page.SEARCH_BAR_BUTTON):
        navigation_bar_page.click_Jobs()
        time.sleep(2)
        return job_page, search_bar_page, utils
    else:
        utils.login()
        time.sleep(3)
        navigation_bar_page.click_Jobs()
        time.sleep(1)
        return job_page, search_bar_page, utils

def test_search_job_by_industry(appium_driver, setup_test):
    _, search_bar_page, utils = setup_test
    logger.info("Test: Search Job by Industry")
    utils.search_jobs("Software Engineer")
    try:
        assert search_bar_page.is_visible(search_bar_page.SEARCH_BAR_BUTTON), "Search Jobs By Industry Is Not Working."
        logger.info("Search Jobs By Industry Is Working")
    except:
        logger.error("Search Jobs By Industry Is Not Working")
        assert False, "Search Jobs By Industry Is Not Working"
    

def test_search_job_by_city(appium_driver, setup_test):
    job_page, search_bar_page, _ = setup_test
    logger.info("Test: Search Job by City")

    # Click on the search bar and enter a job title
    search_bar_page.click_Search_Bar()
    time.sleep(2)
    # job_page.enter_Search_By_City_Text_Box("Cairo")
    job_page.enter_Search_By_City_Text_Box("Cairo")
    time.sleep(1)
    appium_driver.press_keycode(AndroidKey.ENTER)
    time.sleep(3)
    try:
        assert search_bar_page.is_visible(search_bar_page.SEARCH_BAR_BUTTON), "Search Jobs By City Is Not Working."
        logger.info("Search Jobs By City Is Working")
    except:
        logger.error("Search Jobs By City Is Not Working")
        assert False, "Search Jobs By City Is Not Working"
    

def test_search_job_keyword(appium_driver, setup_test):
    _, search_bar_page, utils = setup_test
    logger.info("Test: Search Job by Keyword")

    # Click on the search bar and enter a job title
    utils.search_jobs("React Developer")
    try:
        assert search_bar_page.is_visible(search_bar_page.SEARCH_BAR_BUTTON), "Search Jobs By Keyword Is Not Working."
        logger.info("Search Jobs By Keyword Is Working")
    except:
        logger.error("Search Jobs By Keyword Is Not Working")
        assert False, "Search Jobs By Keyword Is Not Working"


def test_filter_by_experience(appium_driver, setup_test):
    job_page, _, utils = setup_test
    logger.info("Test: Filter by Experience")
    utils.search_jobs("Software Engineer")
    appium_driver.swipe(900, 300, 200, 300, 1000)
    # Click on the filter by experience button
    job_page.click_Filter_By_Experience_Button()
    time.sleep(2)
    job_page.click_Filter_By_Experience_Internship_Button()
    time.sleep(1)
    job_page.click_Show_Results_Button()
    time.sleep(3)

    # Verify that the filter is applied
    try:
        assert job_page.is_visible(job_page.ASSERT_FILTER_BY_COMPANY_IBM), "Filter by Experience Is Not Working."
        logger.info("Filter by Experience Is Working")
    except:
        logger.error("Filter by Experience Is Not Working")
        assert False, "Filter by Experience Is Not Working"
    

def test_filter_by_company(appium_driver, setup_test):
    job_page, _, utils = setup_test
    logger.info("Test: Filter by Company")
    utils.search_jobs("Software Engineer")
    appium_driver.swipe(900, 300, 200, 300, 1000)
    # Click on the filter by company button
    job_page.click_Filter_By_Company_Button()
    time.sleep(2)
    job_page.click_Filter_By_Company_IBM()
    time.sleep(1)
    job_page.click_Show_Results_Button()
    time.sleep(3)
    
    # Verify that the filter is applied
    try:
        assert job_page.is_visible(job_page.ASSERT_FILTER_BY_COMPANY_IBM), "Filter by Company Is Not Working."
        logger.info("Filter by Company Is Working")
    except:
        logger.error("Filter by Company Is Not Working")
        assert False, "Filter by Company Is Not Working"
    

def test_save_job(appium_driver, setup_test):
    job_page, _ , utils = setup_test
    logger.info("Test: Save Job")
    utils.search_jobs("Software Engineer")
    # Click on the first searched job
    job_page.click_First_Searched_Job()
    time.sleep(2)
    # Click on the save job button
    job_page.click_Save_Job_Button()
    time.sleep(2)

    # Verify that the job is saved
    try:
        assert not job_page.is_visible(job_page.JOB_SAVED_MESSAGE), "Save Job Is Not Working."
        logger.info("Save Job Is Working")
    except:
        logger.error("Save Job Is Not Working")
        assert False, "Save Job Is Not Working"
        

def test_valid_apply_job(appium_driver, setup_test):
    job_page, _, utils = setup_test
    logger.info("Test: Apply Job")
    utils.search_jobs("Software Engineer")
    # Click on the first searched job
    job_page.click_Easy_Apply_Filter()
    time.sleep(2)
    job_page.click_First_Searched_Job()
    time.sleep(2)
    # Click on the apply button
    job_page.click_Apply_Button()
    time.sleep(2)
    # Click on the no don't share profile button
    try:
        job_page.click_No_Donot_Share_Profile()
    except:
        pass
    job_page.click_phone_number_text_box()
    job_page.enter_Phone_Number_Text_Box("0123456789")
    appium_driver.hide_keyboard()
    time.sleep(1)
    job_page.click_Next_Button()
    time.sleep(1)
    job_page.click_Upload_Resume_Button()
    time.sleep(1)   
    job_page.click_Project_Document_Button()
    time.sleep(5)
    

    # Verify that the apply button is working
    try:
        assert job_page.is_visible(job_page.ASSERT_APPLY_JOB), "Apply Job Is Not Working."
        logger.info("Apply Job Is Working")
    except:
        logger.error("Apply Job Is Not Working")
        assert False, "Apply Job Is Not Working"

def test_invalid_apply_job(appium_driver, setup_test):
    job_page, _ , utils = setup_test
    logger.info("Test: Apply Job")
    utils.search_jobs("Software Engineer")
    # Click on the first searched job
    job_page.click_Easy_Apply_Filter()
    time.sleep(2)
    job_page.click_First_Searched_Job()
    time.sleep(2)
    # Click on the apply button
    job_page.click_Apply_Button()
    time.sleep(2)
    # Click on the no don't share profile button
    try:
        job_page.click_No_Donot_Share_Profile()
    except:
        pass
    job_page.click_Next_Button()
    time.sleep(1)
  
    

    # Verify that the apply button is working
    try:
        assert job_page.is_visible(job_page.ASSER_INVALID_APPLY_JOB), "Invalid Apply Job Is Working."
        logger.info("Invalid Apply Job Is not Working")
    except:
        logger.error("Invalid Apply Job Is Working.")
        assert False, "Invalid Apply Job Is Working."