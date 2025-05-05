from Pages.base_page import BasePage  # Import BasePage
from Pages.Privacy_and_security.locaters import AscendPrivacyAndSecurityLocators

class AscendPrivacyAndSecurityPage(BasePage):
    """ Page Object for Privacy and Security Page """
    
    # Locators for the Privacy and Security page
    SIDE_BAR_BUTOTN = AscendPrivacyAndSecurityLocators.SIDE_BAR_BUTOTN
    SETTINGS_BUTTON = AscendPrivacyAndSecurityLocators.SETTINGS_BUTTON
    CONNECTIONS_PREFERENCES_BUTTON = AscendPrivacyAndSecurityLocators.CONNECTIONS_PREFERENCES_BUTTON
    ALLOW_CONNNECTION_REQUESTS_BUTTON = AscendPrivacyAndSecurityLocators.ALLOW_CONNNECTION_REQUESTS_BUTTON
    FIRST_USER = AscendPrivacyAndSecurityLocators.FIRST_USER
    MORE_OPTIONS_BUTTON = AscendPrivacyAndSecurityLocators.MORE_OPTIONS_BUTTON
    REPORT_BLOCK_BUTOTN = AscendPrivacyAndSecurityLocators.REPORT_BLOCK_BUTOTN
    BLOCKED_USERS_BUTTON = AscendPrivacyAndSecurityLocators.BLOCKED_USERS_BUTTON
    UNBLOCK_USER_BUTTON = AscendPrivacyAndSecurityLocators.UNBLOCK_USER_BUTTON
    SAVE_BUTTON = AscendPrivacyAndSecurityLocators.SAVE_BUTTON
    REPORT_BLOCK_MESSAGE = AscendPrivacyAndSecurityLocators.REPORT_BLOCK_MESSAGE
    FIRST_USER2 = AscendPrivacyAndSecurityLocators.FIRST_USER2
    
    def click_Side_Bar_Button(self):
        self.click(self.SIDE_BAR_BUTOTN)
    
    def click_Settings_Button(self):
        self.click(self.SETTINGS_BUTTON)
    
    def click_Connections_Preferences_Button(self):
        self.click(self.CONNECTIONS_PREFERENCES_BUTTON)
    
    def click_Allow_Connection_Requests_Button(self):
        self.click(self.ALLOW_CONNNECTION_REQUESTS_BUTTON)
    
    def click_Save_Button(self):
        self.click(self.SAVE_BUTTON)
        
    def click_First_User(self):
        try:
            self.click(self.FIRST_USER)
        except:
            self.click(self.FIRST_USER2)
    
    def click_More_Options_Button(self):
        self.click(self.MORE_OPTIONS_BUTTON)
    
    def click_Report_Block_Button(self):
        self.click(self.REPORT_BLOCK_BUTOTN)
    
    def click_Blocked_Users_Button(self):
        self.click(self.BLOCKED_USERS_BUTTON)
    
    def click_Unblock_User_Button(self):
        self.click(self.UNBLOCK_USER_BUTTON)