from Pages.Notifications.locaters import NotificationsPageLocater # Import the locators for the other profile page 
from Pages.base_page import BasePage  # Import BasePage


class NotificationsPage(BasePage):
    """ Page Object for Notifications Page """
    
    FILTER_BY_ALL = NotificationsPageLocater.FILTER_BY_ALL
    FILTER_BY_JOBS = NotificationsPageLocater.FILTER_BY_JOBS
    FILTER_BY_MY_POSTS = NotificationsPageLocater.FILTER_BY_MY_POSTS
    FILTER_BY_MENTIONS = NotificationsPageLocater.FILTER_BY_MENTIONS
    FIRST_NOTIFICATION = NotificationsPageLocater.FIRST_NOTIFICATION
    SECOND_NOTIFICATION = NotificationsPageLocater.SECOND_NOTIFICATION
    THIRD_NOTIFICATION = NotificationsPageLocater.THIRD_NOTIFICATION
    FIRST_NOTIFICATION_SETTENGS = NotificationsPageLocater.FIRST_NOTIFICATION_SETTENGS
    SECOND_NOTIFICATION_SETTENGS = NotificationsPageLocater.SECOND_NOTIFICATION_SETTENGS
    THIRD_NOTIFICATION_SETTENGS = NotificationsPageLocater.THIRD_NOTIFICATION_SETTENGS
    DELETE_NOTIFICATION = NotificationsPageLocater.DELETE_NOTIFICATION
  
    
    
    def click_Filter_By_All(self):
        self.click(self.FILTER_BY_ALL)
    
    def click_Filter_By_Jobs(self):
        self.click(self.FILTER_BY_JOBS)
    
    def click_Filter_By_My_Posts(self):
        self.click(self.FILTER_BY_MY_POSTS)
    
    def click_Filter_By_Mentions(self):
        self.click(self.FILTER_BY_MENTIONS)
    
    def click_First_Notification(self):
        self.click(self.FIRST_NOTIFICATION)
    
    def click_Second_Notification(self):
        self.click(self.SECOND_NOTIFICATION)
    
    def click_Third_Notification(self):
        self.click(self.THIRD_NOTIFICATION)
    
    def click_First_Notification_Settings(self):
        self.click(self.FIRST_NOTIFICATION_SETTENGS)
    
    def click_Second_Notification_Settings(self):
        self.click(self.SECOND_NOTIFICATION_SETTENGS)
    
    def click_Third_Notification_Settings(self):
        self.click(self.THIRD_NOTIFICATION_SETTENGS)
    
    def click_Delete_Notification(self):
        self.click(self.DELETE_NOTIFICATION)
        