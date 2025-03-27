# from Pages.Profile.profile_page import ProfiePage
# from Pages.Navigation.sidebar import SideBarPage
# from Pages.Feed.home_page import HomePage
# from Pages.Profile.education_page import EducationPage
# import time
# from logger import logger

# def test_education_page(appium_driver):
#     logger.info("Testing education page")
#     profile_page = ProfiePage(appium_driver) 
#     home_page = HomePage(appium_driver)
#     education_page = EducationPage(appium_driver)
#     sidebar_page = SideBarPage(appium_driver)
#     logger.info("clicking sidebar in home page")
#     home_page.click_Sidebar()
#     time.sleep(1)
#     logger.info("clicking my profile in sidebar")
#     sidebar_page.click_Myprofile()
#     time.sleep(1)
#     logger.info("clicking edit profile in profile page")
#     appium_driver.swipe(583, 1800, 583, 100, 1000)
#     time.sleep(1)
#     profile_page.click_add_new_education()
#     time.sleep(1)
#     education_page.enter_degree('University of Nairobi')
#     time.sleep(1)
    
    
#     time.sleep(5)