from appium.webdriver.common.appiumby import AppiumBy as By
class AscendPrivacyAndSecurityLocators:
    # Locators for the Privacy and Security page
   ## To test connections preferences 
   SIDE_BAR_BUTOTN = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().className("android.view.View").instance(6)')
   SETTINGS_BUTTON = (By.ACCESSIBILITY_ID, 'Settings')
   CONNECTIONS_PREFERENCES_BUTTON = (By.ACCESSIBILITY_ID, 'Connection Preferences')
   ALLOW_CONNNECTION_REQUESTS_BUTTON = (By.ACCESSIBILITY_ID, 'Allow connection requests\nOthers can send you connection requests')
   SAVE_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().className("android.widget.Button").instance(1)')
   #######################
   #Report user locaters
   FIRST_USER = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().description("Habiba isDeveloping").instance(0)')
   FIRST_USER2 = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().description("Ascend System").instance(0)')
   MORE_OPTIONS_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().className("android.widget.Button").instance(6)')
   REPORT_BLOCK_BUTOTN = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().description("Report or block")')
   REPORT_BLOCK_MESSAGE = (By.ACCESSIBILITY_ID, 'This feature is not available yet')
   ##
   BLOCKED_USERS_BUTTON = (By.ACCESSIBILITY_ID, 'Blocked Users') #CAN ALSO BE USED FOR 
   UNBLOCK_USER_BUTTON  = (By.ACCESSIBILITY_ID, 'Unblock')
