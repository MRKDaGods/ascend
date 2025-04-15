from appium.webdriver.common.appiumby import AppiumBy as By  # Import AppiumBy
from Pages.base_page import BasePage  # Import BasePage
from Pages.Navigation.locaters import SideBarLocators  # Import LoginLocators

class SideBarPage(BasePage):
    """ Page Object for Login Page """
    
    MYPROFILE_BUTTON = SideBarLocators.MYPROFILE_BUTTON
    SETTINGS_BUTTON = SideBarLocators.SETTINGS_BUTTON
    SIGNOUT_BUTTON = SideBarLocators.SIGNOUT_BUTTON
    CONFIRM_SIGNOUT = SideBarLocators.CONFIRM_SIGNOUT
    CONFIRM_SIGNOUT_2 = SideBarLocators.CONFIRM_SIGNOUT_2
    PROFILE_VISIBILITY_BUTTON = SideBarLocators.PROFILE_VISIBILITY_BUTTON
    BLOCKED_LIST_BUTTON = SideBarLocators.BLOCKED_LIST_BUTTON
    UNBLOCK_BUTTON = SideBarLocators.UNBLOCK_BUTTON
    SAVED_POSTS_BUTTON = SideBarLocators.SAVED_POSTS_BUTTON

        
    def click_Myprofile(self):
        self.click(self.MYPROFILE_BUTTON)
    
    def click_Settings(self):
        self.click(self.SETTINGS_BUTTON)
    
    def click_Signout(self):
        self.click(self.SIGNOUT_BUTTON)

    def click_Confirm_Signout(self):
        try:
            self.click(self.CONFIRM_SIGNOUT)
        except:
            self.click(self.CONFIRM_SIGNOUT_2)
            
    def click_Profile_Visibility_Button(self):
        self.click(self.PROFILE_VISIBILITY_BUTTON)
    
    def click_Blocked_List_Button(self):
        self.click(self.BLOCKED_LIST_BUTTON)
    
    def click_Unblock_Button(self):
        self.click(self.UNBLOCK_BUTTON)

    # def get_message(self):
    #     return self.get_text(self.MESSAGE)
    def click_Saved_Posts_Button(self):
        self.click(self.SAVED_POSTS_BUTTON)
    