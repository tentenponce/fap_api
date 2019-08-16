import http.client
import json
import os
from datetime import datetime

import cv2
import face_recognition
import timeago

# Configuration
FACE_FOLDER = "faces/"

# Load data
known_face_encodings = []
known_face_names = []

for file in os.listdir(FACE_FOLDER):
    file_path = os.path.join(FACE_FOLDER, file)
    file_basename = os.path.basename(file_path)
    file_name = os.path.splitext(file_basename)[0]

    try:
        face_image = face_recognition.load_image_file(file_path)
        face_encoding = face_recognition.face_encodings(face_image)[0]

        known_face_encodings.append(face_encoding)
        known_face_names.append(file_name)
    except:
        print()

# Get a reference to webcam #0 (the default one)
video_capture = cv2.VideoCapture(0)

# Initialize some variables
face_locations = []
face_encodings = []
face_names = []
process_this_frame = True

while True:
    # Grab a single frame of video
    ret, frame = video_capture.read()

    # Resize frame of video to 1/4 size for faster face recognition processing
    small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)

    # Convert the image from BGR color (which OpenCV uses) to RGB color (which face_recognition uses)
    rgb_small_frame = small_frame[:, :, ::-1]

    # Only process every other frame of video to save time
    if process_this_frame:
        # Find all the faces and face encodings in the current frame of video
        face_locations = face_recognition.face_locations(rgb_small_frame)
        face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)

        face_names = []
        for face_encoding in face_encodings:
            # See if the face is a match for the known face(s)
            matches = face_recognition.compare_faces(known_face_encodings, face_encoding, 0.4)
            name = "Unknown"
            ago = ""
            print(matches)

            # # If a match was found in known_face_encodings, just use the first one.
            if True in matches:
                first_match_index = matches.index(True)
                name = known_face_names[first_match_index]
                # time in
                conn = http.client.HTTPConnection('localhost:10010')
                headers = {'Content-type': 'application/json'}
                body = {'empName': name}
                jsonBody = json.dumps(body)

                conn.request('POST', '/dtr', jsonBody, headers)
                resp = conn.getresponse().read().decode()
                respObj = json.loads(resp)

                try:
                    timeIn = datetime.strptime(respObj['timeIn'], '%Y-%m-%dT%H:%M:%S.%fZ')
                    timeOut = datetime.strptime(respObj['timeOut'], '%Y-%m-%dT%H:%M:%S.%fZ')

                    ago = timeago.format(timeIn, timeOut)
                except:
                    print()

            # Or instead, use the known face with the smallest distance to the new face
            # face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
            # best_match_index = np.argmin(face_distances)
            # if matches[best_match_index]:
            #     name = known_face_names[best_match_index]

            face_names.append(name + " " + ago)

    process_this_frame = not process_this_frame

    # Display the results
    for (top, right, bottom, left), name in zip(face_locations, face_names):
        # Scale back up face locations since the frame we detected in was scaled to 1/4 size
        top *= 4
        right *= 4
        bottom *= 4
        left *= 4

        # Draw a box around the face
        cv2.rectangle(frame, (left, top), (right, bottom), (255, 0, 0), 1)

        # Draw a label with a name below the face
        cv2.rectangle(frame, (left, bottom - 35), (right, bottom), (255, 0, 0), cv2.FILLED)
        font = cv2.FONT_HERSHEY_DUPLEX
        cv2.putText(frame, name, (left + 6, bottom - 6), font, 0.8, (255, 255, 255), 1)

    # Display the resulting image
    cv2.imshow('Video', frame)

    # Hit 'q' on the keyboard to quit!
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release handle to the webcam
video_capture.release()
cv2.destroyAllWindows()
