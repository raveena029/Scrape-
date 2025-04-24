from selenium import webdriver
from selenium.webdriver.edge.service import Service
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException, ElementClickInterceptedException
from selenium.webdriver.common.keys import Keys
import time

EDGE_DRIVER_PATH = r"C:\Users\ravee\Downloads\edgedriver_win64\msedgedriver.exe"
BASE_URL = "http://172.22.176.1:3000"

def login(driver, username, password, role):
    driver.get(f"{BASE_URL}/")
    time.sleep(2)
    driver.find_element(By.ID, "username").send_keys(username)
    driver.find_element(By.ID, "password").send_keys(password)
    driver.find_element(By.ID, role).click()
    driver.find_element(By.XPATH, "//button[contains(text(),'Login')]").click()
    time.sleep(2)

def test_employee_flow(driver):
    print("=== Employee Flow ===")
    login(driver, "employee1", "password123", "employee")

    # Go to checkout
    driver.get(f"{BASE_URL}/employee/checkout")
    time.sleep(2)
    try:
        driver.find_element(By.XPATH, "//h1[contains(text(),'Checkout')]")
        print("Employee checkout page loaded.")
    except NoSuchElementException:
        print("Employee checkout page NOT found.")

    # Add product to cart by Product ID (assume '1' exists)
    try:
        product_input = driver.find_element(By.XPATH, "//input[@placeholder='Enter Product ID']")
        product_input.clear()
        product_input.send_keys("1")
        driver.find_element(By.XPATH, "//button[contains(text(),'Add')]").click()
        time.sleep(2)
        # Check if product appears in cart
        driver.find_element(By.XPATH, "//table//td[contains(text(),'1')]")
        print("Product added to cart.")
    except NoSuchElementException:
        print("Failed to add product to cart.")

    # Complete checkout
    try:
        checkout_btn = driver.find_element(By.XPATH, "//button[contains(text(),'Complete Checkout')]")
        if checkout_btn.is_enabled():
            checkout_btn.click()
            time.sleep(2)
            print("Checkout completed.")
        else:
            print("Checkout button disabled (cart may be empty).")
    except NoSuchElementException:
        print("Checkout button not found.")

    # Scroll through products
    driver.get(f"{BASE_URL}/employee/products")
    time.sleep(2)
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    print("Scrolled through products page.")

    # Scroll through store layout
    driver.get(f"{BASE_URL}/employee/store-layout")
    time.sleep(2)
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    print("Scrolled through store layout page.")

    # Logout
    try:
        driver.find_element(By.XPATH, "//button[contains(text(),'Logout')]").click()
        time.sleep(2)
        print("Employee logout successful.")
    except NoSuchElementException:
        print("Employee logout failed.")

def test_manager_flow(driver):
    print("=== Manager Flow ===")
    login(driver, "manager1", "password123", "manager")

    # Go to inventory and update a product
    driver.get(f"{BASE_URL}/manager/inventory")
    time.sleep(2)
    try:
        # Click first "Update" button in inventory table
        update_btn = driver.find_element(By.XPATH, "//button[contains(text(),'Update')]")
        update_btn.click()
        time.sleep(1)
        # Update quantity
        qty_input = driver.find_element(By.ID, "new-quantity")
        qty_input.clear()
        qty_input.send_keys("999")
        driver.find_element(By.XPATH, "//button[contains(text(),'Update')]").click()
        time.sleep(2)
        print("Inventory updated.")
    except NoSuchElementException:
        print("Could not update inventory (no Update button or dialog).")

    # Go to products and add a new product
    driver.get(f"{BASE_URL}/manager/products")
    time.sleep(2)
    try:
        add_btn = driver.find_element(By.XPATH, "//button[contains(text(),'Add Product')]")
        add_btn.click()
        time.sleep(1)
        driver.find_element(By.ID, "name").send_keys("SeleniumTestProduct")
        driver.find_element(By.ID, "category").send_keys("TestCategory")
        driver.find_element(By.ID, "price").send_keys("9.99")
        driver.find_element(By.ID, "unitAvailable").send_keys("100")
        driver.find_element(By.ID, "location").send_keys("Aisle 1")
        driver.find_element(By.ID, "floatDiscount").send_keys("5")
        driver.find_element(By.ID, "minThreshold").send_keys("10")
        driver.find_element(By.ID, "maxCapacity").send_keys("200")
        driver.find_element(By.XPATH, "//button[contains(text(),'Create')]").click()
        time.sleep(2)
        print("Manager added new product.")
    except NoSuchElementException:
        print("Add Product button or form not found.")

    # Generate and download report
    driver.get(f"{BASE_URL}/manager/reports")
    time.sleep(2)
    try:
        # Select report type
        driver.find_element(By.ID, "report-type").click()
        time.sleep(1)
        driver.find_element(By.XPATH, "//div[contains(text(),'Sales Report')]").click()
        # Optionally set dates if needed
        # driver.find_element(By.ID, "start-date").send_keys("2024-01-01")
        # driver.find_element(By.ID, "end-date").send_keys("2024-12-31")
        # Generate report
        driver.find_element(By.XPATH, "//button[contains(text(),'Generate')]").click()
        time.sleep(2)
        # Download report
        driver.find_element(By.XPATH, "//button[contains(text(),'Download')]").click()
        time.sleep(2)
        print("Manager generated and downloaded report.")
    except NoSuchElementException:
        print("Report generation or download button not found.")

    # Logout
    try:
        driver.find_element(By.XPATH, "//button[contains(text(),'Logout')]").click()
        time.sleep(2)
        print("Manager logout successful.")
    except NoSuchElementException:
        print("Manager logout failed.")

def main():
    service = Service(EDGE_DRIVER_PATH)
    driver = webdriver.Edge(service=service)
    try:
        test_employee_flow(driver)
        test_manager_flow(driver)
    finally:
        driver.quit()

if __name__ == "__main__":
    main()