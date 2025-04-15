from appium.webdriver.common.appiumby import AppiumBy as By  # Import AppiumBy
from Pages.base_page import BasePage  # Import BasePage
from Pages.Profile.locaters import ProfiePageLocaters  # Import LoginLocators
from logger import logger
import time

class ProfiePage(BasePage):
    """ Page Object for Login Page """
    EDIT_PROFILE_BUTTON = ProfiePageLocaters.EDIT_PROFILE_BUTTON
    EDIT_COVER_IMAGE = ProfiePageLocaters.EDIT_COVER_IMAGE
    SETTINGS_BUTTON = ProfiePageLocaters.SETTINGS_BUTTON
    BACK_BUTTON = ProfiePageLocaters.BACK_BUTTON
    SEARCH_BAR = ProfiePageLocaters.SEARCH_BAR
    EDIT_PROFILE_IMAGE = ProfiePageLocaters.EDIT_PROFILE_IMAGE
    MORE_OPTIONS_BUTTON = ProfiePageLocaters.MORE_OPTIONS_BUTTON
    ADD_SECTION_BUTTON = ProfiePageLocaters.ADD_SECTION_BUTTON
    OPEN_TO_WORK_BUTTON = ProfiePageLocaters.OPEN_TO_WORK_BUTTON
    ENHANCE_PROFILE_BUTTON = ProfiePageLocaters.ENHANCE_PROFILE_BUTTON
    ADD_INDUSTRY_BUTTON = ProfiePageLocaters.ADD_INDUSTRY_BUTTON
    SHOW_ALL_ANALYTICS_BUTTON = ProfiePageLocaters.SHOW_ALL_ANALYTICS_BUTTON
    ADD_EXPERIENCE_BUTTON = ProfiePageLocaters.ADD_EXPERIENCE_BUTTON
    ADD_EXPERIENCE_BUTTON_2 = ProfiePageLocaters.ADD_EXPERIENCE_BUTTON_2
    ADD_NEW_EDUCATION_BUTTON= ProfiePageLocaters.ADD_NEW_EDUCATION_BUTTON
    ADD_EDUCATION_BUTTON = ProfiePageLocaters.ADD_EDUCATION_BUTTON
    # EDIT EDUCATION IS FOR EACH ELMENT AND THE ID IS SET AUTOMATICALLY
    ADD_SKILLS_BUTTON = ProfiePageLocaters.ADD_SKILLS_BUTTON
    ADD_SKILLS_BUTTON_2 = ProfiePageLocaters.ADD_SKILLS_BUTTON_2
    NAME = ProfiePageLocaters.NAME
    HEADLINE = ProfiePageLocaters.HEADLINE
    LOCATION = ProfiePageLocaters.LOCATION
    ADD_POSTION_BUTTON = ProfiePageLocaters.ADD_POSTION_BUTTON
    EXPERIENCE_MESSAGE = ProfiePageLocaters.EXPERIENCE_MESSAGE
    SHOW_ALL_POSTS_BUTTON = ProfiePageLocaters.SHOW_ALL_POSTS_BUTTON
    POST_OPTIONS_BUTTON = ProfiePageLocaters.POST_OPTIONS_BUTTON
    EDIT_POST_BUTTON = ProfiePageLocaters.EDIT_POST_BUTTON
    DELETE_POST_BUTTON = ProfiePageLocaters.DELETE_POST_BUTTON
    EDIT_POST_MESSAGE = ProfiePageLocaters.EDIT_POST_MESSAGE
    CONFIRM_DELETE_BUTTON = ProfiePageLocaters.CONFIRM_DELETE_BUTTON
   
    

    def click_edit_profile(self):
        self.click(self.EDIT_PROFILE_BUTTON)
    
    def click_edit_cover_image(self):
        self.click(self.EDIT_COVER_IMAGE)
    
    def click_settings(self):
        self.click(self.SETTINGS_BUTTON)

    def click_back(self):
        self.click(self.BACK_BUTTON)
    
    def click_search_bar(self):
        self.click(self.SEARCH_BAR)
    
    def click_edit_profile_image(self):
        self.click(self.EDIT_PROFILE_IMAGE)
    
    def click_more_options(self):
        self.click(self.MORE_OPTIONS_BUTTON)
    
    def click_add_section(self):
        self.click(self.ADD_SECTION_BUTTON)
    
    def click_open_to_work(self):
        self.click(self.OPEN_TO_WORK_BUTTON)
    
    def click_enhance_profile(self):
        self.click(self.ENHANCE_PROFILE_BUTTON)

    def click_add_industry(self):
        self.click(self.ADD_INDUSTRY_BUTTON)
        
    def click_show_all_analytics(self):
        self.click(self.SHOW_ALL_ANALYTICS_BUTTON)
    
    def click_add_experience(self):
        try:
         self.click(self.ADD_EXPERIENCE_BUTTON)
        except Exception as e:
            print(f"Failed to click ADD_EXPERIENCE_BUTTON due to: {e}. Trying ADD_EXPERIENCE_BUTTON_2")
            logger.info("Failed to click ADD_EXPERIENCE_BUTTON due to: {}. Trying ADD_EXPERIENCE_BUTTON_2".format)
            self.click(self.ADD_EXPERIENCE_BUTTON_2)
            time.sleep(1)
            self.click(self.ADD_POSTION_BUTTON)
    
    def click_add_new_education(self):
        try:
            self.click(self.ADD_EDUCATION_BUTTON)
        except Exception as e:
            print(f"Failed to click ADD_EDUCATION_BUTTON due to: {e}. Trying ADD_new_EDUCATION_BUTTON")
            logger.info("Failed to click ADD_EDUCATION_BUTTON due to {}. Trying ADD_new_EDUCATION_BUTTON".format)
            self.click(self.ADD_NEW_EDUCATION_BUTTON)
    
    def click_add_skills(self):
        try:
            self.click(self.ADD_SKILLS_BUTTON)
        except Exception as e:
            print(f"Failed to click ADD_SKILLS_BUTTON due to: {e}. Trying ADD_SKILLS_BUTTON_2")
            logger.info("Failed to click ADD_SKILLS_BUTTON due to: {}. Trying ADD_SKILLS_BUTTON_2".format)
            self.click(self.ADD_SKILLS_BUTTON_2)
        

    def get_message(self, MESSAGE):
        return self.get_text(MESSAGE)
    
    def click_show_all_posts(self):
        self.click(self.SHOW_ALL_POSTS_BUTTON)
    
    def click_post_options(self):
        self.click(self.POST_OPTIONS_BUTTON)
    
    def click_edit_post(self):
        self.click(self.EDIT_POST_BUTTON)
    
    def click_delete_post(self):
        self.click(self.DELETE_POST_BUTTON)
    
    def click_confirm_delete(self):
        self.click(self.CONFIRM_DELETE_BUTTON)