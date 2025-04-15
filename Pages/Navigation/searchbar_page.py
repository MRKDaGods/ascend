from appium.webdriver.common.appiumby import AppiumBy as By  # Import AppiumBy
from Pages.base_page import BasePage  # Import BasePage
from Pages.Navigation.locaters import SearchBarLocaters  
import time 
from selenium.common.exceptions import NoSuchElementException

class SearchBarPage(BasePage):
    """ Page Object for Search Bar """
    
    SEARCH_BAR_SEND_TEXT = SearchBarLocaters.SEARCH_BAR_SEND_TEXT
    SEARCH_BAR_BUTTON = SearchBarLocaters.SEARCH_BAR_BUTTON
    CLEAR_SEARCH_BAR_BUTTON = SearchBarLocaters.CLEAR_SEARCH_BAR_BUTTON
    CLEAR_SEARCH_HISTORY_BUTTON = SearchBarLocaters.CLEAR_SEARCH_HISTORY_BUTTON
    BACK_BUTTON = SearchBarLocaters.BACK_BUTTON
    SEE_ALL_RESULTS = SearchBarLocaters.SEE_ALL_RESULTS
    FILTER_GROUPS_BUTTON = SearchBarLocaters.FILTER_GROUPS_BUTTON
    FILTER_POSTS_BUTTON = SearchBarLocaters.FILTER_POSTS_BUTTON
    FILTER_COMPANIES_BUTTON = SearchBarLocaters.FILTER_COMPANIES_BUTTON 
    FILTER_PEOPLE_BUTTON = SearchBarLocaters.FILTER_PEOPLE_BUTTON
    SEARCHED_ITEM = SearchBarLocaters.SEARCHED_ITEM
    SEARCHED_PEOPLE_ITEM = SearchBarLocaters.SEARCHED_PEOPLE_ITEM
    SEARCHED_PERSON = SearchBarLocaters.SEARCHED_PERSON
    FILTER_PEOPLE_BUTTON_WITH_THEIR_COMPANY = SearchBarLocaters.FILTER_PEOPLE_BUTTON_WITH_THEIR_COMPANY
    FILTER_PEOPLE_BUTTON_BY_INDUSTRY = SearchBarLocaters.FILTER_PEOPLE_BUTTON_BY_INDUSTRY
    ERROR_MESSAGE = SearchBarLocaters.ERROR_MESSAGE

    def click_Search_Bar(self):
        self.click(self.SEARCH_BAR_BUTTON)
    
    def enter_search(self, text):
        self.click(self.SEARCH_BAR_SEND_TEXT)
        self.send_keys(self.SEARCH_BAR_SEND_TEXT, text)
        time.sleep(2)
        # self.click(self.get_entered_search_element(text))
    
    def get_entered_search_element(self, text):
        try:
            return self.driver.find_element(By.XPATH, f'//android.widget.TextView[@resource-id="com.linkedin.android:id/search_typeahead_entity_text" and contains(@text, "{text}")]')
        except NoSuchElementException:
            return None
    def click_Clear_Search_Bar(self):
        self.click(self.CLEAR_SEARCH_BAR_BUTTON)
    
    def click_Clear_Search_History(self):
        self.click(self.CLEAR_SEARCH_HISTORY_BUTTON)
    
    def click_Back_Button(self):
        self.click(self.BACK_BUTTON)
    
    
    def click_See_All_Results(self):
        self.click(self.SEE_ALL_RESULTS)
    
    
    def click_Filter_Groups(self):
        self.click(self.FILTER_GROUPS_BUTTON)
    
    def click_Filter_Posts(self):
        self.click(self.FILTER_POSTS_BUTTON)
    
    def click_Filter_Companies(self):
        self.click(self.FILTER_COMPANIES_BUTTON)
    
    def click_Filter_People(self):
        self.click(self.FILTER_PEOPLE_BUTTON)
    
    def click_Searched_Item(self):
        self.click(self.SEARCHED_ITEM)
    
    def click_filter_people_by_company(self):
        self.click(self.FILTER_PEOPLE_BUTTON_WITH_THEIR_COMPANY)
        
    def click_filter_people_by_industry(self):
        self.click(self.FILTER_PEOPLE_BUTTON_BY_INDUSTRY)
    
    def click_Searched_Person(self):
        self.click(self.SEARCHED_PERSON)