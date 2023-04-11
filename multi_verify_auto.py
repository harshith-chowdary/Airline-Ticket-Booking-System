from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import cv2
import pyvirtualcam
import urllib.request
import numpy as np
import sys

# Get command line arguments
if len(sys.argv) != 2:
    print("Usage: python [script.py] [data string]")
    sys.exit(1)

# configuring image urls from input
req = sys.argv[1]
data = req.split(',')

# create options to bypass camera pop-up
options = webdriver.EdgeOptions()
options.add_argument("--use-fake-ui-for-media-stream")

# create a new Edge browser instance
driver = webdriver.Edge(options=options)

# navigate to the Cowin website
driver.get("https://verify.cowin.gov.in")

# wait for the scan QR code button to become clickable
scan_button = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, "//button[@class='custom-button green-btn']")))

# click the scan QR code button
scan_button.click()

options = webdriver.EdgeOptions()

output = 0

i=0

true = True

while i<len(data) and true:

    if i!=0:
        # wait for the scan QR code button to become clickable
        scan_button = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, "//button[@class='custom-button green-btn']")))

        # click the scan QR code button
        scan_button.click()

    [name_in, image] = data[i].split('-')

    req = urllib.request.urlopen(image)
    arr = np.asarray(bytearray(req.read()), dtype=np.uint8)
    img = cv2.imdecode(arr, -1)

    with pyvirtualcam.Camera(width=img.shape[1], height=img.shape[0], fps=30) as cam:
        
        # print("Entered ", i, " th Cam")
        # send the screen to the virtual camera
        cam.send(img)

        # print("Sent Image")


        # Wait for next frame
        # cam.sleep_until_next_frame()

        # try to get output data
        try:
            # wait for the output to appear
            status = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, "//div[@class='certificate-status-wrapper']/h3"))).text

            if status=="Certificate Successfully Verified":
                name = WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.XPATH, "//div[@class='certificate-status-wrapper']/table/tr/td[2]"))).text
                # print(status, name)

                if name_in!=name:
                    true = False
                    print("Name",i,end="")

                    # close the browser
                    # driver.quit()
                    # exit()
                else:
                    i+=1
                    button = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, "//button[@class='custom-button blue-btn m-3']")))
                    button.click()

            elif status=="Certificate Invalid":
                # print(status)
                print("Fail",i,end="")
                true = False

                # close the browser
                # driver.quit()
                # exit()
            else:
                # print("Retrying")
                pass

        except:
            pass

if(true):
    print("Success",end="")
# close the browser
driver.quit()
sys.exit(0)