<?php

// Handle POST requests
if(!empty($_POST['data'] && !empty($_POST['filename']))) {
    // Pull the date for the file from the 'data' field
    // in the post request
    $data = $_POST['data']; 

    // Pull the name for the file from the 'filename' field
    // in the post request
    $fname = $_POST['filename']; 

    // Opens the file, but if the file does not exist, then the
    // file is created
    $file = fopen($fname, 'w');

    // Read the file and then close it
    fwrite($file, $data);
    fclose($file);
}

// Handle GET requests
if(!empty($_GET['']) && !empty($_GET[''])) {
    
}

?>