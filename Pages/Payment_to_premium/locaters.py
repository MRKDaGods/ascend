from appium.webdriver.common.appiumby import AppiumBy as By 

class PremiumPageLocater:
    TRY_PREMIUM_BUTTON = (By.ACCESSIBILITY_ID, 'Try Premium for EGP 0')
    SKIP_BUTTON = (By.ACCESSIBILITY_ID, 'Skip')
    JOIN_PREMIUM_BUTTON = (By.ACCESSIBILITY_ID, 'Join Premium')
    LINK_CARD_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().className("android.view.View").instance(19)')
    ADDRESS_TEXT_BOX = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().className("android.widget.EditText").instance(1)')
    CITY_TEXT_BOX = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().className("android.widget.EditText").instance(3)')
    POSTAL_CODE_TEXT_BOX = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().className("android.widget.EditText").instance(4)')
    PAY_BUTOTN = (By.ANDROID_UIAUTOMATOR,'new UiSelector().text("Pay EGP 100.00")')
    ASSERT_PAYMENT_SUCCESS = (By.ACCESSIBILITY_ID, 'header-title')
    MANAGE_SUBSCRIPTION_BUTTON = (By.ACCESSIBILITY_ID, 'Manage Subscription')
    SUBSCRIBTION_DATE = (By.ACCESSIBILITY_ID, '2023-10-01')
    CANCEL_SUBSCRIBTION = (By.ACCESSIBILITY_ID, 'Cancel Subscription')
    CONFIRM_CANCEL_SUBSCRIBTION = (By.ACCESSIBILITY_ID, 'Yes')
    
    