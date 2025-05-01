from appium.webdriver.common.appiumby import AppiumBy as By 

class MessagesPageLocaters:
    UNREAD_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().text("Unread")')
    BACK_BUTTON = (By.ACCESSIBILITY_ID, 'Back')
    MORE_OPTIONS_BUTTON = (By.ACCESSIBILITY_ID, 'Message overflow menu')
    SEARCH_MESSAGE_BUTTON = (By.ACCESSIBILITY_ID, 'Search messages')
    SEARCH_MESSAGE_TEXT_BOX = (By.ID, 'com.linkedin.android:id/messaging_conversation_search_list_toolbar_edit_text')
    FIRST_SEARCHED_MESSAGE = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.linkedin.android:id/messaging_facepile_image").instance(0)') #com.linkedin.android:id/messaging_facepile_image
    FIRST_MESSAGE_BUTTON = (By.ANDROID_UIAUTOMATOR,'new UiSelector().resourceId("com.linkedin.android:id/messaging_facepile_image").instance(0)')
    SECOUND_MESSAGE_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.linkedin.android:id/messaging_facepile_image").instance(1)')
    NEW_MESSAGE_BUTTON = (By.ACCESSIBILITY_ID, 'Compose a new message')
    NEW_MESSAGE_TEXT_BOX = (By.ID, 'com.linkedin.android:id/msglib_recipient_input')
    CHOSEN_NEW_MESSAGE = (By.ANDROID_UIAUTOMATOR,'new UiSelector().resourceId("com.linkedin.android:id/messaging_facepile_image").instance(0)')
    
    
class ChatPageLocaters:
    MESSAGE_TEXT_BOX = (By.ID, 'com.linkedin.android:id/messaging_keyboard_text_input_container')
    ADD_FILES = (By.ID, 'com.linkedin.android:id/keyboard_plus_button')
    DOCUMENT_UPLOAD = (By.ACCESSIBILITY_ID, 'Document')
    MEDIA_UPLOAD = (By.ACCESSIBILITY_ID, 'Media')
    SEND_BUTTON  = (By.ACCESSIBILITY_ID, 'Send')
    CHAT_MORE_OPTIONS = (By.ACCESSIBILITY_ID, 'More Options')
    STAR_CHAT = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.linkedin.android:id/bottom_sheet_container").instance(2)')
    MUTE_CHAT = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.linkedin.android:id/bottom_sheet_container").instance(3)')
    BLOCK_CHAT = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.linkedin.android:id/bottom_sheet_container").instance(5)')
    DELETE_CHAT = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.linkedin.android:id/bottom_sheet_container").instance(6)')
    POPUP_NOTIFICATIONS_AFTER_SEND = (By.ID, 'com.linkedin.android:id/push_re_enable_bottomsheet_neg_btn')
    VALID_IMAGE = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.google.android.documentsui:id/icon_thumb").instance(2)')
    CORRUPTED_IMAGE = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.google.android.documentsui:id/icon_thumb").instance(1)')
    DOCUMENT = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.google.android.documentsui:id/icon_thumb").instance(0)')
    NEXT_BUTTON = (By.ID, 'com.linkedin.android:id/media_editor_next_button')
    MESSAGE = (By.ID, 'com.linkedin.android:id/messaging_toolbar_title')
    UNSEEN_COUNT = (By.ID, 'com.linkedin.android:id/messaging_conversation_list_item_container')
    
    
    