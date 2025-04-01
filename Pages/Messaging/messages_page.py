from Pages.Messaging.locaters import MessagesPageLocaters
from Pages.base_page import BasePage  # Import BasePage



class MessagesPage(BasePage):
    """ Page Object for Messages Page """
    
    UNREAD_BUTTON = MessagesPageLocaters.UNREAD_BUTTON
    BACK_BUTTON = MessagesPageLocaters.BACK_BUTTON
    MORE_OPTIONS_BUTTON = MessagesPageLocaters.MORE_OPTIONS_BUTTON
    SEARCH_MESSAGE_BUTTON = MessagesPageLocaters.SEARCH_MESSAGE_BUTTON
    SEARCH_MESSAGE_TEXT_BOX = MessagesPageLocaters.SEARCH_MESSAGE_TEXT_BOX
    FIRST_SEARCHED_MESSAGE = MessagesPageLocaters.FIRST_SEARCHED_MESSAGE
    FIRST_MESSAGE_BUTTON = MessagesPageLocaters.FIRST_MESSAGE_BUTTON
    SECOUND_MESSAGE_BUTTON = MessagesPageLocaters.SECOUND_MESSAGE_BUTTON
    NEW_MESSAGE_BUTTON = MessagesPageLocaters.NEW_MESSAGE_BUTTON
    NEW_MESSAGE_TEXT_BOX = MessagesPageLocaters.NEW_MESSAGE_TEXT_BOX
    CHOSEN_NEW_MESSAGE = MessagesPageLocaters.CHOSEN_NEW_MESSAGE
    
    def click_Unread_Button(self):
        self.click(self.UNREAD_BUTTON)
        
    def click_Back_Button(self):
        self.click(self.BACK_BUTTON)
        
    def click_More_Options_Button(self):
        self.click(self.MORE_OPTIONS_BUTTON)
    
    def click_Search_Message_Button(self):
        self.click(self.SEARCH_MESSAGE_BUTTON)
    
    def enter_Search_Message_Text_Box(self, text):
        self.send_keys(self.SEARCH_MESSAGE_TEXT_BOX, text)
    
    def click_First_Searched_Message(self):
        self.click(self.FIRST_SEARCHED_MESSAGE)
    
    def click_First_Message_Button(self):
        self.click(self.FIRST_MESSAGE_BUTTON)
    
    def click_Seconed_Message_Button(self):
        self.click(self.SECOUND_MESSAGE_BUTTON)
    
    def click_New_Message_Button(self):
        self.click(self.NEW_MESSAGE_BUTTON)
    
    def enter_New_Message_Text_Box(self, text):
        self.send_keys(self.NEW_MESSAGE_TEXT_BOX, text)
    
    def click_Chosen_New_Message(self):
        self.click(self.CHOSEN_NEW_MESSAGE)
    
    
        