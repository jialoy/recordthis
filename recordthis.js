

var div = document.createElement("div");
div.id = "recDiv";
div.style.position = "absolute";
div.style.backgroundColor = "none";
div.style.top = "0px";
div.style.left = "0px";
div.style.height = "100%";
div.style.width = "100%";

document.body.appendChild(div);

// get div width and height
var w = document.getElementById('recDiv').clientWidth;
var h = document.getElementById('recDiv').clientHeight;

// viewport centre coords
var xc = w/2, yc = h/2;

var micImg = "images/mic.png";

var micImgW = 120, micImgH = 120;


var dirButtonSCW = 60, dirButtonSCH = 40;

var dirButtonSCCoords = {
    "rec": [(xc-50-dirButtonSCW/2).toString()+"px", "500px"],
    "stopRec": [(xc+50-dirButtonSCW/2).toString()+"px", "500px"]
    };
    
displayDirButtonSC("record", "speak", dirButtonSCCoords.rec[0], dirButtonSCCoords.rec[1], "recDiv");
displayDirButtonSC("stopRecord", "stop", dirButtonSCCoords.stopRec[0], dirButtonSCCoords.stopRec[1], "recDiv");

function displayText(parentId, textDivId, text, size, top, align) {
    // append text (centred) in div to parent container
    var div = document.createElement("div");
    div.id = textDivId;
    div.style.position = "absolute";
    div.style.top = top;    // 10% from parent top
    div.style.left = (w/10).toString()+"px";    // 10% from parent left
    div.style.width = "80%";
    div.style.backgroundColor = "#ffffff";
    div.style.textAlign = align;
    div.style.fontSize = size;
    div.style.fontFamily = "Arial";
    div.innerHTML = text;

    document.getElementById(parentId).appendChild(div);
}

function displayImg(parentId, imgId, src, imgWidth, imgHeight, xPos, yPos) {
    var img = document.createElement("img");
    img.id = imgId;
    img.src = src;
    img.width = imgWidth;
    img.height = imgHeight;
    img.style.position = "absolute";
    img.style.left = xPos;
    img.style.top = yPos;
    
    document.getElementById(parentId).appendChild(img);
}

function displayButtonSC(parentId, text, id, top) {
    // create next button and append to parent container
    var button = document.createElement("button");
    button.id = id;
    button.innerHTML = text;
    button.style.position = "absolute";
    button.style.top = top;
    button.style.left = (0.2*xc).toString()+"px";
    
    document.getElementById(parentId).appendChild(button);
}


function displayDirButtonSC(id, text, left, top, parentId) {
  // create record/send button and append to parent container
  var button = document.createElement("button");
  button.id = id;
  button.style.borderRadius = "10%";
  button.style.borderColor = "#666666";
  button.style.borderWidth = "medium";
  button.style.width = dirButtonSCW.toString()+"px";
  button.style.height = dirButtonSCH.toString()+"px";
  button.style.position = "absolute";
  button.style.top = top;
  button.style.left = left;
  button.innerHTML = text;
  
  document.getElementById(parentId).appendChild(button);
}

function getSessionID() {
  // prompt user input via dialog box
  var sessionID = prompt("Please enter a name for the recording session", "");
  return sessionID;
}

function getTimestamp() {
    // returns current timestamp
    var d = new Date();
    var now = d.getTime();
    return now;
}

function recordAudioSC() {
  var recordedAudio = new Audio;
  
  navigator.getUserMedia = navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia;
                         
  if (navigator.getUserMedia) {
     navigator.getUserMedia({ audio: true },
        function handlerFunction(stream) {
          rec = new MediaRecorder(stream);
          rec.ondataavailable = e => {
            audioChunks.push(e.data);
            if (rec.state == "inactive") {
              //can use size and duration to check for functioning audio
              console.log(Date.now() - start);
              console.log(e.data.size);
              //check for suspiciously blank audio files
              if (e.data.size<(2*(Date.now() - start))) {
                window.alert("It looks like your mic isn't recording - please adjust this before you continue.");
              } 
              let blob = new Blob(audioChunks,{type:'audio/mpeg-3'});
              recordedAudio.src = URL.createObjectURL(blob);
              recordedAudio.controls = true;
              recordedAudio.autoplay = false;
              sendData(blob);
            }
          };
        },
        function(err) {
          var clickAllowText = "Please allow microphone access."
           displayText("recDiv", "clickAllowText", clickAllowText, "22px", "600px", "center");
        }
     );
  } else {
     console.log("getUserMedia not supported");
  }
  
  function sendData(data) {
    idx ++;
    var trialNo = "recording" + idx.toString();
    var fileName = filename_prefix + "_" + trialNo;
    console.log(fileName);
    var formData = new FormData();
    formData.append("audio", data);
    formData.append("fileName", fileName);
    var xhr = new XMLHttpRequest(),
        method = 'POST',
        url = 'upload_.php';
    xhr.open(method, url, true);
    xhr.send(formData);
  }
  
  record.onclick = e => {
    console.log("recording");
    record.disabled = true;
    mic.style.backgroundColor = "#F59042";
    mic.style.borderRadius = "10%";
    stopRecord.disabled = false;
    audioChunks = [];
    start = Date.now();
    rec.start();
  };
  stopRecord.onclick = e => {
    console.log("recorded");
    record.disabled = false;
    stop.disabled = true;
    mic.style.backgroundColor = "#ffffff";
    mic.style.borderRadius = "10%";
    rec.stop();
  };
}

function streamTest() {
  var streamTestText = "Click speak to start recording and stop to stop recording";

  displayText("recDiv", "streamTestText", streamTestText, "22px", "150px", "left");
  displayImg("recDiv", "mic", micImg, micImgW, micImgH, (xc-micImgW/2).toString()+"px", "350px");

}

var idx = 0;    // initialise recording filename index as 0 (increments on each recording)
var sessionID = getSessionID();
var startTimestamp = getTimestamp();
var filename_prefix = sessionID + "_" + startTimestamp;    // create filename prefix based on session ID and session start timestamp

streamTest();

recordAudioSC();
