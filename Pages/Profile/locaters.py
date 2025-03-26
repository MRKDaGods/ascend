from appium.webdriver.common.appiumby import AppiumBy as By

class ProfiePageLocaters:
    EDIT_PROFILE_BUTTON = (By.ACCESSIBILITY_ID, 'Edit basic profile information')
    EDIT_COVER_IMAGE = (By.ID, 'com.linkedin.android:id/profile_top_card_default_background_image_camera_view')
    SETTINGS_BUTTON = (By.ACCESSIBILITY_ID, 'Settings menu button')
    BACK_BUTTON = (By.ACCESSIBILITY_ID, 'Back')
    SEARCH_BAR = (By.ID, 'com.linkedin.android:id/search_bar_text_view')
    EDIT_PROFILE_IMAGE =  (By.ID, 'com.linkedin.android:id/profile_top_card_profile_picture_v2')#(By.ANDROID_UIAUTOMATOR, 'new UiSelector().className("android.widget.ImageButton").instance(2)')
    MORE_OPTIONS_BUTTON = (By.ACCESSIBILITY_ID, 'More options')
    ADD_SECTION_BUTTON = (By.ACCESSIBILITY_ID, 'More options')
    OPEN_TO_WORK_BUTTON = (By.ID, 'com.linkedin.android:id/profile_top_card_primary_cta_v2')
    ENHANCE_PROFILE_BUTTON = (By.ID, 'com.linkedin.android:id/profile_custom_action_entry_point_button')
    ADD_INDUSTRY_BUTTON = (By.ID, 'com.linkedin.android:id/profile_action_component_rectangular_wrap_button')
    SHOW_ALL_ANALYTICS_BUTTON = (By.ID, 'com.linkedin.android:id/profile_action_component_rectangular_full_button')
    ADD_EXPERIENCE_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().text("Add experience")')
    ADD_EXPERIENCE_BUTTON_2 = (By.ACCESSIBILITY_ID, 'Add new experience')    
    ADD_POSTION_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().text("Add position")')
    ADD_NEW_EDUCATION_BUTTON= (By.ACCESSIBILITY_ID, 'Add new education')
    ADD_EDUCATION_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().text("Add education")')
    # EDIT EDUCATION IS FOR EACH ELMENT AND THE ID IS SET AUTOMATICALLY 
    ADD_SKILLS_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().text("Add skills")')
    ADD_SKILLS_BUTTON_2 = (By.ACCESSIBILITY_ID, 'Add new skill')
    NAME = (By.ID, 'com.linkedin.android:id/profile_top_card_name_section')
    HEADLINE = (By.ID, 'com.linkedin.android:id/profile_top_card_headline')
    LOCATION = (By.ID, 'com.linkedin.android:id/profile_top_card_location')
    EXPERIENCE_MESSAGE = (By.ACCESSIBILITY_ID, 'Experience')

class EditProfilePageLocaters:
    FIRST_NAME = (By.XPATH, '//android.widget.EditText[@resource-id="com.linkedin.android:id/form_edit_text_dash" and contains(@text, "Ta")]') # DYNAMIC LOCATER
    LAST_NAME = (By.XPATH, '//android.widget.EditText[@resource-id="com.linkedin.android:id/form_edit_text_dash" and contains(@text, "m")]') # DYNAMIC LOCATER
    ADDITIONAL_NAME = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.linkedin.android:id/form_edit_text_dash").instance(2)') 
    HEADLINE = (By.ID, 'com.linkedin.android:id/form_gai_edit_text')
    INDUSTRY = (By.ID, 'com.linkedin.android:id/form_edit_text_dash')
    SCHOOL = (By.ID, 'com.linkedin.android:id/form_bottomsheet_input')
    ADD_NEW_EDUCATION_BUTTON = (By.ACCESSIBILITY_ID, 'Add new education')
    LOCATION = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().text("Egypt")') # DYNAMIC LOCATER
    CITY = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().text("Giza, Al Jizah")') # DYNAMIC LOCATER
    SAVE_BUTTON = (By.ACCESSIBILITY_ID, 'Save')
    FIRST_NAME_AFTER_CLICK = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.linkedin.android:id/form_edit_text_dash").instance(0)')
    LAST_NAME_AFTER_CLICK = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.linkedin.android:id/form_edit_text_dash").instance(1)')
    DISMISS_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().description("Dismiss")')
    DISCARD_CHANGES_BUTTON = (By.ID, 'android:id/button1')
    NAME_ERROR_MESSAGE_1 = (By.XPATH, '(//android.widget.TextView[@resource-id="com.linkedin.android:id/textinput_error"])[1]') 
    NAME_ERROR_MESSAGE_2 = (By.XPATH, '(//android.widget.TextView[@resource-id="com.linkedin.android:id/textinput_error"])[2]')
    # EDIT CONTACT INFO , WEBSITE, SHOW SCHOOL INFO CHECKBOX    

