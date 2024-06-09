from flask import Flask, render_template, Response, jsonify, request, render_template_string, send_file
import cv2
from ultralytics import YOLO
from picamera2 import Picamera2
import time
import logging
import os
import subprocess
import numpy as np
import serial

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Load the YOLOv8 model trained for person detection (COCO dataset)
model = YOLO('yolov8n.pt')  # Use the YOLOv8 model file

# HTML template for the index page
html_template = """
<!DOCTYPE html>
<html>
<head>
    <title>Camera Feed</title>
    <style>
        #video-container {
            position: relative;
            width: 600px;
            height: 480px;
            margin: 0 auto;
        }
        #video {
            display: block;
            width: 100%;
            height: auto;
        }
        #arrows-container {
            text-align: center;
            margin-top: 20px;
            font-size: 6em; /* Make the arrows larger */
            color: rgb(10, 212, 61);
        }
        .arrow {
            display: none;
            margin: 0 20px;
        }
    </style>
</head>
<body>
    <h1>Camera Feed</h1>
    <div id="video-container">
        <img id="video" src="{{ url_for('video_feed') }}">
    </div>
    <div id="arrows-container">
        <span id="arrow-left" class="arrow">←</span>
        <span id="arrow-right" class="arrow">→</span>
        <span id="arrow-up" class="arrow">↑</span>
        <span id="arrow-down" class="arrow">↓</span>
    </div>

    <script>
        function updateArrows(controlSignals) {
            document.getElementById('arrow-left').style.display = controlSignals.move_y < 0 ? 'inline' : 'none';
            document.getElementById('arrow-right').style.display = controlSignals.move_y > 0 ? 'inline' : 'none';
            document.getElementById('arrow-up').style.display = controlSignals.move_x > 0 ? 'inline' : 'none';
            document.getElementById('arrow-down').style.display = controlSignals.move_x < 0 ? 'inline' : 'none';
        }

        async function fetchControlSignals() {
            try {
                const response = await fetch('{{ url_for("get_control_signals") }}');
                const controlSignals = await response.json();
                updateArrows(controlSignals);
            } catch (error) {
                console.error('Error fetching control signals:', error);
            }
        }

        setInterval(fetchControlSignals, 1000);
    </script>
</body>
</html>
"""

# Serial port configuration
ser = serial.Serial(
    port='/dev/serial0',
    baudrate=115200,
    parity=serial.PARITY_NONE,
    stopbits=serial.STOPBITS_ONE,
    bytesize=serial.EIGHTBITS,
    timeout=1
)

def send_control_signals(x, y, z, yaw):
    try:
        message = bytes([255, 255, int(x * 127 + 127), int(y * 127 + 127), int(z * 127 + 127), int(yaw * 127 + 127)])
        ser.write(message)
        app.logger.debug(f'Sent bytes: {message}')
    except Exception as e:
        app.logger.error(f'Error sending control signals: {e}')

@app.before_request
def log_request_info():
    app.logger.debug('Headers: %s', request.headers)
    app.logger.debug('Body: %s', request.get_data())

@app.after_request
def log_response_info(response):
    app.logger.debug('Response: %s', response.status)
    return response

def kill_camera_processes():
    try:
        result = subprocess.run(['lsof', '/dev/video0'], capture_output=True, text=True)
        lines = result.stdout.splitlines()

        for line in lines[1:]:  # Skip the header line
            parts = line.split()
            pid = parts[1]
            os.system(f'sudo kill -9 {pid}')
            print(f"Killed process {pid} using /dev/video0")

    except Exception as e:
        print(f"Error while killing processes: {e}")

# Kill any processes that might be using the camera
kill_camera_processes()

@app.route('/')
def index():
    app.logger.debug('Serving index page')
    return render_template_string(html_template)

def open_camera(retry_attempts=5, delay=2):
    for attempt in range(retry_attempts):
        try:
            app.logger.debug('Opening camera (attempt %d)', attempt + 1)
            picam2 = Picamera2()
            picam2.start()
            time.sleep(2)  # Allow the camera to warm up
            return picam2
        except Exception as e:
            app.logger.error('Error opening camera: %s', e)
            time.sleep(delay)
    return None

def capture_frame(picam2):
    try:
        picam2.capture_file("image.jpg")
        app.logger.debug('Captured image')
        with open("image.jpg", "rb") as f:
            frame_data = f.read()
        return frame_data
    except Exception as e:
        app.logger.error('Error capturing frame: %s', e)
        return None

frame_count = 0
control_signals = {'move_x': 0, 'move_y': 0, 'move_z': 0, 'yaw': 0}

def calculate_control_signal(bbox, image_width, image_height):
    x_min, y_min, x_max, y_max = bbox
    x_center = (x_min + x_max) / 2
    y_center = (y_min + y_max) / 2
    bbox_height = y_max - y_min

    x_FOV = image_width / 2
    y_FOV = image_height / 2

    move_x = 0
    move_y = 0
    move_z = 0
    yaw = 0

    if x_center < x_FOV - 20:
        move_y = -1  # Move left
    elif x_center > x_FOV + 20:
        move_y = 1  # Move right

    target_height_ratio = 0.5  # Target height ratio of the bounding box to the image height
    current_height_ratio = bbox_height / image_height

    if current_height_ratio < target_height_ratio - 0.05:
        move_x = 1  # Move closer
    elif current_height_ratio > target_height_ratio + 0.05:
        move_x = -1  # Move back

    return move_x, move_y, move_z, yaw

