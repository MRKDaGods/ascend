from appium.webdriver.common.appiumby import AppiumBy as By

class AdminPanelLocators:
    # Locators for the Admin Panel page
    SIDE_BAR_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().className("android.view.View").instance(6)')
    ADMIN_PANEL_BUTTON = (By.ACCESSIBILITY_ID, 'Admin Panel')
    ANALYTICS_ASSERT_MESSAGE = (By.ACCESSIBILITY_ID, 'Admin Panel')
    #locater for analytics
    #To Open the deop down swipe 908,428,911,428
    FILTER_BY_YEAR = (By.ACCESSIBILITY_ID, 'Year')
    #Locater for managing reported content section 
    USERS_TAB = (By.ACCESSIBILITY_ID, 'Users\nTab 2 of 4')
    POST_TAB = (By.ACCESSIBILITY_ID, 'Posts\nTab 3 of 4')
    JOBS_TAB = (By.ACCESSIBILITY_ID, 'Jobs\nTab 4 of 4')
    ####Delete reported post
    DELETE_POST_BUTTON = (By.ACCESSIBILITY_ID, 'Delete')
    CONFIRM_DELETE_BUTTON = (By.ACCESSIBILITY_ID, 'Delete')
    POST_DELETED_MESSAGE = (By.ACCESSIBILITY_ID, 'Post deleted successfully')
    ###### Delete or ban user
    DELETE_USER_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().description("Delete User").instance(0)')
    
    ### delete job
    #same delete locater as post 
    ##### show report and status of job
    ASSERT_DELETE_JOB = (By.ACCESSIBILITY_ID, 'Reported Jobs')
    SHOW_JOB_REPORTS = (By.ACCESSIBILITY_ID, 'Show Reports')
    MARK_JOB_AS_RESOLVED = (By.ACCESSIBILITY_ID, 'Resolve')
    MARK_JOB_AS_RESOLVED_MESSAGE = (By.ACCESSIBILITY_ID, 'MARK_JOB_AS_RESOLVED')
    