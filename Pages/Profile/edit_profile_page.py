from appium.webdriver.common.appiumby import AppiumBy as By  # Import AppiumBy
from Pages.base_page import BasePage  # Import BasePage
from Pages.Profile.locaters import EditProfilePageLocaters  
import time

class EditProfilePage(BasePage):
    """ Page Object for Login Page """
    FIRST_NAME = EditProfilePageLocaters.FIRST_NAME
    LAST_NAME = EditProfilePageLocaters.LAST_NAME
    ADDITIONAL_NAME = EditProfilePageLocaters.ADDITIONAL_NAME
    HEADLINE = EditProfilePageLocaters.HEADLINE
    INDUSTRY = EditProfilePageLocaters.INDUSTRY
    SCHOOL = EditProfilePageLocaters.SCHOOL
    ADD_NEW_EDUCATION_BUTTON = EditProfilePageLocaters.ADD_NEW_EDUCATION_BUTTON
    LOCATION = EditProfilePageLocaters.LOCATION
    CITY = EditProfilePageLocaters.CITY
    SAVE_BUTTON = EditProfilePageLocaters.SAVE_BUTTON
    FIRST_NAME_AFTER_CLICK = EditProfilePageLocaters.FIRST_NAME_AFTER_CLICK
    LAST_NAME_AFTER_CLICK = EditProfilePageLocaters.LAST_NAME_AFTER_CLICK
    DISMISS_BUTTON = EditProfilePageLocaters.DISMISS_BUTTON
    DISCARD_CHANGES_BUTTON = EditProfilePageLocaters.DISCARD_CHANGES_BUTTON
    NAME_ERROR_MESSAGE_1 = EditProfilePageLocaters.NAME_ERROR_MESSAGE_1
    NAME_ERROR_MESSAGE_2 = EditProfilePageLocaters.NAME_ERROR_MESSAGE_2
    HEADLINE_ERROR_MESSAGE = None
    
    # EDIT CONTACT INFO , WEBSITE, SHOW SCHOOL INFO CHECKBOX
    
    def click_dismiss(self):
        self.click(self.DISMISS_BUTTON)
            
    def edit_first_name(self, first_name):
        self.click(self.FIRST_NAME)
        self.find_element(self.FIRST_NAME).clear()
        time.sleep(2)
        self.send_keys(self.FIRST_NAME_AFTER_CLICK, first_name)
    
    def edit_last_name(self, last_name):
        self.click(self.LAST_NAME)
        self.find_element(self.LAST_NAME).clear()
        time.sleep(1)
        self.send_keys(self.LAST_NAME_AFTER_CLICK, last_name)
    
    def edit_additional_name(self, name):
        self.click(self.ADDITIONAL_NAME)
        time.sleep(1)
        self.send_keys(self.ADDITIONAL_NAME, name)
    
    def edit_headline(self, headline):
        self.click(self.HEADLINE)
        self.find_element(self.HEADLINE).clear()
        time.sleep(1)
        self.send_keys(self.HEADLINE, headline)
    
    def edit_industry(self, industry):
        self.click(self.INDUSTRY)
        time.sleep(2)
        self.send_keys(self.INDUSTRY, industry)
    
    def click_add_new_education(self):
        self.click(self.ADD_NEW_EDUCATION_BUTTON)
    
    def edit_location(self,location):
        self.click(self.LOCATION)
        time.sleep(2)
        self.send_keys(self.LOCATION, location)
    
    def edit_city(self, city):
        self.click(self.CITY)  
        time.sleep(1)
        self.send_keys(self.CITY, city)
    def click_save(self):
        self.click(self.SAVE_BUTTON)
    
    def click_discard_changes(self):
        self.click(self.DISCARD_CHANGES_BUTTON)
    
    def get_message(self, locator):
        return self.get_text(locator)
    