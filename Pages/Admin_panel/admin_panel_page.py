from Pages.base_page import BasePage
from Pages.Admin_panel.locaters import AdminPanelLocators as AdminPanelLocators# Import AdminPanelLocators

class AdminPanelPage(BasePage):
      
    SIDE_BAR_BUTTON = AdminPanelLocators.SIDE_BAR_BUTTON
    ADMIN_PANEL_BUTTON = AdminPanelLocators.ADMIN_PANEL_BUTTON
    FILTER_BY_YEAR = AdminPanelLocators.FILTER_BY_YEAR
    USERS_TAB = AdminPanelLocators.USERS_TAB
    POST_TAB = AdminPanelLocators.POST_TAB
    JOBS_TAB = AdminPanelLocators.JOBS_TAB
    DELETE_POST_BUTTON = AdminPanelLocators.DELETE_POST_BUTTON
    CONFIRM_DELETE_BUTTON = AdminPanelLocators.CONFIRM_DELETE_BUTTON
    POST_DELETED_MESSAGE = AdminPanelLocators.POST_DELETED_MESSAGE
    DELETE_USER_BUTTON = AdminPanelLocators.DELETE_USER_BUTTON
    ASSERT_DELETE_JOB = AdminPanelLocators.ASSERT_DELETE_JOB
    SHOW_JOB_REPORTS = AdminPanelLocators.SHOW_JOB_REPORTS
    MARK_JOB_AS_RESOLVED = AdminPanelLocators.MARK_JOB_AS_RESOLVED
    MARK_JOB_AS_RESOLVED_MESSAGE = AdminPanelLocators.MARK_JOB_AS_RESOLVED_MESSAGE 
    ANALYTICS_ASSERT_MESSAGE = AdminPanelLocators.ANALYTICS_ASSERT_MESSAGE 
    
    def click_Side_Bar_Button(self):
        self.click(self.SIDE_BAR_BUTTON)
    
    def click_Admin_Panel_Button(self):
        self.click(self.ADMIN_PANEL_BUTTON)
    
    def click_Filter_By_Year(self):
        self.click(self.FILTER_BY_YEAR)
    
    def click_Users_Tab(self):
        self.click(self.USERS_TAB)
    
    def click_Post_Tab(self):
        self.click(self.POST_TAB)
    
    def click_Jobs_Tab(self):
        self.click(self.JOBS_TAB)
    
    def click_Delete_Post_Button(self):
        self.click(self.DELETE_POST_BUTTON)
    
    def click_Confirm_Delete_Button(self):
        self.click(self.CONFIRM_DELETE_BUTTON)
    
    def click_Delete_User_Button(self):
        self.click(self.DELETE_USER_BUTTON)
    
    def click_Show_Job_Reports(self):
        self.click(self.SHOW_JOB_REPORTS)
    
    def click_Mark_Job_As_Resolved(self):
        self.click(self.MARK_JOB_AS_RESOLVED)
    
    
