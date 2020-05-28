# recordthis
A covid-19 friendly tool for (remotely) recording audio. Still in beta stage. I am currently using this to record experimental audio stims.

How to set up:
1. Download and unzip repository contents
2. Upload files to your server
3. Modify directory path on line 28 of upload_.php to server directory where recordings should be saved to

How to use:
1. Navigate to the HTML page in your browser
2. Enter a name for the recording session when prompted (this, along with the session start time, will be used to generate a filename prefix for the recordings)
<p align="center"><img src="../assets/scr1.png" width="400"></p>

3. Click allow to allow mic access when prompted
4. Click 'speak' to start recording (mic image should turn orange to indicate recording in progress)
<p align="center"><img src="../assets/scr2.png" width="400"></p>

5. Click 'stop' when complete
6. Repeat as necessary

Recordings are saved as .webm format. These can be converted to a usable format (.mp3/.wav etc) via <a href="https://ffmpeg.org/">ffmpeg</a>

```ffmpeg -i input.ext output.ext```

Tested in Chrome and Firefox, may not work in other browsers
