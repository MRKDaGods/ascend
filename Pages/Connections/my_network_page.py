from Pages.Connections.locaters import MyNetworkPageLocaters  
from Pages.base_page import BasePage  # Import BasePage
import time

class MyNetworkPage(BasePage):
    """ Page Object for My Network """
    #donto fotrget to add pending connections
    GROW_BUTTON = MyNetworkPageLocaters.GROW_BUTTON
    CATCH_UP_BUTTON = MyNetworkPageLocaters.CATCH_UP_BUTTON
    INVITATIONS_BUTTON = MyNetworkPageLocaters.INVITATIONS_BUTTON
    MANAGE_MY_NETWORK_BUTTON = MyNetworkPageLocaters.MANAGE_MY_NETWORK_BUTTON
    FIRST_CONNECT_BUTTON = MyNetworkPageLocaters.FIRST_CONNECT_BUTTON
    FIRST_PROFILE_BUTTON = MyNetworkPageLocaters.FIRST_PROFILE_BUTTON
    FIRST_FOLLOW_BUTTON = MyNetworkPageLocaters.FIRST_FOLLOW_BUTTON
    ACCEPT_CONNECTION_BUTTON = MyNetworkPageLocaters.ACCEPT_CONNECTION_BUTTON
    DECLINE_CONNECTION_BUTTON = MyNetworkPageLocaters.DECLINE_CONNECTION_BUTTON
    PERSON_IS_NOW_CONNECTION_MESSAGE = MyNetworkPageLocaters.PERSON_IS_NOW_CONNECTION_MESSAGE
    
    def click_Grow_Button(self):
        self.click(self.GROW_BUTTON)    
    
    def click_Catch_Up_Button(self):
        self.click(self.CATCH_UP_BUTTON)
    
    def click_Invitations_Button(self):
        self.click(self.INVITATIONS_BUTTON)
    
    def click_Manage_My_Network_Button(self):
        self.click(self.MANAGE_MY_NETWORK_BUTTON)
    
    def click_First_Connect_Button(self):
        self.click(self.FIRST_CONNECT_BUTTON)
    
    def click_First_Profile_Button(self):
        self.click(self.FIRST_PROFILE_BUTTON)
    
    def click_First_Follow_Button(self):
        self.click(self.FIRST_FOLLOW_BUTTON)
        
    def click_accept_connection_button(self):
        self.click(self.ACCEPT_CONNECTION_BUTTON)
    
    def click_decline_connection_button(self):
        self.click(self.DECLINE_CONNECTION_BUTTON)
    