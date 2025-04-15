from appium.webdriver.common.appiumby import AppiumBy as By  # Import AppiumBy
 

class MyNetworkPageLocaters:
    """ Page Object for My Network """
    
    # SEARCH_BAR_BUTTON = (By.ID, 'com.linkedin.android:id/search_open_bar_box')
    # SEARCH_BAR_SEND_TEXT = (By.ID, 'com.linkedin.android:id/search_bar_edit_text')
    GROW_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.linkedin.android:id/mynetwork_pager_tab_custom_view").instance(0)')  
    CATCH_UP_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().text("Catch up")')
    INVITATIONS_BUTTON = (By.ACCESSIBILITY_ID, 'Invitations (0)')
    MANAGE_MY_NETWORK_BUTTON = (By.ID, 'com.linkedin.android:id/mynetwork_my_communities_entry_point_text')
    FIRST_CONNECT_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.linkedin.android:id/mynetwork_entity_action_text").instance(0)')
    FIRST_PROFILE_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.linkedin.android:id/mynetwork_entity_image").instance(0)')
    FIRST_FOLLOW_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.linkedin.android:id/mynetwork_full_width_large_cover_photo_card_action_button").instance(0)')
    ACCEPT_CONNECTION_BUTTON = (By.ACCESSIBILITY_ID, 'Accept invitation')
    DECLINE_CONNECTION_BUTTON = (By.ACCESSIBILITY_ID, 'Dismiss invitation')
    PERSON_IS_NOW_CONNECTION_MESSAGE = (By.ID, 'com.linkedin.android:id/infra_grid_image1')
    
    
    
class OthersProfilePageLocaters:
    CONNECT_BUTTON = (By.ACCESSIBILITY_ID, 'Connect')
    MESSAGE_BUTTON = (By.ACCESSIBILITY_ID, 'Message')
    MORE_OPTIONS_BUTTON = (By.ACCESSIBILITY_ID, 'More options')
    FOLLOW_BUTTON0 = (By.ACCESSIBILITY_ID, 'Follow')
    FOLLOW_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.linkedin.android:id/bottom_sheet_container").instance(3)')
    CONNECT_BUTTON1 = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.linkedin.android:id/bottom_sheet_container").instance(3)')
    BLOCK_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.linkedin.android:id/bottom_sheet_container").instance(5)')
    CONFIRM_BLOCK_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.linkedin.android:id/compact_plain_action_card_container").instance(0)')
    CONFIRM_AGAIN_BLOCK_BUTTON = (By.ID,'com.linkedin.android:id/reporting_button_action_component_button')
    BLOCKED_MESSAGE = (By.ID,'com.linkedin.android:id/reporting_step_component_title')
    SHARE_PROFILE_BUTTON = (By.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId("com.linkedin.android:id/bottom_sheet_container").instance(1)')
    SHOW_ALL_POSTS_BUTTON = (By.ID, 'com.linkedin.android:id/profile_content_collections_component_show_all_activity_button')
    SHOW_ALL_CERTIFICATIONS = (By.ID, 'com.linkedin.android:id/profile_action_component_rectangular_full_button')
    INVITATION_SENT_MESSAGE = (By.ACCESSIBILITY_ID,'Invitation sent')
    FOLLOW_MESSAGE = (By.ACCESSIBILITY_ID,'Following')
    UNFOLLOW_BUTTON = (By.ID,'com.linkedin.android:id/invitations_unfollow_friction_confirm_button')
    FOLLOWING_BUTTON = (By.ID,'com.linkedin.android:id/profile_top_card_profile_picture_v2')
    