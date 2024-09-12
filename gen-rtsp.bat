start ./ffmpeg-win64/bin/ffmpeg.exe -re -stream_loop -1 -i ./test.mp4 -c copy -f rtsp rtsp://localhost:8554/mystream

