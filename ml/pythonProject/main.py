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
control_signals = {'move_x': 0, 'move_y': 0, 'move_z': 0}


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

    return move_x, move_y, move_z


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
            control_signals = {'move_x': 0, 'move_y': 0, 'move_z': 0}
            cv2.putText(frame, "Large box detected! Stopping.", (10, frame_height - 60), cv2.FONT_HERSHEY_SIMPLEX, 0.5,
                        (0, 0, 255), 2)
        elif largest_box is not None:
            print(f"Largest box detected: {largest_box}")
            move_x, move_y, move_z = calculate_control_signal(largest_box, frame_width, frame_height)
            control_signals = {'move_x': move_x, 'move_y': move_y, 'move_z': move_z}
            control_text = f"move_x: {move_x}, move_y: {move_y}, move_z: {move_z}"
            cv2.putText(frame, control_text, (10, frame_height - 30), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2)
        else:
            print("No detections in the current frame.")

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


@app.route('/video_feed')
def video_feed():
    return Response(gen(), mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/control_signals')
def get_control_signals():
    global control_signals
    return jsonify(control_signals)


if name == 'main':
    try:
        app.run(host='0.0.0.0', port=5000, debug=True)
    except Exception as e:
        app.logger.error('Failed to start app: %s', e)
    finally:
        print("Application closed.")
...