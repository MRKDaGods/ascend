from Pages.Connections.locaters import OthersProfilePageLocaters  # Import the locators for the other profile page 
from Pages.base_page import BasePage  # Import BasePage
import time

class OtherProfilePage(BasePage):
    """ Page Object for Other Profile Page """
    
    CONNECT_BUTTON = OthersProfilePageLocaters.CONNECT_BUTTON
    CONNECT_BUTTON1 = OthersProfilePageLocaters.CONNECT_BUTTON1
    MESSAGE_BUTTON = OthersProfilePageLocaters.MESSAGE_BUTTON
    MORE_OPTIONS_BUTTON = OthersProfilePageLocaters.MORE_OPTIONS_BUTTON
    FOLLOW_BUTTON = OthersProfilePageLocaters.FOLLOW_BUTTON
    BLOCK_BUTTON = OthersProfilePageLocaters.BLOCK_BUTTON
    SHARE_PROFILE_BUTTON = OthersProfilePageLocaters.SHARE_PROFILE_BUTTON
    SHOW_ALL_POSTS_BUTTON = OthersProfilePageLocaters.SHOW_ALL_POSTS_BUTTON
    SHOW_ALL_CERTIFICATIONS = OthersProfilePageLocaters.SHOW_ALL_CERTIFICATIONS
    INVITATION_SENT_MESSAGE = OthersProfilePageLocaters.INVITATION_SENT_MESSAGE
    FOLLOW_BUTTON0 = OthersProfilePageLocaters.FOLLOW_BUTTON0
    FOLLOW_MESSAGE = OthersProfilePageLocaters.FOLLOW_MESSAGE
    UNFOLLOW_BUTTON = OthersProfilePageLocaters.UNFOLLOW_BUTTON
    CONFIM_BLOCK_BUTTON = OthersProfilePageLocaters.CONFIRM_BLOCK_BUTTON
    CONFIRM_AGAIN_BLOCK_BUTTON = OthersProfilePageLocaters.CONFIRM_AGAIN_BLOCK_BUTTON
    BLOCKED_MESSAGE = OthersProfilePageLocaters.BLOCKED_MESSAGE
    FOLLOWING_BUTTON = OthersProfilePageLocaters.FOLLOWING_BUTTON
    
    def click_Connect_Button(self):
        try:
            self.click(self.CONNECT_BUTTON)
        except:
            self.click(self.MORE_OPTIONS_BUTTON)
            time.sleep(1)
            self.click(self.CONNECT_BUTTON1)
        
    def click_Message_Button(self):
        self.click(self.MESSAGE_BUTTON)
    
    def click_More_Options_Button(self):
        self.click(self.MORE_OPTIONS_BUTTON)
    
    def click_Follow_Button(self):
        try:
            self.click(self.FOLLOW_BUTTON0)
        except:
            self.click(self.MORE_OPTIONS_BUTTON)
            time.sleep(1)
            self.click(self.FOLLOW_BUTTON)
    
    def click_Block_Button(self):
        self.click(self.BLOCK_BUTTON)
    
    def click_Share_Profile_Button(self):
        self.click(self.SHARE_PROFILE_BUTTON)
    
    def click_Show_All_Posts_Button(self):
        self.click(self.SHOW_ALL_POSTS_BUTTON)
    
    def click_Show_All_Certifications(self):
        self.click(self.SHOW_ALL_CERTIFICATIONS)
    
    def click_Unfollow_Button(self):
        self.click(self.UNFOLLOW_BUTTON)
    
    def click_folllow_message(self):
        self.click(self.FOLLOW_MESSAGE)
    
    def click_Confirm_Block_Button(self):
        self.click(self.CONFIM_BLOCK_BUTTON)
    
    def click_Confirm_Again_Block_Button(self):
        self.click(self.CONFIRM_AGAIN_BLOCK_BUTTON)
    
