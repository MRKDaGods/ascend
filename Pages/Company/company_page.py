from Pages.base_page import BasePage
from Pages.Company.locaters import CompanyPageLocators

class CompanyPage(BasePage):
    """ Page Object for Company Page """
    JOBS_BUTTON = CompanyPageLocators.JOBS_BUTTON
    MANAGE_COMPANY_BUTTON = CompanyPageLocators.MANAGE_COMPANY_BUTTON
    CREATE_NEW_COMPANY_BUTTON = CompanyPageLocators.CREATE_NEW_COMPANY_BUTTON
    COMPANY_NAME_TEXT_BOX = CompanyPageLocators.COMPANY_NAME_TEXT_BOX
    DESCRIPTION_TEXT_BOX = CompanyPageLocators.DESCRIPTION_TEXT_BOX
    INDUSTRY_TEXT_BOX = CompanyPageLocators.INDUSTRY_TEXT_BOX
    LOCATION_TEXT_BOX = CompanyPageLocators.LOCATION_TEXT_BOX
    DOMAIN_NAME_TEXT_BOX = CompanyPageLocators.DOMAIN_NAME_TEXT_BOX
    UPLOAD_PROFILE_PHOTO_BUTTON = CompanyPageLocators.UPLOAD_PROFILE_PHOTO_BUTTON
    VALID_PROFILE_PHOTO_BUTTON = CompanyPageLocators.VALID_PROFILE_PHOTO_BUTTON
    UPLOAD_COVER_PHOTO_BUTTON = CompanyPageLocators.UPLOAD_COVER_PHOTO_BUTTON
    VALID_COVER_PHOTO_BUTTON = CompanyPageLocators.VALID_COVER_PHOTO_BUTTON
    CREATE_COMPANY_BUTTON = CompanyPageLocators.CREATE_COMPANY_BUTTON
    CHOSEN_COMPANY_TO_EDIT_BUTTON = CompanyPageLocators.CHOSEN_COMPANY_TO_EDIT_BUTTON
    EDIT_COMPANY_BUTTON = CompanyPageLocators.EDIT_COMPANY_BUTTON
    DELETE_COMPANY_BUTTON = CompanyPageLocators.DELETE_COMPANY_BUTTON
    EDIT_COMPANY_NAME_TEXT_BOX = CompanyPageLocators.EDIT_COMPANY_NAME_TEXT_BOX
    EDIT_DESCRIPTION_TEXT_BOX = CompanyPageLocators.EDIT_DESCRIPTION_TEXT_BOX
    EDIT_INDUSTRY_TEXT_BOX = CompanyPageLocators.EDIT_INDUSTRY_TEXT_BOX
    EDIT_LOCATION_TEXT_BOX = CompanyPageLocators.EDIT_LOCATION_TEXT_BOX
    UPDATE_COMPANY_BUTTON = CompanyPageLocators.UPDATE_COMPANY_BUTTON
    FAILED_TO_CREATE_COMPANY_MESSAGE = CompanyPageLocators.FAILED_TO_CREATE_COMPANY_MESSAGE
    COMPANY_CREATED_MESSAGE = CompanyPageLocators.COMPANY_CREATED_MESSAGE
    #######################################################################################################################
    # Locaters for add job on the Company page on Ascend
    CHOSEN_COMPANY_TO_ADD_JOB_BUTTON = CompanyPageLocators.CHOSEN_COMPANY_TO_ADD_JOB_BUTTON
    ADD_JOB_BUTTON = CompanyPageLocators.ADD_JOB_BUTTON
    JOB_TITLE_TEXT_BOX = CompanyPageLocators.JOB_TITLE_TEXT_BOX
    JOB_DESCRIPTION_TEXT_BOX = CompanyPageLocators.JOB_DESCRIPTION_TEXT_BOX
    JOB_INDUSTRY_TEXT_BOX = CompanyPageLocators.JOB_INDUSTRY_TEXT_BOX
    JOB_LOCATION_TEXT_BOX = CompanyPageLocators.JOB_LOCATION_TEXT_BOX
    CREATE_JOB_BUTTON = CompanyPageLocators.CREATE_JOB_BUTTON
    JOB_CREATED_MESSAGE = CompanyPageLocators.JOB_CREATED_MESSAGE
    CHOSEN_JOB = CompanyPageLocators.CHOSEN_JOB
    ASSERT_JOB_APPLICANTS = CompanyPageLocators.ASSERT_JOB_APPLICANTS
    
    def click_Jobs_Button(self):
        self.click(self.JOBS_BUTTON)
    
    def click_Manage_Company_Button(self):
        self.click(self.MANAGE_COMPANY_BUTTON)
    
    def click_Create_New_Company_Button(self):
        self.click(self.CREATE_NEW_COMPANY_BUTTON)
    
    def enter_Company_Name_Text_Box(self, text):
        self.send_keys(self.COMPANY_NAME_TEXT_BOX, text)
    
    def enter_Description_Text_Box(self, text):
        self.send_keys(self.DESCRIPTION_TEXT_BOX, text)
    
    def enter_Industry_Text_Box(self, text):
        self.send_keys(self.INDUSTRY_TEXT_BOX, text)
    
    def enter_Location_Text_Box(self, text):
        self.send_keys(self.LOCATION_TEXT_BOX, text)
    
    def enter_Domain_Name_Text_Box(self, text):
        self.send_keys(self.DOMAIN_NAME_TEXT_BOX, text)
    
    def click_Upload_Profile_Photo_Button(self):
        self.click(self.UPLOAD_PROFILE_PHOTO_BUTTON)
    
    def click_Valid_Profile_Photo_Button(self):
        self.click(self.VALID_PROFILE_PHOTO_BUTTON)
    
    def click_Upload_Cover_Photo_Button(self):
        self.click(self.UPLOAD_COVER_PHOTO_BUTTON)
    
    def click_Valid_Cover_Photo_Button(self):
        self.click(self.VALID_COVER_PHOTO_BUTTON)
    
    def click_Create_Company_Button(self):
        self.click(self.CREATE_COMPANY_BUTTON)
    
    def click_Chosen_Company_To_Edit_Button(self):
        self.click(self.CHOSEN_COMPANY_TO_EDIT_BUTTON)
    
    def click_Edit_Company_Button(self):
        self.click(self.EDIT_COMPANY_BUTTON)
    
    def click_Delete_Company_Button(self):
        self.click(self.DELETE_COMPANY_BUTTON)
    
    def enter_Edit_Company_Name_Text_Box(self, text):
        self.send_keys(self.EDIT_COMPANY_NAME_TEXT_BOX, text)
    
    def enter_Edit_Description_Text_Box(self, text):
        self.send_keys(self.EDIT_DESCRIPTION_TEXT_BOX, text)
    
    def enter_Edit_Industry_Text_Box(self, text):
        self.send_keys(self.EDIT_INDUSTRY_TEXT_BOX, text)
    
    def enter_Edit_Location_Text_Box(self, text):
        self.send_keys(self.EDIT_LOCATION_TEXT_BOX, text)
    
    def click_Update_Company_Button(self):
        self.click(self.UPDATE_COMPANY_BUTTON)
    
        
    def click_Chosen_Company_To_Add_Job_Button(self):
        self.click(self.CHOSEN_COMPANY_TO_ADD_JOB_BUTTON)
    
    def click_Add_Job_Button(self):
        self.click(self.ADD_JOB_BUTTON)
    
    def enter_Job_Title_Text_Box(self, text):
        self.send_keys(self.JOB_TITLE_TEXT_BOX, text)
    
    def enter_Job_Description_Text_Box(self, text):
        self.send_keys(self.JOB_DESCRIPTION_TEXT_BOX, text)
    
    def enter_Job_Industry_Text_Box(self, text):
        self.send_keys(self.JOB_INDUSTRY_TEXT_BOX, text)
    
    def enter_Job_Location_Text_Box(self, text):
        self.send_keys(self.JOB_LOCATION_TEXT_BOX, text)
    
    def click_Create_Job_Button(self):
        self.click(self.CREATE_JOB_BUTTON)
    
    def click_Chosen_Job(self):
        self.click(self.CHOSEN_JOB)