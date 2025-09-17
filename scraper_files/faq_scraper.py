import time
import os
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
import csv
import math

def initiate(url):
    chromedriver_path = ChromeDriverManager().install()
    
    if not chromedriver_path.endswith("chromedriver.exe"):
        chromedriver_dir = os.path.dirname(chromedriver_path)
        chromedriver_path = os.path.join(chromedriver_dir, "chromedriver.exe")

    service = Service(chromedriver_path)
    options = webdriver.ChromeOptions()
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    # The below feature stops chrome from flagging the browser as being controlled by and automated software, thereby allowing to bypass all bot detection
    options.add_argument('--disable-blink-features=AutomationControlled')
    # Disable the below feature if you actually want to show selenium working
    # options.add_argument("--headless=new")
    
    # Begin the driver
    driver = webdriver.Chrome(service=service, options=options)
    driver.maximize_window()
    driver.get(url)
    wait=WebDriverWait(driver,10)
    
    time.sleep(3)
    button=driver.find_elements(By.XPATH,'//div[@class="css-146c3p1 r-op4f77 r-kb43wt r-1x35g6 r-1it3c9n"]')
    section=driver.find_elements(By.XPATH,'//button[@role="button"]')
    title=driver.find_elements(By.XPATH,'//div[@class="css-146c3p1 r-op4f77 r-8jdrp r-ubezar r-1it3c9n"]')
    sno=1
    for i in range(97):
        try:
            button[i].click()
            
        except Exception as e:
            #print(f"Error clicking button {i}")
            button[i-1].click()
            time.sleep(1)
            section[sno].click()
            sno+=1
            time.sleep(1)
            button[i].click()
            
        time.sleep(1.5)
        #print(f"{i} clicked")
        title_text=title[i].text.strip()
        print(f"\nTitle: {title_text}")
        ans=driver.find_element(By.XPATH,'//div[@class="css-146c3p1 r-1xt3ije r-8jdrp r-1b43r93 r-1it3c9n r-rjixqe"]')
        ans_text=ans.text.strip()
        print(f"Answer: {ans_text}")
        time.sleep(1)

# Generate LinkedIn search URL
search_url = 'https://www.jiopay.com/business/help-center'
initiate(search_url)