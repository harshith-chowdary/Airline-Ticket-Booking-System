from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.common.alert import Alert
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import cv2
import pyvirtualcam
from time import sleep
import urllib.request
import numpy as np
import sys

# Get command line arguments
if len(sys.argv) != 2:
    print("Usage: python script.py [image_url]")
    sys.exit(1)

# configuring image urls from input
req = urllib.request.urlopen(sys.argv[1])
arr = np.asarray(bytearray(req.read()), dtype=np.uint8)
img = cv2.imdecode(arr, -1)

# # Load the image
# img = cv2.imread('cowin.jpeg')

# create options to bypass camera pop-up
options = webdriver.EdgeOptions()
options.set_capability("permissions.default.camera", 1)

# create a new Edge browser instance
driver = webdriver.Edge(options=options)

# navigate to the Cowin website
driver.get("https://verify.cowin.gov.in")

# wait for the scan QR code button to become clickable
scan_button = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, "//button[@class='custom-button green-btn']")))

# click the scan QR code button
scan_button.click()

output = 0

with pyvirtualcam.Camera(width=img.shape[1], height=img.shape[0], fps=30) as cam:

    got = True

    while got:

        cam.send(img)

        # Wait for next frame
        cam.sleep_until_next_frame()

        # try to get output data
        try:
            # wait for the output to appear
            status = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, "//div[@class='certificate-status-wrapper']/h3"))).text

            if status=="Certificate Successfully Verified":
                output=1
                name = WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.XPATH, "//div[@class='certificate-status-wrapper']/table/tr/td[2]"))).text
                print(status, name)

                got = False

            elif status=="Certificate Invalid":
                output=1
                print(status)
                
                got = False
            else:
                print("Failed !!!")

        except:
            pass


# close the browser
driver.quit()