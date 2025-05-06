from Pages.base_page import BasePage
from Pages.Payment_to_premium.locaters import PremiumPageLocater

class PremiumPage(BasePage):
    
    TRY_PREMIUM_BUTTON = PremiumPageLocater.TRY_PREMIUM_BUTTON
    SKIP_BUTTON = PremiumPageLocater.SKIP_BUTTON
    JOIN_PREMIUM_BUTTON = PremiumPageLocater.JOIN_PREMIUM_BUTTON
    LINK_CARD_BUTTON = PremiumPageLocater.LINK_CARD_BUTTON
    ADDRESS_TEXT_BOX = PremiumPageLocater.ADDRESS_TEXT_BOX
    CITY_TEXT_BOX = PremiumPageLocater.CITY_TEXT_BOX
    POSTAL_CODE_TEXT_BOX = PremiumPageLocater.POSTAL_CODE_TEXT_BOX
    PAY_BUTOTN = PremiumPageLocater.PAY_BUTOTN
    ASSERT_PAYMENT_SUCCESS = PremiumPageLocater.ASSERT_PAYMENT_SUCCESS
    MANAGE_SUBSCRIPTION_BUTTON = PremiumPageLocater.MANAGE_SUBSCRIPTION_BUTTON
    SUBSCRIBTION_DATE = PremiumPageLocater.SUBSCRIBTION_DATE
    CANCEL_SUBSCRIBTION = PremiumPageLocater.CANCEL_SUBSCRIBTION
    CONFIRM_CANCEL_SUBSCRIBTION = PremiumPageLocater.CONFIRM_CANCEL_SUBSCRIBTION
    
    def click_try_premium_button(self):
        self.click(self.TRY_PREMIUM_BUTTON)
    
    def click_skip_button(self):
        self.click(self.SKIP_BUTTON)
    
    def click_join_premium_button(self):
        self.click(self.JOIN_PREMIUM_BUTTON)
    
    def click_link_card_button(self):
        self.click(self.LINK_CARD_BUTTON)
    
    def enter_address(self, address):
        self.send_keys(self.ADDRESS_TEXT_BOX, address)
    
    def enter_city(self, city):
        self.send_keys(self.CITY_TEXT_BOX, city)
    
    def enter_postal_code(self, postal_code):
        self.send_keys(self.POSTAL_CODE_TEXT_BOX, postal_code)
        
    def click_pay_button(self):
        self.click(self.PAY_BUTOTN)
    
    def click_manage_subscription_button(self):
        self.click(self.MANAGE_SUBSCRIPTION_BUTTON)
    
    def click_cancel_subscription(self):
        self.click(self.CANCEL_SUBSCRIBTION)
    
    def click_confirm_cancel_subscription(self):
        self.click(self.CONFIRM_CANCEL_SUBSCRIBTION)
        