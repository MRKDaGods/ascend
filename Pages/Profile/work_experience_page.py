from appium.webdriver.common.appiumby import AppiumBy as By  # Import AppiumBy
from Pages.base_page import BasePage  # Import BasePage
from Pages.Profile.locaters import WorkExperiencePageLocaters  # Import LoginLocators
import time

class WorkExperiencePage(BasePage):
    """ Page Object for Login Page """
    TITLE_TEXT_BOX = WorkExperiencePageLocaters.TITLE_TEXT_BOX
    TITLE_TEXT_BOX_AFTER_CLICK = WorkExperiencePageLocaters.TITLE_TEXT_BOX_AFTER_CLICK
    ENTERED_TITLE_BUTTON = None
    EMPLOYMENT_TYPE_DROPDOWN = WorkExperiencePageLocaters.EMPLOYMENT_TYPE_DROPDOWN
    EMPLOYMENT_TYPE_FULL_TIME_RADIO_BUTTON = WorkExperiencePageLocaters.EMPLOYMENT_TYPE_FULL_TIME_RADIO_BUTTON
    EMPLOYMENT_TYPE_PART_TIME_RADIO_BUTTON = WorkExperiencePageLocaters.EMPLOYMENT_TYPE_PART_TIME_RADIO_BUTTON
    EMPLOYMENT_TYPE_INTERNSHIP_RADIO_BUTTON = WorkExperiencePageLocaters.EMPLOYMENT_TYPE_INTERNSHIP_RADIO_BUTTON
    COMPANY_NAME_TEXT_BOX =   WorkExperiencePageLocaters.COMPANY_NAME_TEXT_BOX
    COMPANY_NAME_TEXT_BOX_AFTER_CLICK = WorkExperiencePageLocaters.COMPANY_NAME_TEXT_BOX_AFTER_CLICK
    ENTERED_COMPANY_NAME_BUTTON = None
    CURRENTLY_WORKING_CHECKBOX = WorkExperiencePageLocaters.CURRENTLY_WORKING_CHECKBOX
    START_DATE = WorkExperiencePageLocaters.START_DATE
    END_DATE = WorkExperiencePageLocaters.END_DATE
    LOCATION_TEXT_BOX = WorkExperiencePageLocaters.LOCATION_TEXT_BOX
    LOCATION_TEXT_BOX_AFTER_CLICK = WorkExperiencePageLocaters.LOCATION_TEXT_BOX_AFTER_CLICK
    ENTERED_LOCATION_BUTTON = None
    LOCATION_TYPE_DROPDOWN = WorkExperiencePageLocaters.LOCATION_TYPE_DROPDOWN
    LOCATION_TYPE_ONSITE_RADIO_BUTTON = WorkExperiencePageLocaters.LOCATION_TYPE_ONSITE_RADIO_BUTTON
    LOCATION_TYPE_REMOTE_RADIO_BUTTON = WorkExperiencePageLocaters.LOCATION_TYPE_REMOTE_RADIO_BUTTON
    LOCATION_TYPE_HYPRID_RADIO_BUTTON = WorkExperiencePageLocaters.LOCATION_TYPE_HYPRID_RADIO_BUTTON
    DESCRIPTION_TEXT_BOX = WorkExperiencePageLocaters.DESCRIPTION_TEXT_BOX
    PROFILE_HEADLINE_TEXT_BOX = WorkExperiencePageLocaters.PROFILE_HEADLINE_TEXT_BOX
    WHERE_DID_YOU_FIND_THIS_JOB_DROPDOWN = WorkExperiencePageLocaters.WHERE_DID_YOU_FIND_THIS_JOB_DROPDOWN
    ADD_SKILLS_BUTTON = WorkExperiencePageLocaters.ADD_SKILLS_BUTTON
    ADD_MEDIA_BUTTON = WorkExperiencePageLocaters.ADD_MEDIA_BUTTON
    ADD_LINK_BUTTON = WorkExperiencePageLocaters.ADD_LINK_BUTTON
    ADD_PHOTO_BUTTON = WorkExperiencePageLocaters.ADD_PHOTO_BUTTON
    SAVE_BUTTON = WorkExperiencePageLocaters.SAVE_BUTTON
    START_MONTH = WorkExperiencePageLocaters.START_MONTH
    START_YEAR = WorkExperiencePageLocaters.START_YEAR
    END_MONTH = WorkExperiencePageLocaters.END_MONTH
    END_YEAR = WorkExperiencePageLocaters.END_YEAR
    SET_DATE_BUTTON = WorkExperiencePageLocaters.SET_DATE_BUTTON
    CLOSE_BUTTON = WorkExperiencePageLocaters.CLOSE_BUTTON
    
  
    
    
    def enter_title(self, title):
        self.click(self.TITLE_TEXT_BOX)
        time.sleep(1)
        self.send_keys(self.TITLE_TEXT_BOX_AFTER_CLICK, title)
        self.update_entered_title_element(title)
        self.click(self.ENTERED_TITLE_BUTTON)
        
        
    
    def update_entered_title_element(self, title):
        self.ENTERED_TITLE_BUTTON = (By.XPATH, '//android.widget.TextView[contains(@resource-id, "com.linkedin.android:id/typeahead_text") and contains(@text, "{}")]'.format(title))
    
    def select_employment_type(self, employment_type):
        if employment_type == 'Full-time':
            self.click(self.EMPLOYMENT_TYPE_DROPDOWN)
            self.click(self.EMPLOYMENT_TYPE_FULL_TIME_RADIO_BUTTON)
        elif employment_type == 'Part-time':
            self.click(self.EMPLOYMENT_TYPE_DROPDOWN)
            self.click(self.EMPLOYMENT_TYPE_PART_TIME_RADIO_BUTTON)
        elif employment_type == 'Internship':
            self.click(self.EMPLOYMENT_TYPE_DROPDOWN)
            self.click(self.EMPLOYMENT_TYPE_INTERNSHIP_RADIO_BUTTON)
    
    def enter_company_name(self, company_name):
        self.click(self.COMPANY_NAME_TEXT_BOX)
        time.sleep(2)
        self.send_keys(self.COMPANY_NAME_TEXT_BOX_AFTER_CLICK, company_name)
        self.update_entered_company_name_element(company_name)
        self.click(self.ENTERED_COMPANY_NAME_BUTTON)
    
    def update_entered_company_name_element(self, company_name):
        self.ENTERED_COMPANY_NAME_BUTTON = (By.XPATH, '//android.widget.TextView[contains(@resource-id, "com.linkedin.android:id/typeahead_text") and contains(@text, "{}")]'.format(company_name))
    
    def check_currently_working(self):
        self.click(self.CURRENTLY_WORKING_CHECKBOX)
    
    def click_start_date(self):
        self.click(self.START_DATE)
    
    def click_end_date(self):
        self.click(self.END_DATE)
    
    def enter_location(self, location):
        self.click(self.LOCATION_TEXT_BOX)
        self.send_keys(self.LOCATION_TEXT_BOX_AFTER_CLICK, location)
        self.update_entered_location_element(location)
        self.click(self.ENTERED_LOCATION_BUTTON)
    
    def update_entered_location_element(self, location):
        self.ENTERED_LOCATION_BUTTON = (By.XPATH, '//android.widget.TextView[contains(@resource-id, "com.linkedin.android:id/typeahead_text") and contains(@text, "{}")]'.format(location))
    
    def select_location_type(self, location_type):
        self.select_dropdown(self.LOCATION_TYPE_DROPDOWN, location_type)
    
    
    def enter_description(self, description):
        self.send_keys(self.DESCRIPTION_TEXT_BOX, description)
    
    def enter_profile_headline(self, profile_headline):
        self.send_keys(self.PROFILE_HEADLINE_TEXT_BOX, profile_headline)
        
    def select_where_did_you_find_this_job(self, where_did_you_find_this_job):
        self.select_dropdown(self.WHERE_DID_YOU_FIND_THIS_JOB_DROPDOWN, where_did_you_find_this_job)
    
    def click_add_skills(self):
        self.click(self.ADD_SKILLS_BUTTON)
    
    def click_add_media(self):
        self.click(self.ADD_MEDIA_BUTTON)
    
    def click_save(self):
        self.click(self.SAVE_BUTTON)
        
    
    def click_add_link(self):
        self.click(self.ADD_LINK_BUTTON)
    
    def click_add_photo(self):
        self.click(self.ADD_PHOTO_BUTTON)
    
    
    def click_set_date(self):
        self.click(self.SET_DATE_BUTTON)
        
    def click_start_month(self):
        self.click(self.START_MONTH)
    
    def click_start_year(self):
        self.click(self.START_YEAR)
    
    def click_end_month(self):
        self.click(self.END_MONTH)
    
    def click_end_year(self):
        self.click(self.END_YEAR)
        
    def click_close(self):
        self.click(self.CLOSE_BUTTON)
        
    def get_message(self):
        return self.get_text(self.MESSAGE)
    