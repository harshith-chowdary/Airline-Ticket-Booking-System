import cv2
from pyvirtualcam import Camera


def main(image_file_path):
    # Read image from file
    img = cv2.imread(image_file_path)

    # Create virtual camera with same dimensions as the image
    with Camera(width=img.shape[1], height=img.shape[0], fps=30) as cam:
        # Loop to send frames to virtual camera
        while True:
            # Send image to virtual camera
            cam.send(img)

            # Wait for next frame
            cam.sleep_until_next_frame()


if __name__ == '__main__':
    # Replace with your image file path
    image_file_path = 'nisha.jpg'
    main(image_file_path)