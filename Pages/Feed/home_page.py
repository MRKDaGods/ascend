from appium.webdriver.common.appiumby import AppiumBy as By  # Import AppiumBy
from Pages.base_page import BasePage  # Import BasePage
from Pages.Feed.locaters import HomeLocators  # Import HomeLocators

class HomePage(BasePage):
    """ Page Object for Home Page """
    
    SIDEBAR_BUTTON = HomeLocators.SIDEBAR_BUTTON
    WELCOME_MESSAGE = HomeLocators.WELCOME_MESSAGE
    CLOSE_BUTTON = HomeLocators.CLOSE_BUTTON
    MESSAGING_BUTTON = HomeLocators.MESSAGING_BUTTON
    LIKE_BUTTON = HomeLocators.LIKE_BUTTON
    COMMENT_BUTTON = HomeLocators.COMMENT_BUTTON
    SHARE_BUTTON = HomeLocators.SHARE_BUTTON
    VIEW_PROFILE_FROM_POST_BUTTON = HomeLocators.VIEW_PROFILE_FROM_POST_BUTTON
    POST_OPTIONS = HomeLocators.POST_OPTIONS
    SAVE_POST_BUTTON = HomeLocators.SAVE_POST_BUTTON
    SHARE_VIA_BUTTON = HomeLocators.SHARE_VIA_BUTTON
    REPORT_POST_BUTTON = HomeLocators.REPORT_POST_BUTTON
    WRITE_POST = HomeLocators.WRITE_POST
    ADD_PHOTO_TO_POST = HomeLocators.ADD_PHOTO_TO_POST
    MORE_BUTTON = HomeLocators.MORE_BUTTON
    ADD_EVENT_TO_POST = HomeLocators.ADD_EVENT_TO_POST
    ADD_JOB_TO_POST = HomeLocators.ADD_JOB_TO_POST
    ADD_DOCUMENT_TO_POST = HomeLocators.ADD_DOCUMENT_TO_POST
    POST_BUTTON = HomeLocators.POST_BUTTON
    VIEW_THE_FULL_POST = HomeLocators.VIEW_THE_FULL_POST
    REACTIONS_COUNT = HomeLocators.REACTIONS_COUNT
    SEARCH_BAR = HomeLocators.SEARCH_BAR
    CHOOSE_DOCUMENT_FILE = HomeLocators.CHOOSE_DOCUMENT_FILE
    WRITE_DOCUMENT_TITLE = HomeLocators.WRITE_DOCUMENT_TITLE
    DOCUMENT_FILE = HomeLocators.DOCUMENT_FILE
    NEXT_BUTTON = HomeLocators.NEXT_BUTTON
    POST_INFO = HomeLocators.POST_INFO
    LIKE_BUTTON1 = HomeLocators.LIKE_BUTTON1
    POST_UPLOADED_SUCCESFUL_MESSAGE = HomeLocators.POST_UPLOADED_SUCCESFUL_MESSAGE
    
    

    
    def click_sidebar(self):
        self.click(self.SIDEBAR_BUTTON)
    
    def click_close_button(self):
        self.click(self.CLOSE_BUTTON)
    
    def click_search_bar(self):
        self.click(self.SEARCH_BAR)
    
    def get_message(self, message):
        return self.get_text(message)
    
    def click_messaging_button(self):
        self.click(self.MESSAGING_BUTTON)
    
    def click_like_button(self):
        try:
            self.click(self.LIKE_BUTTON)
        except:
            self.click(self.LIKE_BUTTON1)
        
    def click_comment_button(self):
        self.click(self.COMMENT_BUTTON)
    
    def click_share_button(self):
        self.click(self.SHARE_BUTTON)
    
    def click_view_profile_from_post_button(self):
        self.click(self.VIEW_PROFILE_FROM_POST_BUTTON)
    
    def click_post_options(self):
        self.click(self.POST_OPTIONS)
    
    def click_save_post_button(self):
        self.click(self.SAVE_POST_BUTTON)
    
    def click_share_via_button(self):
        self.click(self.SHARE_VIA_BUTTON)
    
    def click_report_post_button(self):
        self.click(self.REPORT_POST_BUTTON)
    
    def click_write_post(self, text):
        self.click(self.WRITE_POST)
        self.send_keys(self.WRITE_POST, text)
    
    def click_add_photo_to_post(self):
        self.click(self.ADD_PHOTO_TO_POST)
    
    def click_more_button(self):
        self.click(self.MORE_BUTTON)
    
    def click_add_event_to_post(self):
        self.click(self.ADD_EVENT_TO_POST)
    
    def click_add_job_to_post(self):
        self.click(self.ADD_JOB_TO_POST)
    
    def click_add_document_to_post(self):
        self.click(self.ADD_DOCUMENT_TO_POST)
    
    def click_post_button(self):
        self.click(self.POST_BUTTON)
    
    def click_view_the_full_post(self):
        self.click(self.REACTIONS_COUNT)
    
    def click_reactions_count(self):
        self.click(self.REACTIONS_COUNT)
    
    def click_choose_document_file(self):
        self.click(self.CHOOSE_DOCUMENT_FILE)
    
    def click_write_document_title(self, title):
        self.click(self.WRITE_DOCUMENT_TITLE)
        self.send_keys(self.WRITE_DOCUMENT_TITLE, title)
    
    def click_document_file(self):
        self.click(self.DOCUMENT_FILE)
    
    def click_next_button(self):
        self.click(self.NEXT_BUTTON)
    
    