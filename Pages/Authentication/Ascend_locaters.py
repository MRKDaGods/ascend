from appium.webdriver.common.appiumby import AppiumBy as By
class AscendLoginLocaters:
    SIGN_IN = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().description("Sign In")')  # Adjust for LinkedIn
    EMAIL_FIELD = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().className("android.widget.EditText").instance(0)')
    PASSWORD_FIELD = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().className("android.widget.EditText").instance(1)')
    SIGN_IN_GOOGLE = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().description("Sign in with Google")')
    SIGN_IN_FACEBOOK = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().description("Sign in with Facebook")')
    CONTINUE_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().description("Continue")')
    FORGOT_PASSWORD = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().description("Forgot password?")')
    REMEMBER_ME = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().className("android.widget.CheckBox")')
    MESSAGE = (By.ID, 'android:id/message')
    WRONG_PASSWORD_OR_EMAIL_MESSAGE = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().className("android.view.View").instance(8)')
    EMAIL_ADDRESS_IS_NOT_VALID = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().description("Invalid email or phone number")')
    EMPTY_PASSWORD = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().description("Password cannot be empty")')
    WELCOME_MESSAGE = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().className("android.view.View").instance(8)')
    JOIN_LINKEDIN = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().description("or  Join Ascend")')
    ALLOW_NOTIFICATIONS = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.android.permissioncontroller:id/permission_allow_button")')
    FORGET_PASSWORD_EMAIL = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().className("android.widget.EditText")')
    NEXT_IN_FORGET_PASSWORD = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().description("Next")')
    VERFICATION_CODE_MESSAGE = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().description("MESSAGE")')

class AscendSignupLocators:
    JOIN_NOW = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().description("Join Now")')
    JOIN_NOW2 = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().description("or  Join Ascend")')
    FIRSTNAME_FIELD = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().className("android.widget.EditText").instance(0)') #5 | 1
    LASTNAME_FIELD = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().className("android.widget.EditText").instance(1)')#6 | 2
    EMAIL_FIELD = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().className("android.widget.EditText")') #1 FROM JOIN | 4
    PASSWORD_FIELD = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().className("android.widget.EditText").instance(1)') # 3 | 6
    CONTINUE_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().description("Continue")') #2 #4 #7 |3 5 7
    INVALID_EMAIL = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().description("Please enter a valid email or phone number")') 
    INVALID_PASSWORD = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().description("Password should be at least 3 characters")')
    SIGN_UP = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().description("Sign Up")')
    EXISTING_EMAIL = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().className("android.view.View").instance(10)')