class CoverPhotoLocaters:
    UPLOAD_PHOTO_BUTTON = (By.ACCESSIBILITY_ID, 'Upload background image')
    CLOSE_BUTTON = (By.ACCESSIBILITY_ID, 'Close')
    SAVE_BUTTON = (By.ID, 'com.linkedin.android:id/profile_background_image_upload_show_your_support_save_button')
    TAKE_PHOTO_BUTTON = (By.ID, 'com.linkedin.android:id/profile_picture_select_bottom_sheet_take_a_photo')
    UPLOAD_FROM_GALLERY_BUTTON = (By.ID, 'com.linkedin.android:id/profile_picture_select_bottom_sheet_upload_from_photos_layout')
    CLOSE_PHOTO_BAR_BUTTON = (By.ACCESSIBILITY_ID, 'Bottom Sheet Control Bar, Double Tap to Dismiss')
    VALID_COVER_PHOTO = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.google.android.providers.media.module:id/icon_thumbnail").instance(1)')
    INVALID_COVER_PHOTO = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.google.android.providers.media.module:id/icon_thumbnail").instance(0)')
    DONE_BUTTON = (By.ID, 'com.linkedin.android:id/done_button')
    UPDATE_PHOTO_BUTTON = (By.ID, 'com.linkedin.android:id/profile_image_viewer_add_photo_button')
    SUMBISSION_FAILED_MESSAGE = (By.ID, 'com.linkedin.android:id/alertTitle')
    
    

class ProfilePhotoPageLocaters:
    ADD_PROFILE_PHOTO_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.linkedin.android:id/bottom_sheet_container").instance(0)')
    ADD_FRAME_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.linkedin.android:id/bottom_sheet_container").instance(1)')
    CLOSE_PROFILE_PHOTO_BAR_BUTTON = (By.ACCESSIBILITY_ID, 'Bottom Sheet Control Bar, Double Tap to Dismiss')
    VIEW_OR_EDIT_PROFILE_PHOTO_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().text("View or edit profile photo")')
    UPDATE_PROFILE_PHOTO_BUTTON = (By.ID, 'com.linkedin.android:id/profile_image_viewer_add_photo_button')
    UPLOAD_FROM_PHOTOS_BUTTON = (By.ID, 'com.linkedin.android:id/profile_picture_select_bottom_sheet_upload_from_photos_layout')
    VAILD_PROFILE_PHOTO = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.google.android.providers.media.module:id/icon_thumbnail").instance(3)')
    INVALID_PROFILE_PHOTO = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.google.android.providers.media.module:id/icon_thumbnail").instance(2)')
    VALID_COVER_PHOTO = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.google.android.providers.media.module:id/icon_thumbnail").instance(1)')
    INVALID_COVER_PHOTO = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.google.android.providers.media.module:id/icon_thumbnail").instance(0)')
    SAVE_BUTTON = (By.ID, 'com.linkedin.android:id/menu_action')
    CLOSE_BUTTON = (By.ACCESSIBILITY_ID, 'Close')

