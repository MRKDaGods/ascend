from appium.webdriver.common.appiumby import AppiumBy as By
#LEFT FROM JOIN RIGHT FROM LANDING 
class SignupLocators:
    FIRSTNAME_FIELD = (By.ID, 'com.linkedin.android:id/growth_join_split_form_first_name') #5 | 1
    LASTNAME_FIELD = (By.ID, 'com.linkedin.android:id/growth_join_split_form_last_name')#6 | 2
    EMAIL_FIELD = (By.ID, 'com.linkedin.android:id/growth_join_split_form_email_address') #1 FROM JOIN | 4
    PASSWORD_FIELD = (By.ID, 'com.linkedin.android:id/growth_join_split_form_password') # 3 | 6
    CONTINUE_BUTTON = (By.ID, 'com.linkedin.android:id/growth_join_split_form_join_button') #2 #4 #7 |3 5 7
    INVALID_EMAIL = (By.ID, 'com.linkedin.android:id/textinput_error') 
    INVALID_PASSWORD = (By.ID, 'com.linkedin.android:id/textinput_error')
    EXISTING_EMAIL = (By.ID, 'com.linkedin.android:id/textinput_error')
class LandingLocators:
    AGREE_JOIN_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.linkedin.android:id/growth_prereg_fragment_join_button")')
    CONTINUE_WITH_GOOGLE = (By.ID, 'com.linkedin.android:id/growth_prereg_fragment_join_with_google_button')
    SIGN_IN_WITH_EMAIL = (By.ID, 'com.linkedin.android:id/growth_prereg_fragment_login_button') # com.linkedin.android:id/growth_prereg_fragment_login_button
    SIGN_IN_WITH_EMAIL2 = (By.ID,'com.linkedin.android:id/growth_prereg_fragment_signin_button')
    JOIN_A_TRUSTED_COMMUNITY_MESSAGE = (By.ID, 'com.linkedin.android:id/growth_prereg_logo_text')

class LoginLocators:
    EMAIL_FIELD = (By.ID, 'com.linkedin.android:id/growth_login_join_fragment_email_address')
    PASSWORD_FIELD = (By.ID, 'com.linkedin.android:id/growth_login_join_fragment_password')
    SIGN_IN_GOOGLE = (By.ID, 'com.linkedin.android:id/growth_login_fragment_sign_in_with_google_button')
    GOOGLE_MAIL = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().className("android.widget.TextView").instance(4)')
    GOOGLE_PASSWORD = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().className("android.widget.EditText")')
    GOOGLE_NEXT_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().text("Next")')
    SIGN_IN_FACEBOOK = (By.ID, 'com.linkedin.android:id/growth_login_fragment_sign_in_with_facebook_button')
    CONTINUE_BUTTON = (By.ID, 'com.linkedin.android:id/growth_login_fragment_sign_in')
    FORGOT_PASSWORD = (By.ID, 'com.linkedin.android:id/growth_login_fragment_forgot_password')
    REMEMBER_ME = (By.ID, 'com.linkedin.android:id/growth_login_fragment_remember_me_check_box')
    MESSAGE = (By.ID, 'android:id/message')
    WRONG_PASSWORD_OR_EMAIL_MESSAGE = (By.ID, 'android:id/message')
    EMAIL_ADDRESS_IS_NOT_VALID = (By.ID, 'com.linkedin.android:id/textinput_error')
    EMPTY_PASSWORD = (By.ID, 'com.linkedin.android:id/textinput_error')
    WELCOME_MESSAGE = (By.ID, 'com.linkedin.android:id/summary_header')
    JOIN_LINKEDIN = (By.ID, 'com.linkedin.android:id/growth_login_fragment_join_button')
    
class ForgotpassLocaters:
    EMAIL_FIELD = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("username")')
    NEXT_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("reset-password-submit-button")')
    VERFICATOIN_CODE = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("input__email_verification_pin")')
    RESEND_CODE = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("btn-resend-pin")')
    SUBMIT_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("pin-submit-button")')
    CHANGE_MAIL = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().text("Change")')
  