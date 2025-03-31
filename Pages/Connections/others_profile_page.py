from Pages.Connections.locaters import OthersProfilePageLocaters  # Import the locators for the other profile page 
from Pages.base_page import BasePage  # Import BasePage
import time

class OtherProfilePage(BasePage):
    """ Page Object for Other Profile Page """
    
    CONNECT_BUTTON = OthersProfilePageLocaters.CONNECT_BUTTON
    MESSAGE_BUTTON = OthersProfilePageLocaters.MESSAGE_BUTTON
    MORE_OPTIONS_BUTTON = OthersProfilePageLocaters.MORE_OPTIONS_BUTTON
    FOLLOW_BUTTON = OthersProfilePageLocaters.FOLLOW_BUTTON
    BLOCK_BUTTON = OthersProfilePageLocaters.BLOCK_BUTTON
    SHARE_PROFILE_BUTTON = OthersProfilePageLocaters.SHARE_PROFILE_BUTTON
    SHOW_ALL_POSTS_BUTTON = OthersProfilePageLocaters.SHOW_ALL_POSTS_BUTTON
    SHOW_ALL_CERTIFICATIONS = OthersProfilePageLocaters.SHOW_ALL_CERTIFICATIONS
    
    def click_Connect_Button(self):
        self.click(self.CONNECT_BUTTON)
    
    def click_Message_Button(self):
        self.click(self.MESSAGE_BUTTON)
    
    def click_More_Options_Button(self):
        self.click(self.MORE_OPTIONS_BUTTON)
    
    def click_Follow_Button(self):
        self.click(self.FOLLOW_BUTTON)
    
    def click_Block_Button(self):
        self.click(self.BLOCK_BUTTON)
    
    def click_Share_Profile_Button(self):
        self.click(self.SHARE_PROFILE_BUTTON)
    
    def click_Show_All_Posts_Button(self):
        self.click(self.SHOW_ALL_POSTS_BUTTON)
    
    def click_Show_All_Certifications(self):
        self.click(self.SHOW_ALL_CERTIFICATIONS)
    
