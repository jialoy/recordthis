<?php

//build filename from workerId and day
function cleanInput($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = str_replace('/','',$data);
  $data = str_replace('.','',$data);
  return $data;
}


if (isset($_FILES['audio'])) {

  // Determine new filename
  if ($_FILES['audio']['type'] == 'audio/mp3') {
    $format = '.mp3';
  }
  elseif ($_FILES['audio']['type'] == 'audio/webm') {
    $format = '.webm';
  }
  else {
    $format = '.wav';
  }
  $new_file_name = cleanInput($_REQUEST['fileName']) . $format;

  // Store the new recording to the hold directory
  copy($_FILES['audio']['tmp_name'], '/path/to/output/dir/' . $new_file_name);
}

// Return the completion code to the ajax request
echo $_FILES['audio']['type'];

?>