class MoreOptionsPageLocaters:
    SHARE_PROFILE_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().text("Share profile via…")')
    CONTACT_INFO_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.linkedin.android:id/bottom_sheet_container").instance(2)')
    PERSONAL_DEMOGRAPHIC_INFO_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.linkedin.android:id/bottom_sheet_container").instance(3)')
    ACTIVITY_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.linkedin.android:id/bottom_sheet_container").instance(4)')
    MY_ITEMS_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.linkedin.android:id/bottom_sheet_container").instance(5)')
    ABOUT_PROFILE_BUTTON =  (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.linkedin.android:id/bottom_sheet_container").instance(6)')
    BACK_BUTTON = (By.ACCESSIBILITY_ID, 'Bottom Sheet Control Bar, Double Tap to Dismiss')

class WorkExperiencePageLocaters:
    TITLE_TEXT_BOX = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().text("Ex: Retail Sales Manager")') #DYNAMOC LOCATER
    TITLE_TEXT_BOX_AFTER_CLICK = (By.ID, 'com.linkedin.android:id/typeahead_selected_item_view')
    EMPLOYMENT_TYPE_DROPDOWN = (By.ID, 'com.linkedin.android:id/form_picker_on_new_screen_input')
    EMPLOYMENT_TYPE_FULL_TIME_RADIO_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().text("Full-time")')
    EMPLOYMENT_TYPE_PART_TIME_RADIO_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().text("Part-time")')
    EMPLOYMENT_TYPE_INTERNSHIP_RADIO_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().text("Internship")')
    COMPANY_NAME_TEXT_BOX = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().text("Ex: Microsoft")') #DYNAMOC LOCATER
    COMPANY_NAME_TEXT_BOX_AFTER_CLICK = (By.ID, 'com.linkedin.android:id/typeahead_selected_item_view')
    CURRENTLY_WORKING_CHECKBOX = (By.ID, 'com.linkedin.android:id/checkbox_form_element')
    START_DATE = (By.ID, 'com.linkedin.android:id/form_edit_start_date_field_dash')
    END_DATE = (By.ID, 'com.linkedin.android:id/form_edit_end_date_field_dash')
    LOCATION_TEXT_BOX = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().text("Ex: London, United Kingdom")')
    LOCATION_TEXT_BOX_AFTER_CLICK = (By.ID, 'com.linkedin.android:id/typeahead_selected_item_view')
    LOCATION_TYPE_DROPDOWN = (By.ID, 'com.linkedin.android:id/form_bottomsheet_input')
    LOCATION_TYPE_ONSITE_RADIO_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().text("Onsite")')
    LOCATION_TYPE_REMOTE_RADIO_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().text("Remote")')
    LOCATION_TYPE_HYPRID_RADIO_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().text("Hybrid")')
    DESCRIPTION_TEXT_BOX = (By.ID, 'com.linkedin.android:id/form_gai_edit_text')
    PROFILE_HEADLINE_TEXT_BOX = (By.ID, 'com.linkedin.android:id/form_edit_text_dash') #DYNAMIC LOCATER
    WHERE_DID_YOU_FIND_THIS_JOB_DROPDOWN = (By.ID, 'com.linkedin.android:id/form_picker_on_new_screen_input')
    ADD_SKILLS_BUTTON = (By.ID, 'com.linkedin.android:id/forms_reorderable_add_selectable_option')
    ADD_MEDIA_BUTTON = (By.ID, 'com.linkedin.android:id/profile_edit_treasury_add_cta')
    ADD_LINK_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.linkedin.android:id/bottom_sheet_container").instance(0)')
    ADD_PHOTO_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().text("Upload a photo")')
    SAVE_BUTTON = (By.ID, 'com.linkedin.android:id/profile_edit_form_page_save_button_sticky')
    START_MONTH = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().text("April")')
    START_YEAR = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().text("2024")')
    END_MONTH = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().text("March")')
    END_YEAR = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().text("2025")')
    SET_DATE_BUTTON  = (By.ID, 'android:id/button1')
    CLOSE_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().description("Dismiss")')
    #LOCATION TITLE COMPANY
    #ADD SKILLS 
    # DATE IS NOT IMPMENTED WAITNG FOR THE DEVELOPERS
    
    
class AddEditEducationPageLocaters:
    SCHOOL_TEXT_BOX = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().text("Ex: Boston University")')
    DEGREE_TEXT_BOX = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().text("Ex: Bachelor’s")')
    FIELD_OF_STUDY_TEXT_BOX = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().text("Ex: Business")')
    START_DATE = (By.ID, 'com.linkedin.android:id/form_edit_start_date_field_dash')
    END_DATE = (By.ID, 'com.linkedin.android:id/form_edit_end_date_field_dash')
    GRADE_TEXT_BOX = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.linkedin.android:id/form_edit_text_dash").instance(0)')
    ACTIVITIES_TEXT_BOX = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().text("Ex: Alpha Phi Omega, Marching Band, Volleyball")')
    DESCRIPTION_TEXT_BOX = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.linkedin.android:id/form_edit_text_dash").instance(2)')
    ADD_SKILLS_BUTTON = (By.ID, 'com.linkedin.android:id/forms_reorderable_add_selectable_option')
    ADD_MEDIA_BUTTON = (By.ID, 'com.linkedin.android:id/profile_edit_treasury_add_cta')
    SAVE_BUTTON = (By.ID, 'com.linkedin.android:id/profile_edit_form_page_save_button_sticky')
    ##error most xpaths are not working correctly try to fix it 

class SkillsPageLocaters:
    SKILL_TEXT_BOX = (By.ID, 'com.linkedin.android:id/form_edit_text_dash')
    SKILL_TEXT_BOX_AFTER_CLICK = (By.ID, 'com.linkedin.android:id/typeahead_selected_item_view')
    CLEAR_SKILL_BUTTON = (By.ID, 'com.linkedin.android:id/text_input_end_icon')
    CHECKBOX_IS_SKILL_FROM_EDUCATION = (By.ID, "com.linkedin.android:id/checkbox_form_element") # TEST THIS ID (RESOURCE ID DYNAMIC)
    CHECKBOX_FOLLOW_THIS_SKILL = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().text("Follow this skill to keep up with relevant content.")')
    SAVE_BUTTON = (By.ID, 'com.linkedin.android:id/profile_edit_form_page_save_button_sticky')
    ADD_MORE_SKILLS_BUTTON = (By.ID, 'com.linkedin.android:id/profile_form_page_primary_button')
    NO_THANKS_BUTTON = (By.ID, 'com.linkedin.android:id/profile_form_page_secondary_button')
    EDIT_SKILL_BUTTTON = (By.ID,'com.linkedin.android:id/profile_action_component_circular_button')
    DELETE_SKILL_BUTTON = (By.ID, 'com.linkedin.android:id/profile_edit_form_page_delete_button_inline')
    BACK_BUTTON = (By.ACCESSIBILITY_ID, 'Back')
    ENTERED_SKILL_BUTTON = (By.XPATH, '//android.widget.TextView[@resource-id="com.linkedin.android:id/typeahead_text" and @text="Python (Programming Language)"]')
    

class PrivacySettingsPageLocaters:
    DARK_MODE_PAGE = (By.ID, 'darkModeAndroid')
    DARK_MODE_BUTTON = (By.ID, 'com.linkedin.android:id/settings_dark_mode')
    LIGHT_MODE_BUTTON = (By.ID, 'com.linkedin.android:id/settings_light_mode')
    SHOWING_PROFILE_PHOTOS_PAGE = (By.ID, 'showProfilePhotos')
    #NO AVAILABLE IDS FOR SHOWIMG PROFILE PHOTOS RADIO BUTTONS
    PEOPLE_YOU_UNFOLLOWED_PAGE = (By.ID, 'unfollowed')
    CLOSE_ACCOUNT_BUTTON = (By.ID, 'closeAccounts')    
    
    