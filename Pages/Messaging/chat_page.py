from Pages.Messaging.locaters import ChatPageLocaters
from Pages.base_page import BasePage  # Import BasePage
from appium.webdriver.common.appiumby import AppiumBy as By  # Import AppiumBy


class ChatPage(BasePage):
    """ Page Object for Chat Page """
    
    MESSAGE_TEXT_BOX = ChatPageLocaters.MESSAGE_TEXT_BOX
    ADD_FILES = ChatPageLocaters.ADD_FILES
    DOCUMENT_UPLOAD = ChatPageLocaters.DOCUMENT_UPLOAD
    MEDIA_UPLOAD = ChatPageLocaters.MEDIA_UPLOAD
    SEND_BUTTON  = ChatPageLocaters.SEND_BUTTON
    CHAT_MORE_OPTIONS = ChatPageLocaters.CHAT_MORE_OPTIONS
    STAR_CHAT = ChatPageLocaters.STAR_CHAT
    MUTE_CHAT = ChatPageLocaters.MUTE_CHAT
    BLOCK_CHAT = ChatPageLocaters.BLOCK_CHAT
    DELETE_CHAT = ChatPageLocaters.DELETE_CHAT
    POPUP_NOTIFICATIONS_AFTER_SEND = ChatPageLocaters.POPUP_NOTIFICATIONS_AFTER_SEND
    SENT_MESSAGE = None
    VALID_IMAGE = ChatPageLocaters.VALID_IMAGE
    CORRUPTED_IMAGE = ChatPageLocaters.CORRUPTED_IMAGE
    DOCUMENT = ChatPageLocaters.DOCUMENT
    NEXT_BUTTON = ChatPageLocaters.NEXT_BUTTON
    MESSAGE = ChatPageLocaters.MESSAGE
    UNSEEN_COUNT = ChatPageLocaters.UNSEEN_COUNT
    

    
    def update_message_locater(self, message):
        self.SENT_MESSAGE = (
            By.XPATH,
            '//android.widget.TextView[@resource-id="com.linkedin.android:id/body" and @text="{}"]'.format(message) #//android.widget.TextView[@resource-id="com.linkedin.android:id/body" and @text="Asdsda"]
        )

    def enter_Message_Text_Box(self, text):
        self.send_keys(self.MESSAGE_TEXT_BOX, text)
    
    def click_Add_Files(self):
        self.click(self.ADD_FILES)
    
    def click_Document_Upload(self):
        self.click(self.DOCUMENT_UPLOAD)
    
    def click_Media_Upload(self):
        self.click(self.MEDIA_UPLOAD)
    
    def click_Send_Button(self):
        self.click(self.SEND_BUTTON)
    
    def click_Chat_More_Options(self):
        self.click(self.CHAT_MORE_OPTIONS)
    
    def click_Star_Chat(self):
        self.click(self.STAR_CHAT)
    
    def click_Mute_Chat(self):
        self.click(self.MUTE_CHAT)
    
    def click_Block_Chat(self):
        self.click(self.BLOCK_CHAT)
    
    def click_Delete_Chat(self):
        self.click(self.DELETE_CHAT)
    
    def click_Popup_Notifications_After_Send(self):
        self.click(self.POPUP_NOTIFICATIONS_AFTER_SEND)
    
    def click_Valid_Image(self):
        self.click(self.VALID_IMAGE)
    
    def click_Corrupted_Image(self):
        self.click(self.CORRUPTED_IMAGE)
    
    def click_Document(self):
        self.click(self.DOCUMENT)
    
    def click_Next_Button(self):
        self.click(self.NEXT_BUTTON)