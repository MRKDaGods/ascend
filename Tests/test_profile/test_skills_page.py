# from Pages.Profile.profile_page import ProfiePage
# from Pages.Navigation.sidebar import SideBarPage
# from Pages.Feed.home_page import HomePage
# from Pages.Profile.skills_page import SkillsPage
# import time
# from logger import logger

# def test_skills_page(appium_driver):
#     logger.info("Testing education page")
#     profile_page = ProfiePage(appium_driver) 
#     home_page = HomePage(appium_driver)
#     skills_page = SkillsPage(appium_driver)
#     sidebar_page = SideBarPage(appium_driver)
#     logger.info("clicking sidebar in home page")
#     home_page.click_Sidebar()
#     time.sleep(1)
#     logger.info("clicking my profile in sidebar")
#     sidebar_page.click_Myprofile()
#     time.sleep(1)
#     logger.info("clicking edit profile in profile page")
#     appium_driver.swipe(583, 1900, 583, 50, 1000)
#     appium_driver.swipe(583, 1000, 583, 400, 1000)
#     time.sleep(1)
#     profile_page.click_add_skills()
#     time.sleep(1)
#     skills_page.enter_skill('C++')
#     appium_driver.back()
#     skills_page.click(skills_page.ENTERED_SKILL_BUTTON)
#     skills_page.click_save()
#     time.sleep(1)
    
    
#     time.sleep(5)