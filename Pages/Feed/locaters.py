from appium.webdriver.common.appiumby import AppiumBy as By

class HomeLocators:
    SIDEBAR_BUTTON = (By.ACCESSIBILITY_ID, 'My Profile and Communities')
    WELCOME_MESSAGE = (By.ID, 'com.linkedin.android:id/summary_header')
    CLOSE_BUTTON = (By.ACCESSIBILITY_ID, 'Close')
    SEARCH_BAR = (By.ID, 'com.linkedin.android:id/search_bar') 
    SEARCH_BAR_SEND_TEXT = (By.ID, 'com.linkedin.android:id/search_bar_edit_text')
    MESSAGING_BUTTON =  (By.ACCESSIBILITY_ID, 'messaging')
    VIEW_THE_FULL_POST = (By.ID, 'com.linkedin.android:id/feed_render_item_text') #to click on post to view all engagments 
    REACTIONS_COUNT = (By.ID , 'com.linkedin.android:id/feed_conversations_reactions_count')
    LIKE_BUTTON = (By.ACCESSIBILITY_ID, 'Like') 
    #ADD LOVE , CLELEBRATE , INSIGHTFUL , CURIOUS , SUPPORTIVE , FUNNY , INTERESTED BUTTONS
    COMMENT_BUTTON = (By.ACCESSIBILITY_ID, 'Comment')
    SHARE_BUTTON = (By.ACCESSIBILITY_ID, 'Send')
    VIEW_PROFILE_FROM_POST_BUTTON = (By.ID, 'com.linkedin.android:id/feed_actor_image')
    POST_OPTIONS = (By.ACCESSIBILITY_ID, 'Post options')
    SAVE_POST_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.linkedin.android:id/feed_control_panel_container").instance(0)')
    SHARE_VIA_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.linkedin.android:id/feed_control_panel_container").instance(1)')
    REPORT_POST_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.linkedin.android:id/feed_control_panel_container").instance(4)')
    WRITE_POST = (By.ID , 'com.linkedin.android:id/share_compose_text_input_entities')
    ADD_PHOTO_TO_POST = (By.ACCESSIBILITY_ID, 'Photo')
    MORE_BUTTON = (By.ACCESSIBILITY_ID, 'More')
    ADD_EVENT_TO_POST = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.linkedin.android:id/detour_icon").instance(1)')
    ADD_JOB_TO_POST = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.linkedin.android:id/detour_icon").instance(3)')
    ADD_DOCUMENT_TO_POST = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.linkedin.android:id/detour_icon").instance(5)')
    POST_BUTTON = (By.ID , 'com.linkedin.android:id/share_compose_post_button')
    