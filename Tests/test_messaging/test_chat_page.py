from utility import UtilityFunctions
from Pages.Feed.home_page import HomePage
from logger import logger
import pytest
from Pages.Messaging.messages_page import MessagesPage
from Pages.Messaging.chat_page import ChatPage
from Pages.Navigation.searchbar_page import SearchBarPage
import time
###############################################################
# to import enter key
from appium import webdriver
from appium.webdriver.extensions.android.nativekey import AndroidKey

@pytest.fixture
def setup_test(appium_driver):
    search_bar_page = SearchBarPage(appium_driver)
    home_page = HomePage(appium_driver)
    messages_page = MessagesPage(appium_driver)
    chat_page = ChatPage(appium_driver)
    utils = UtilityFunctions(appium_driver)

    if search_bar_page.is_visible(search_bar_page.SEARCH_BAR_BUTTON):
        home_page.click_messaging_button()
        time.sleep(2)
        return messages_page, chat_page
    else:
        utils.login()
        time.sleep(3)
        home_page.click_messaging_button()
        time.sleep(1)
        return messages_page, chat_page
    
    
def test_unread_messages(appium_driver, setup_test):
    messages_page, chat_page = setup_test
    logger.info("Test: Unread Messages")

    # Click on the unread button
    messages_page.click_Unread_Button()
    time.sleep(2)

    # Verify that the unread messages are displayed
    try:
        assert chat_page.is_visible(chat_page.UNSEEN_COUNT), "Unread messages are not displayed."
        logger.info("Unread messages are displayed.")
    except:
        logger.error("Unread messages are not displayed.")
        assert False, "Unread messages are not displayed."


# def test_send_text_message(appium_driver, setup_test):
#     messages_page, chat_page = setup_test
#     logger.info("Test: Send Text Message")

#     # Click on the first message in the list
#     messages_page.click_First_Message_Button()
#     time.sleep(2)
#     # Enter text in the message box and send it
#     message = 'Hello! This is a very new test message.'
#     chat_page.enter_Message_Text_Box(message)
#     time.sleep(1)
#     chat_page.click_Send_Button()
#     time.sleep(3)
#     appium_driver.hide_keyboard()
#     chat_page.update_message_locater(message)
#     try:
#         chat_page.click_Popup_Notifications_After_Send()
#     except:
#         logger.info("No popup notification after sending the message.")
#         pass

#     # Verify that the message was sent successfully
#     try:
#         assert chat_page.is_visible(chat_page.SENT_MESSAGE), "Message was not sent successfully."
#         logger.info("Message sent successfully.")
#     except:
#         logger.error("Message was not sent successfully.")
#         assert False, "Message was not sent successfully."


def test_send_image_message(appium_driver, setup_test):
    messages_page, chat_page = setup_test
    logger.info("Test: Send Image Message")

    # Click on the first message in the list
    messages_page.click_First_Message_Button()
    time.sleep(2)

    # Click on the add files button and select a valid image
    chat_page.click_Add_Files()
    time.sleep(1)
    chat_page.click_Media_Upload()
    time.sleep(1)
    chat_page.click_Valid_Image()
    time.sleep(2)
    # Click on the next button and send the image
    chat_page.click_Next_Button()
    time.sleep(5)

    # Verify that the image was sent successfully
    try:
        assert chat_page.is_visible(chat_page.MESSAGE), "Image was not sent successfully."
        logger.info("Image sent successfully.")
    except:
        logger.error("Image was not sent successfully.")
        assert False, "Image was not sent successfully."

def test_send_corrupted_image_message(appium_driver, setup_test):
    messages_page, chat_page = setup_test
    logger.info("Test: Send Image Message")

    # Click on the first message in the list
    messages_page.click_First_Message_Button()
    time.sleep(2)

    # Click on the add files button and select a valid image
    chat_page.click_Add_Files()
    time.sleep(1)
    chat_page.click_Media_Upload()
    time.sleep(1)
    chat_page.click_Corrupted_Image()
    time.sleep(2)
    # Click on the next button and send the image
    chat_page.click_Next_Button()
    time.sleep(5)

    # Verify that the image was sent successfully
    try:
        assert not chat_page.is_visible(chat_page.MESSAGE), "Corrupted Image was sent."
        logger.info(" Success Corrupted Image sent.")
    except:
        logger.error("Corrupted Image was sent.")
        assert False, "Corrupted Image was sent."

def test_send_document_message(appium_driver, setup_test):
    messages_page, chat_page = setup_test
    logger.info("Test: Send Document Message")

    # Click on the first message in the list
    messages_page.click_First_Message_Button()
    time.sleep(2)

    # Click on the add files button and select a valid image
    chat_page.click_Add_Files()
    time.sleep(1)
    chat_page.click_Document_Upload()
    time.sleep(1)
    chat_page.click_Document()
    time.sleep(5)

    # Verify that the image was sent successfully
    try:
        assert chat_page.is_visible(chat_page.MESSAGE), "Document was not sent successfully."
        logger.info("Document sent successfully.")
    except:
        logger.error("Document was not sent successfully.")
        assert False, "Document was not sent successfully."

def test_conversation_history(appium_driver, setup_test):
    messages_page, chat_page = setup_test
    logger.info("Test: Conversation History")

    # Click on the first message in the list
    messages_page.click_First_Message_Button()
    time.sleep(2)
    appium_driver.swipe(500, 250, 500, 1500, 2000)
    time.sleep(1)

    # Verify that the conversation history is displayed
    try:
        assert chat_page.is_visible(chat_page.MESSAGE), "Conversation history is not displayed."
        logger.info("Conversation history is displayed.")
    except:
        logger.error("Conversation history is not displayed.")
        assert False, "Conversation history is not displayed."

