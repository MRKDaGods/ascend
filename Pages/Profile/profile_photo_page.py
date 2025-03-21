from appium.webdriver.common.appiumby import AppiumBy as By  # Import AppiumBy
from Pages.base_page import BasePage  # Import BasePage
from Pages.Profile.locaters import ProfilePhotoPageLocaters  # Import LoginLocators

class ProfilePhotoPage(BasePage):
    """ Page Object for Login Page """
    ADD_PROFILE_PHOTO_BUTTON = ProfilePhotoPageLocaters.ADD_PROFILE_PHOTO_BUTTON
    ADD_FRAME_BUTTON = ProfilePhotoPageLocaters.ADD_FRAME_BUTTON
    CLOSE_PROFILE_PHOTO_BAR_BUTTON = ProfilePhotoPageLocaters.CLOSE_PROFILE_PHOTO_BAR_BUTTON
    VIEW_OR_EDIT_PROFILE_PHOTO_BUTTON = ProfilePhotoPageLocaters.VIEW_OR_EDIT_PROFILE_PHOTO_BUTTON
    UPDATE_PROFILE_PHOTO_BUTTON = ProfilePhotoPageLocaters.UPDATE_PROFILE_PHOTO_BUTTON
    UPLOAD_FROM_PHOTOS_BUTTON = ProfilePhotoPageLocaters.UPLOAD_FROM_PHOTOS_BUTTON
    VAILD_PROFILE_PHOTO = ProfilePhotoPageLocaters.VAILD_PROFILE_PHOTO
    INVALID_PROFILE_PHOTO = ProfilePhotoPageLocaters.INVALID_PROFILE_PHOTO
    VALID_COVER_PHOTO = ProfilePhotoPageLocaters.VALID_COVER_PHOTO
    INVALID_COVER_PHOTO = ProfilePhotoPageLocaters.INVALID_COVER_PHOTO
    SAVE_BUTTON = ProfilePhotoPageLocaters.SAVE_BUTTON
    CLOSE_BUTTON = ProfilePhotoPageLocaters.CLOSE_BUTTON
    
    
    
    
    def click_add_profile_photo(self):
        self.click(self.ADD_PROFILE_PHOTO_BUTTON)
    
    def click_add_frame(self):
        self.click(self.ADD_FRAME_BUTTON)
    
    def click_close_profile_photo_bar(self):
        self.click(self.CLOSE_PROFILE_PHOTO_BAR_BUTTON)
    
    def click_view_or_edit_profile_photo(self):
        self.click(self.VIEW_OR_EDIT_PROFILE_PHOTO_BUTTON)
    
    def click_update_profile_photo(self):
        self.click(self.UPDATE_PROFILE_PHOTO_BUTTON)
    
    def click_upload_from_photos_button(self):
        self.click(self.UPLOAD_FROM_PHOTOS_BUTTON)
    
    def click_valid_profile_photo(self):
        self.click(self.VAILD_PROFILE_PHOTO)
    
    def click_invalid_profile_photo(self):
        self.click(self.INVALID_PROFILE_PHOTO)
    
    def click_valid_cover_photo(self):
        self.click(self.VALID_COVER_PHOTO)
    
    def click_invalid_cover_photo(self):
        self.click(self.INVALID_COVER_PHOTO)
    
    def click_save(self):
        self.click(self.SAVE_BUTTON)
    
    def click_close(self):
        self.click(self.CLOSE_BUTTON)
    
    
    
    
    def get_message(self,message):
        return self.get_text(message)
    