def camera_control_loop():
    global frame_count, control_signals

    picam2 = open_camera()
    if picam2 is None:
        print('Error: Could not open camera')
        return

    while True:
        frame_data = capture_frame(picam2)
        if frame_data is None:
            app.logger.error('No frame data captured')
            break

        frame = cv2.imdecode(np.frombuffer(frame_data, np.uint8), cv2.IMREAD_COLOR)
        frame_height, frame_width = frame.shape[:2]  # Ensure these variables are defined here

        results = model(frame)

        largest_box = None
        largest_area = 0
        stop_due_to_large_box = False

        for r in results:
            boxes = r.boxes
            for box in boxes:
                cls = box.cls
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                conf = box.conf[0]
                area = (x2 - x1) * (y2 - y1)

                if int(cls) == 0:  # Person class
                    if area > largest_area:
                        largest_area = area
                        largest_box = (x1, y1, x2, y2)

                    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                    label = f"Person: {conf:.2f}"
                    cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

                # Check if the box occupies 90% or more of the frame
                if area >= 0.9 * frame_width * frame_height:
                    stop_due_to_large_box = True
                    print(f"Stopping due to large box covering 90% or more of the screen: {(x1, y1, x2, y2)}")

        if stop_due_to_large_box:
            control_signals = {'move_x': 0, 'move_y': 0, 'move_z': 0, 'yaw': 0}
            cv2.putText(frame, "Large box detected! Stopping.", (10, frame_height - 60), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)
        elif largest_box is not None:
            print(f"Largest box detected: {largest_box}")
            move_x, move_y, move_z, yaw = calculate_control_signal(largest_box, frame_width, frame_height)
            control_signals = {'move_x': move_x, 'move_y': move_y, 'move_z': move_z, 'yaw': yaw}
            control_text = f"move_x: {move_x}, move_y: {move_y}, move_z: {move_z}, yaw: {yaw}"
            cv2.putText(frame, control_text, (10, frame_height - 30), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2)
        else:
            print("No detections in the current frame.")

        # Send control signals via serial
        send_control_signals(control_signals['move_x'], control_signals['move_y'], control_signals['move_z'], control_signals['yaw'])

        # Save the frame with control signals overlaid
        frame_with_signals_path = "image_with_signals.jpg"
        cv2.imwrite(frame_with_signals_path, frame)
        print(f"Saved frame with control signals as {frame_with_signals_path}")

        frame_count += 1

    picam2.stop()
    picam2.close()

# Start the camera control loop
camera_control_loop()

@app.route('/video_feed')
def video_feed():
    def gen():
        global frame_count, control_signals

        picam2 = open_camera()
        if picam2 is None:
            yield (b'--frame\r\n'
                   b'Content-Type: text/plain\r\n\r\n' + b'Error: Could not open camera' + b'\r\n')
            return

        while True:
            frame_data = capture_frame(picam2)
            if frame_data is None:
                app.logger.error('No frame data captured')
                break

            frame = cv2.imdecode(np.frombuffer(frame_data, np.uint8), cv2.IMREAD_COLOR)
            frame_height, frame_width = frame.shape[:2]  # Ensure these variables are defined here

            results = model(frame)

            largest_box = None
            largest_area = 0
            stop_due_to_large_box = False

            for r in results:
                boxes = r.boxes
                for box in boxes:
                    cls = box.cls
                    x1, y1, x2, y2 = map(int, box.xyxy[0])
                    conf = box.conf[0]
                    area = (x2 - x1) * (y2 - y1)

                    if int(cls) == 0:  # Person class
                        if area > largest_area:
                            largest_area = area
                            largest_box = (x1, y1, x2, y2)

                        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                        label = f"Person: {conf:.2f}"
                        cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

                    # Check if the box occupies 90% or more of the frame
                    if area >= 0.9 * frame_width * frame_height:
                        stop_due_to_large_box = True
                        print(f"Stopping due to large box covering 90% or more of the screen: {(x1, y1, x2, y2)}")

            if stop_due_to_large_box:
                control_signals = {'move_x': 0, 'move_y': 0, 'move_z': 0, 'yaw': 0}
                cv2.putText(frame, "Large box detected! Stopping.", (10, frame_height - 60), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)
            elif largest_box is not None:
                print(f"Largest box detected: {largest_box}")
                move_x, move_y, move_z, yaw = calculate_control_signal(largest_box, frame_width, frame_height)
                control_signals = {'move_x': move_x, 'move_y': move_y, 'move_z': move_z, 'yaw': yaw}
                control_text = f"move_x: {move_x}, move_y: {move_y}, move_z: {move_z}, yaw: {yaw}"
                cv2.putText(frame, control_text, (10, frame_height - 30), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2)
            else:
                print("No detections in the current frame.")

            # Send control signals via serial
            send_control_signals(control_signals['move_x'], control_signals['move_y'], control_signals['move_z'], control_signals['yaw'])

            # Save the frame with control signals overlaid
            frame_with_signals_path = "image_with_signals.jpg"
            cv2.imwrite(frame_with_signals_path, frame)
            print(f"Saved frame with control signals as {frame_with_signals_path}")

            frame_count += 1

            _, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

        picam2.stop()
        picam2.close()

    return Response(gen(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/control_signals')
def get_control_signals():
    global control_signals
    return jsonify(control_signals)

@app.route('/image_with_signals')
def get_image_with_signals():
    try:
        return send_file('image_with_signals.jpg', mimetype='image/jpeg')
    except Exception as e:
        app.logger.error(f"Error sending image with signals: {e}")
        return jsonify({"error": "Failed to retrieve image"}), 500

if __name__ == '__main__':
    try:
        app.run(host='0.0.0.0', port=5000, debug=True)
    except Exception as e:
        app.logger.error('Failed to start app: %s', e)
    finally:
        print("Application closed.")
