from appium.webdriver.common.appiumby import AppiumBy as By 
class JobPageLocators:
    # Job Page Locators
    NO_THANKS_BUTTON = (By.ID, 'com.linkedin.android:id/onboarding_open_to_splash_dismiss_action')
    FIRST_SEARCHED_ITEM = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.linkedin.android:id/starter_icon").instance(0)')
    SEARCH_BY_COMPANY_INDUSTRY_TEXT_BOX = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().text("Search by title, skill, or company")')
    SEARCH_BY_CITY_TEXT_BOX = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().text("City, state, or zip code")')
    SEARCH_BY_CITY_TEXT_BOX2 = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().text("Egypt")')
    FILTER_BY_EXPERIENCE_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().text("Experience level")')
    FILTER_BY_EXPERIENCE_INTERNSHIP_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().text("Internship")') #YOU can also use to assert filter by experience level 
    SHOW_RESULTS_BUTTON = (By.ID, 'com.linkedin.android:id/search_filters_bottom_sheet_show_result_button')
    FILTER_BY_COMPANY_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().text("Company")')
    FILTER_BY_COMPANY_IBM = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().text("IBM")') #YOU can also use to assert FILTER by compay
    ASSERT_FILTER_BY_COMPANY_IBM = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.linkedin.android:id/search_filter_name").instance(1)')
    FIRT_SEARCHED_JOB = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.linkedin.android:id/ad_entity_lockup_image").instance(0)')
    SAVE_JOB_BUTTON = (By.ID, 'com.linkedin.android:id/entities_top_card_secondary_button')
    JOB_SAVED_MESSAGE = (By.ID, 'com.linkedin.android:id/banner_content_layout')
    APPLY_BUTTON = (By.ID, 'com.linkedin.android:id/entities_top_card_primary_button')
    NO_DONOT_SHARE_PROFILE = (By.ID, 'com.linkedin.android:id/careers_job_apply_starters_negative_button')
    EASY_APPLY_FILTER = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().text("Easy Apply")')
    FIRST_SEARCHED_JOB_FOR_APPLY = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.linkedin.android:id/careers_job_item_entity_lockup").instance(0)')
    PHONE_NUMBER_TEXT_BOX = (By.ID, 'com.linkedin.android:id/form_edit_text_dash')
    NEXT_BUTTON = (By.ID, 'com.linkedin.android:id/job_apply_flow_bottom_toolbar_cta_2')
    UPLOAD_RESUME_BUTTON = (By.ID, 'com.linkedin.android:id/job_apply_upload_button')
    PROJECT_DOCUMENT_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.google.android.documentsui:id/icon_thumb").instance(0)')
    ASSERT_APPLY_JOB = (By.ID, 'com.linkedin.android:id/job_apply_upload_title')
    ASSER_INVALID_APPLY_JOB = (By.ID, 'com.linkedin.android:id/textinput_error')
    ##########################################################################################
    POST_JOB_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().text("Post a free job")')
    WRITE_JOB_TITLE_BUTTON = (By.ID, 'com.linkedin.android:id/input_item_text_field_layout')
    WRITE_JOB_TITLE_TEXT_BOX = (By.ID, 'com.linkedin.android:id/typeahead_selected_item_view')
    FIRST_SEARCHED_JOB_TITLE = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().text("Software Engineer")')
    WRITE_WITH_AI_BUTTON = (By.ID, 'com.linkedin.android:id/title_page_primary_cta')
    
    