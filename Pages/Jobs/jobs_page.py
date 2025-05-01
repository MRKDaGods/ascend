from Pages.base_page import BasePage
from Pages.Jobs.locaters import JobPageLocators

class JobPage(BasePage):
    """ Page Object for Job Page """
    NO_THANKS_BUTTON = JobPageLocators.NO_THANKS_BUTTON
    FIRST_SEARCHED_ITEM = JobPageLocators.FIRST_SEARCHED_ITEM
    SEARCH_BY_COMPANY_INDUSTRY_TEXT_BOX = JobPageLocators.SEARCH_BY_COMPANY_INDUSTRY_TEXT_BOX
    SEARCH_BY_CITY_TEXT_BOX = JobPageLocators.SEARCH_BY_CITY_TEXT_BOX
    FILTER_BY_EXPERIENCE_BUTTON = JobPageLocators.FILTER_BY_EXPERIENCE_BUTTON
    FILTER_BY_EXPERIENCE_INTERNSHIP_BUTTON = JobPageLocators.FILTER_BY_EXPERIENCE_INTERNSHIP_BUTTON
    SHOW_RESULTS_BUTTON = JobPageLocators.SHOW_RESULTS_BUTTON
    FILTER_BY_COMPANY_BUTTON = JobPageLocators.FILTER_BY_COMPANY_BUTTON
    FILTER_BY_COMPANY_IBM = JobPageLocators.FILTER_BY_COMPANY_IBM
    FIRT_SEARCHED_JOB = JobPageLocators.FIRT_SEARCHED_JOB
    SAVE_JOB_BUTTON = JobPageLocators.SAVE_JOB_BUTTON
    JOB_SAVED_MESSAGE = JobPageLocators.JOB_SAVED_MESSAGE
    APPLY_BUTTON = JobPageLocators.APPLY_BUTTON
    NO_DONOT_SHARE_PROFILE = JobPageLocators.NO_DONOT_SHARE_PROFILE
    EASY_APPLY_FILTER = JobPageLocators.EASY_APPLY_FILTER
    FIRST_SEARCHED_JOB_FOR_APPLY = JobPageLocators.FIRST_SEARCHED_JOB_FOR_APPLY
    PHONE_NUMBER_TEXT_BOX = JobPageLocators.PHONE_NUMBER_TEXT_BOX
    NEXT_BUTTON = JobPageLocators.NEXT_BUTTON
    UPLOAD_RESUME_BUTTON = JobPageLocators.UPLOAD_RESUME_BUTTON
    PROJECT_DOCUMENT_BUTTON = JobPageLocators.PROJECT_DOCUMENT_BUTTON
    ASSERT_FILTER_BY_COMPANY_IBM = JobPageLocators.ASSERT_FILTER_BY_COMPANY_IBM
    ASSERT_APPLY_JOB = JobPageLocators.ASSERT_APPLY_JOB
    ASSER_INVALID_APPLY_JOB = JobPageLocators.ASSER_INVALID_APPLY_JOB
    SEARCH_BY_CITY_TEXT_BOX2 = JobPageLocators.SEARCH_BY_CITY_TEXT_BOX2
    
    
    def click_No_Thanks_Button(self):
        self.click(self.NO_THANKS_BUTTON)
    
    def click_First_Searched_Item(self):
        self.click(self.FIRST_SEARCHED_ITEM)
    
    def enter_Search_By_Company_Industry_Text_Box(self, text):
        self.send_keys(self.SEARCH_BY_COMPANY_INDUSTRY_TEXT_BOX, text)
    
    def enter_Search_By_City_Text_Box(self, text):
        try:
            self.send_keys(self.SEARCH_BY_CITY_TEXT_BOX2, text)
        except:
            self.send_keys(self.SEARCH_BY_CITY_TEXT_BOX, text)
    
    def click_Filter_By_Experience_Button(self):
        self.click(self.FILTER_BY_EXPERIENCE_BUTTON)
    
    def click_Filter_By_Experience_Internship_Button(self):
        self.click(self.FILTER_BY_EXPERIENCE_INTERNSHIP_BUTTON)
    
    def click_Show_Results_Button(self):
        self.click(self.SHOW_RESULTS_BUTTON)
    
    def click_Filter_By_Company_Button(self):
        self.click(self.FILTER_BY_COMPANY_BUTTON)
    
    def click_Filter_By_Company_IBM(self):
        self.click(self.FILTER_BY_COMPANY_IBM)
    
    def click_First_Searched_Job(self):
        self.click(self.FIRT_SEARCHED_JOB)
    
    def click_Save_Job_Button(self):
        self.click(self.SAVE_JOB_BUTTON)
    
    def click_Apply_Button(self):
        self.click(self.APPLY_BUTTON)
    
    def click_No_Donot_Share_Profile(self):
        self.click(self.NO_DONOT_SHARE_PROFILE)
    
    def click_Easy_Apply_Filter(self):
        self.click(self.EASY_APPLY_FILTER)
    
    def click_First_Searched_Job_For_Apply(self):
        self.click(self.FIRST_SEARCHED_JOB_FOR_APPLY)
    
    def enter_Phone_Number_Text_Box(self, text):
        self.send_keys(self.PHONE_NUMBER_TEXT_BOX, text)
    
    def click_Next_Button(self):
        self.click(self.NEXT_BUTTON)
    
    def click_Upload_Resume_Button(self):
        self.click(self.UPLOAD_RESUME_BUTTON)
    
    def click_Project_Document_Button(self):
        self.click(self.PROJECT_DOCUMENT_BUTTON)
    
    def click_phone_number_text_box(self):
        self.click(self.PHONE_NUMBER_TEXT_BOX)
    
    def click_search_by_city_text_box(self):
        try:
            self.click(self.SEARCH_BY_CITY_TEXT_BOX2)
        except:
            self.click(self.SEARCH_BY_CITY_TEXT_BOX)