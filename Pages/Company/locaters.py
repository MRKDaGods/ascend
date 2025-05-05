from appium.webdriver.common.appiumby import AppiumBy as By 
class CompanyPageLocators:
    # Locators for the Company page on Ascend
    JOBS_BUTTON = (By.ACCESSIBILITY_ID, 'Jobs\nTab 5 of 5')
    MANAGE_COMPANY_BUTTON = (By.ACCESSIBILITY_ID, 'Manage Company')
    CREATE_NEW_COMPANY_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().className("android.widget.Button").instance(7)')
    COMPANY_NAME_TEXT_BOX = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().className("android.widget.EditText").instance(0)')
    DESCRIPTION_TEXT_BOX = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().className("android.widget.EditText").instance(1)')
    INDUSTRY_TEXT_BOX = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().className("android.widget.EditText").instance(2)')
    LOCATION_TEXT_BOX = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().className("android.widget.EditText").instance(3)')
    DOMAIN_NAME_TEXT_BOX = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().className("android.widget.EditText").instance(4)')
    UPLOAD_PROFILE_PHOTO_BUTTON = (By.ACCESSIBILITY_ID, 'Upload Profile Photo')
    VALID_PROFILE_PHOTO_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.google.android.providers.media.module:id/icon_thumbnail").instance(3)')
    UPLOAD_COVER_PHOTO_BUTTON = (By.ACCESSIBILITY_ID, 'Upload Cover Photo')
    VALID_COVER_PHOTO_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.google.android.providers.media.module:id/icon_thumbnail").instance(1)')
    CREATE_COMPANY_BUTTON = (By.ACCESSIBILITY_ID, 'Create Company')
    CHOSEN_COMPANY_TO_EDIT_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().className("android.widget.Button").instance(3)') #4
    EDIT_COMPANY_BUTTON = (By.ACCESSIBILITY_ID, 'Edit Company')
    DELETE_COMPANY_BUTTON = (By.ACCESSIBILITY_ID, 'Delete Company')
    EDIT_COMPANY_NAME_TEXT_BOX = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().text("attack on titan")')
    EDIT_DESCRIPTION_TEXT_BOX = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().text("made by Sasa cross")')
    EDIT_DESCRIPTION_TEXT_BOX_AFTER_CLICK = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().className("android.widget.EditText").instance(1)')
    EDIT_INDUSTRY_TEXT_BOX = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().text("anime")')
    EDIT_INDUSTRY_TEXT_BOX_AFTER_CLICK = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().className("android.widget.EditText").instance(2)')
    EDIT_LOCATION_TEXT_BOX = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().text("japan")')
    #DOMAIN NAME SAMWE AS THE ONE ABOVE, AND IT IS NOT SAVED IN THE APP
    UPDATE_COMPANY_BUTTON = (By.ACCESSIBILITY_ID, 'Update Company')
    FAILED_TO_CREATE_COMPANY_MESSAGE = (By.ACCESSIBILITY_ID, 'Error: Exception: Failed to create company')
    COMPANY_CREATED_MESSAGE = (By.ACCESSIBILITY_ID, 'Company created successfully')
    COMPANY_UPDATED_MESSAGE = (By.ACCESSIBILITY_ID, 'Company updated successfully!')
    #######################################################################################################################
    # Locaters for add job on the Company page on Ascend
    CHOSEN_COMPANY_TO_ADD_JOB_BUTTON = (By.ACCESSIBILITY_ID, 'anime\njapan')
    ADD_JOB_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().className("android.widget.Button").instance(5)')
    JOB_TITLE_TEXT_BOX = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().className("android.widget.EditText").instance(0)')
    JOB_DESCRIPTION_TEXT_BOX = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().className("android.widget.EditText").instance(1)')
    JOB_INDUSTRY_TEXT_BOX = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().className("android.widget.EditText").instance(2)')
    JOB_LOCATION_TEXT_BOX = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().className("android.widget.EditText").instance(3)')
    CREATE_JOB_BUTTON = (By.ACCESSIBILITY_ID, 'Create Job')
    JOB_CREATED_MESSAGE = (By.ACCESSIBILITY_ID, 'Job created successfully!')
    CHOSEN_JOB = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().className("android.widget.ImageView").instance(0)')
    ASSERT_JOB_APPLICANTS = (By.ACCESSIBILITY_ID,'Job Applications')
    
    # locaters to test salary filter in job module
    JOB_SEARCH_BAR = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().className("android.widget.EditText")')
    JOB_SEARCH_BAR_TEXT = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().className("android.widget.EditText")')
    FILTER_BY_SLAARY = (By.ACCESSIBILITY_ID, 'Salary')
    SHOW_RESULTS_BUTTON = (By.ACCESSIBILITY_ID, 'Show Results')
    