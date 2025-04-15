from appium.webdriver.common.appiumby import AppiumBy as By

class SideBarLocators:
    MYPROFILE_BUTTON = (By.ID, 'com.linkedin.android:id/identity_mirror_component_profile_name')
    SETTINGS_BUTTON = (By.ID, 'com.linkedin.android:id/home_nav_premium_upsell_text_view')
    SIGNOUT_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("sign_out")')
    CONFIRM_SIGNOUT = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.linkedin.android:id/growth_login_remember_me_pre_logout_bottomsheet_negative_option")')
    CONFIRM_SIGNOUT_2 = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("android:id/button1")')
    PROFILE_VISIBILITY_BUTTON = (By.ID, 'PROFILE_VISIBILITY')
    BLOCKED_LIST_BUTTON = (By.ID, 'manageByBlockedList')
    UNBLOCK_BUTTON = (By.ID, 'ember30')
    

class NavigationBarLocaters:
    HOME_BUTTON = (By.ID, 'com.linkedin.android:id/tab_feed')
    MY_NETWORK_BUTTON = (By.ID, 'com.linkedin.android:id/tab_relationships')
    JOBS_BUTTON = (By.ID, 'com.linkedin.android:id/tab_jobs')
    NOTIFICATIONS_BUTTON = (By.ID, 'com.linkedin.android:id/tab_notifications')
    NEW_POST_BUTTON = (By.ID, 'com.linkedin.android:id/tab_post')
    
class SearchBarLocaters:
    SEARCH_BAR_BUTTON = (By.ID, 'com.linkedin.android:id/search_bar') 
    SEARCH_BAR_SEND_TEXT = (By.ID, 'com.linkedin.android:id/search_bar_edit_text')
    CLEAR_SEARCH_HISTORY_BUTTON = (By.ID, 'com.linkedin.android:id/search_history_button')
    BACK_BUTTON = (By.ACCESSIBILITY_ID, 'Back')
    CLEAR_SEARCH_BAR_BUTTON = (By.ID, 'com.linkedin.android:id/search_bar_dismiss_search_keyword_button')
    SEE_ALL_RESULTS = (By.ID, 'com.linkedin.android:id/search_typeahead_see_all_button')
    FILTER_PEOPLE_BUTTON_WITH_THEIR_COMPANY = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.linkedin.android:id/search_filter_container").instance(0)')
    FILTER_PEOPLE_BUTTON_BY_INDUSTRY = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.linkedin.android:id/search_filter_container").instance(2)')
    FILTER_GROUPS_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.linkedin.android:id/search_filter_container").instance(0)')
    FILTER_POSTS_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.linkedin.android:id/search_filter_container").instance(1)')
    FILTER_COMPANIES_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.linkedin.android:id/search_filter_container").instance(2)')
    FILTER_PEOPLE_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.linkedin.android:id/search_filter_container").instance(3)')
    SEARCHED_ITEM = (By.ID, 'com.linkedin.android:id/infra_grid_image1')
    SEARCHED_PERSON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.linkedin.android:id/infra_grid_image1").instance(0)')
    SEARCHED_PEOPLE_ITEM = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.linkedin.android:id/infra_grid_image1").instance(1)')
    ERROR_MESSAGE = (By.ID, 'error message')