from appium.webdriver.common.appiumby import AppiumBy as By  # Import AppiumBy
from Pages.base_page import BasePage  # Import BasePage
from Pages.Profile.locaters import CoverPhotoLocaters  # Import LoginLocators

class CoverPhotoPage(BasePage):
    """ Page Object for Login Page """
    UPLOAD_PHOTO_BUTTON = CoverPhotoLocaters.UPLOAD_PHOTO_BUTTON
    CLOSE_BUTTON = CoverPhotoLocaters.CLOSE_BUTTON
    SAVE_BUTTON = CoverPhotoLocaters.SAVE_BUTTON
    TAKE_PHOTO_BUTTON = CoverPhotoLocaters.TAKE_PHOTO_BUTTON
    UPLOAD_FROM_GALLERY_BUTTON = CoverPhotoLocaters.UPLOAD_FROM_GALLERY_BUTTON
    VALID_COVER_PHOTO = CoverPhotoLocaters.VALID_COVER_PHOTO
    INVALID_COVER_PHOTO = CoverPhotoLocaters.INVALID_COVER_PHOTO
    DONE_BUTTON = CoverPhotoLocaters.DONE_BUTTON
    UPDATE_PHOTO_BUTTON = CoverPhotoLocaters.UPDATE_PHOTO_BUTTON
    SUMBISSION_FAILED_MESSAGE = CoverPhotoLocaters.SUMBISSION_FAILED_MESSAGE
    
    

    def click_upload_photo(self):
        self.click(self.UPLOAD_PHOTO_BUTTON)
    
    def click_close(self):
        self.click(self.CLOSE_BUTTON)
    
    def click_save(self):
        self.click(self.SAVE_BUTTON)
    
    def click_take_photo(self):
        self.click(self.TAKE_PHOTO_BUTTON)
    
    def click_upload_from_gallery(self):
        self.click(self.UPLOAD_FROM_GALLERY_BUTTON)
    
    def click_close_photo_bar(self):
        self.click(self.CLOSE_PHOTO)
    
    def click_valid_cover_photo(self):
        self.click(self.VALID_COVER_PHOTO)
    
    def click_invalid_cover_photo(self):
        self.click(self.INVALID_COVER_PHOTO)
    
    def click_done(self):
        self.click(self.DONE_BUTTON)
    
    def click_update_photo(self):
        self.click(self.UPDATE_PHOTO_BUTTON)

    def get_message(self, message):
        return self.get_text(message)
    