import os
import unittest
import time


from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support.ui import Select

BASE_URL = os.getenv("APP_BASE_URL", "http://localhost:8443").rstrip("/")


class DisasterResponseAppTests(unittest.TestCase):
	@classmethod
	def setUpClass(cls):
		options = webdriver.EdgeOptions()
		# if os.getenv("SELENIUM_HEADLESS", "1").lower() not in {"0", "false", "no"}:
		# 	options.add_argument("--headless=new")
		options.add_argument("--window-size=1440,1000")
		options.add_argument("--disable-dev-shm-usage")
		options.add_argument("--no-sandbox")
		cls.driver = webdriver.Edge(options=options)
		cls.wait = WebDriverWait(cls.driver, 10)

	def setUp(self):
		self.driver.get(BASE_URL)
		self.driver.delete_all_cookies()
		self.driver.execute_script("window.localStorage.clear();")
		self.driver.refresh()

	@classmethod
	def tearDownClass(cls):
		if hasattr(cls, "driver"):
			cls.driver.quit()

	def open_page(self, path):
		self.driver.get(f"{BASE_URL}{path}")

	def login_as(self, email):
		self.open_page("/login")
		self.driver.find_element(By.CSS_SELECTOR, "input[type='email']").send_keys(email)
		self.driver.find_element(By.CSS_SELECTOR, "input[type='password']").send_keys("12345678")
		self.driver.find_element(By.CSS_SELECTOR, "form button[type='submit']").click()
		self.wait.until(lambda driver: driver.current_url != f"{BASE_URL}/login")

	def test_donation_type_and_category_update_form_and_centers(self):
		self.open_page("/donate")
		time.sleep(2)

		cash_option = self.wait.until(
			EC.element_to_be_clickable(
				(By.XPATH, "//button[contains(., 'অর্থ সহায়তা')]")
			)
		)
		cash_option.click()
		time.sleep(2)

		amount_input = self.wait.until(
			EC.visibility_of_element_located(
				(
					By.XPATH,
					"//label[contains(., 'পরিমাণ (টাকা)')]//input[@type='number']",
				)
			)
		)
		amount_input.send_keys("100")
		time.sleep(2)

		center = self.wait.until(
			EC.visibility_of_element_located(
				(
					By.CSS_SELECTOR,
					"select.input-base"
				)
			)
		)

		Select(center).select_by_value("1")
		time.sleep(2)

		anonymous = self.wait.until(
			EC.element_to_be_clickable(
				(
					By.XPATH,
					"//label[contains(., 'পরিচয় গোপন রেখে দান করতে চাই')]//input[@type='checkbox']"
				)
			)
		)

		anonymous.click()
		time.sleep(3)

		submit_button = self.wait.until(
			EC.element_to_be_clickable(
				(
					By.XPATH,
					"//button[@type='submit' and contains(., 'অনুদান নথিভুক্ত করুন')]"
				)
			)
		)

		submit_button.click()

		time.sleep(3)



	# def test_donation_log_category_filter_shows_matching_entries(self):
	# 	self.open_page("/donations/log")
	# 	medical_filter = self.wait.until(
	# 		EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'চিকিৎসা')]"))
	# 	)
	# 	medical_filter.click()

	# 	self.wait.until(
	# 		lambda driver: (cards := driver.find_elements(By.CSS_SELECTOR, "section article"))
	# 		and all("চিকিৎসা" in card.text for card in cards)
	# 	)
	# 	cards = self.driver.find_elements(By.CSS_SELECTOR, "section article")
	# 	self.assertTrue(cards)
	# 	self.assertTrue(all("চিকিৎসা" in card.text for card in cards))

	# def test_volunteer_can_search_assigned_tasks(self):
	# 	self.login_as("volunteer@example.com")
	# 	self.open_page("/volunteer/tasks")
	# 	self.wait.until(
	# 		lambda driver: driver.find_elements(By.CSS_SELECTOR, "a[href^='/volunteer/tasks/']")
	# 		or driver.find_elements(By.XPATH, "//*[contains(., 'কোনো কাজ পাওয়া যায়নি')]")
	# 	)
	# 	task_links = self.driver.find_elements(By.CSS_SELECTOR, "a[href^='/volunteer/tasks/']")
	# 	if not task_links:
	# 		self.assertTrue(
	# 			self.driver.find_element(
	# 				By.XPATH, "//*[contains(., 'কোনো কাজ পাওয়া যায়নি')]"
	# 			).is_displayed()
	# 		)
	# 		return

	# 	task_title = self.driver.find_element(By.CSS_SELECTOR, "h3").text
	# 	self.assertTrue(task_title)

	# 	search = self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='কাজ খুঁজুন...']")
	# 	search.send_keys("no-matching-task")
	# 	self.wait.until(
	# 		EC.visibility_of_element_located((By.XPATH, "//*[contains(., 'কোনো কাজ পাওয়া যায়নি')]"))
	# 	)

	# 	search.send_keys(Keys.CONTROL, "a", Keys.BACKSPACE)
	# 	self.assertEqual("", search.get_attribute("value"))
	# 	self.wait.until(
	# 		lambda driver: len(driver.find_elements(By.CSS_SELECTOR, "a[href^='/volunteer/tasks/']")) > 0
	# 	)
	# 	self.assertTrue(
	# 		any(task_title in heading.text for heading in self.driver.find_elements(By.CSS_SELECTOR, "h3"))
	# 	)

	# def test_citizen_can_filter_reports_by_pending_status(self):
	# 	self.login_as("citizen@example.com")
	# 	self.open_page("/citizen/reports")
	# 	self.wait.until(
	# 		lambda driver: driver.find_elements(By.CSS_SELECTOR, "tbody tr")
	# 		or driver.find_elements(By.XPATH, "//*[contains(., 'কোনো রিপোর্ট পাওয়া যায়নি')]")
	# 	)

	# 	pending_filter = self.wait.until(
	# 		EC.element_to_be_clickable((By.XPATH, "//button[normalize-space()='অপেক্ষমাণ']"))
	# 	)
	# 	pending_filter.click()
	# 	rows = self.driver.find_elements(By.CSS_SELECTOR, "tbody tr")
	# 	if rows:
	# 		self.assertTrue(all("অপেক্ষমাণ" in row.text for row in rows))
	# 	else:
	# 		self.assertTrue(
	# 			self.wait.until(
	# 				EC.visibility_of_element_located(
	# 					(By.XPATH, "//*[contains(., 'কোনো রিপোর্ট পাওয়া যায়নি')]")
	# 				)
	# 			)
	# 		)

	# def test_login_shows_error_for_invalid_credentials(self):
	# 	self.open_page("/login")
	# 	self.driver.find_element(By.CSS_SELECTOR, "input[type='email']").send_keys(
	# 		"unknown.selenium.user@example.test"
	# 	)
	# 	self.driver.find_element(By.CSS_SELECTOR, "input[type='password']").send_keys(
	# 		"invalid-password"
	# 	)
	# 	self.driver.find_element(By.CSS_SELECTOR, "form button[type='submit']").click()

	# 	self.wait.until(
	# 		EC.visibility_of_element_located((By.CSS_SELECTOR, ".bg-red-50"))
	# 	)
	# 	self.assertTrue(self.driver.current_url.endswith("/login"))

	# def test_citizen_report_requires_disaster_details_and_location(self):
	# 	self.login_as("citizen@example.com")
	# 	self.open_page("/citizen/report")
	# 	self.wait.until(
	# 		EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'রিপোর্ট জমা দিন')]"))
	# 	).click()

	# 	for message in (
	# 		"দুর্যোগের ধরন নির্বাচন করুন।",
	# 		"ঘটনার শিরোনাম লিখুন।",
	# 		"ঘটনার বিবরণ লিখুন।",
	# 		"অবস্থান নির্বাচন করুন।",
	# 	):
	# 		with self.subTest(message=message):
	# 			self.assertTrue(
	# 				self.wait.until(
	# 					EC.visibility_of_element_located(
	# 						(By.XPATH, f"//*[contains(., '{message}')]")
	# 					)
	# 				)
	# 			)


if __name__ == "__main__":
	unittest.main(verbosity=2)
