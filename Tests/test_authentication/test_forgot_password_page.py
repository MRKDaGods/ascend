# from Pages.signup_page import SignupPage
# from Pages.Authentication.landing_page import LandingPage
# from Pages.Authentication.login_page import LoginPage
# from Pages.Authentication.forgot_password import ForgotPassword
# from logger import logger
# import time
# def test_forgot_password(appium_driver):
#     """ Test Login Functionality """
#     logger.info("Testing Forgot Password")
#     landing_page = LandingPage(appium_driver)
#     login_page = LoginPage(appium_driver) 
#     forgot_password = ForgotPassword(appium_driver)
#     logger.info("pressing join now in landing page")
#     landing_page.click_sign_in_with_email()
#     login_page.click_forgot_password()
#     EMAIL = '123@mail.com'
#     forgot_password.enter_email(EMAIL)
#     # forgot_password.click_next() #commented untill find solution to bypass security check
#     # # time.sleep(20)
#     # #how to bypass security check
#     # VERFICATION_CODE = '123456'
#     # forgot_password.enter_verification_code(VERFICATION_CODE)
#     # appium_driver.hide_keyboard()
#     # forgot_password.click_submit()
#     time.sleep(5)
    
    
#     time.sleep(5)

#     # # Verify Signup success
#     # assert "Continue" in signup_page.get_text(signup_page.CONTINUE_BUTTON), "signup failed!"
