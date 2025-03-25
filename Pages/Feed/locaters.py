from appium.webdriver.common.appiumby import AppiumBy as By

class HomeLocators:
    SIDEBAR_BUTTON = (By.ACCESSIBILITY_ID, 'My Profile and Communities')
    WELCOME_MESSAGE = (By.ID, 'com.linkedin.android:id/summary_header')
    CLOSE_BUTTON = (By.ACCESSIBILITY_ID, 'Close')
    SEARCH_BAR = (By.ID, 'com.linkedin.android:id/search_bar_text') 