from appium.webdriver.common.appiumby import AppiumBy as By

class NotificationsPageLocater:
    FILTER_BY_ALL = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().className("android.widget.FrameLayout").instance(8)')
    FILTER_BY_JOBS = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().className("android.widget.FrameLayout").instance(10)')
    FILTER_BY_MY_POSTS = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().className("android.widget.FrameLayout").instance(12)')
    FILTER_BY_MENTIONS = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().className("android.widget.FrameLayout").instance(14)')
    FIRST_NOTIFICATION = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.linkedin.android:id/infra_grid_image1").instance(0)')
    SECOND_NOTIFICATION = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.linkedin.android:id/infra_grid_image1").instance(1)')
    THIRD_NOTIFICATION = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.linkedin.android:id/infra_grid_image1").instance(2)')
    FIRST_NOTIFICATION_SETTENGS = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.linkedin.android:id/notifications_card_item_swipe_layout").instance(0)')
    SECOND_NOTIFICATION_SETTENGS = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.linkedin.android:id/notifications_card_item_swipe_layout").instance(1)')
    THIRD_NOTIFICATION_SETTENGS = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.linkedin.android:id/notifications_card_item_swipe_layout").instance(2)')
    DELETE_NOTIFICATION = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().text("Delete notification")')
    BACK_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().description("Back")')
    NOTIFICATION_DELETED_MESSAGE = (By.ID, 'com.linkedin.android:id/ad_banner_action_container')
    NOTIFICATION_OPTIONS = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.linkedin.android:id/notifications_card_item_swipe_layout").instance(1)')
    NO_NEW_JOBS_POSTS_MENTIONS_MESSAGE = (By.ID, 'com.linkedin.android:id/notif_empty_card_expanded_headline')
    UNSEEN_NOTIFICATION_COUNT = (By.ID, 'com.linkedin.android:id/slim_notification_badge_determinate_text_view_next') #NOT TESTED YET