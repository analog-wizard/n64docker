<?php
	header("Cache-Control: no-store");
?>
<!DOCTYPE html>
	<html lang="en">
	<head>
	
		<!--
		noVNC example: lightweight example using minimal UI and features
	
		This is a self-contained file which doesn't import WebUtil or external CSS.
	
		Copyright (C) 2019 The noVNC Authors
		noVNC is licensed under the MPL 2.0 (see LICENSE.txt)
		This file is licensed under the 2-Clause BSD license (see LICENSE.txt).
	
		Connect parameters are provided in query string:
			http://example.com/?host=HOST&port=PORT&scale=true
		-->
		<title>noVNC</title>
	
		<style>
	
			body {
				margin: 0;
				background-color: dimgrey;
				height: 100%;
				display: flex;
				flex-direction: column;
			}
			html {
				touch-action: manipulation;
				height: 100%;
			}
			#top_bar {
				background-color: #6e84a3;
				color: white;
				font: bold 12px Helvetica;
				padding: 6px 5px 4px 5px;
				border-bottom: 1px outset;
			}
			#status {
				text-align: center;
			}
			#screen {
				flex: 1; /* fill remaining space */
				overflow: hidden;
			}

			.openBtn {
				display: flex;
				justify-content: left;
			}
			.openButton {
				border: none;
				border-radius: 5px;
				background-color: #1c87c9;
				color: white;
				padding: 14px 20px;
				cursor: pointer;
				position: fixed;
			}
			.loginPopup {
				position: relative;
				text-align: center;
				width: 100%;
			}
			.formPopup {
				display: none;
				position: fixed;
				left: 45%;
				top: 5%;
				transform: translate(-50%, 5%);
				border: 3px solid #999999;
				z-index: 9;
			}
			.formContainer {
				max-width: 300px;
				padding: 20px;
				background-color: #fff;
			}
			.formContainer .btn {
				padding: 12px 20px;
				border: none;
				background-color: #8ebf42;
				color: #fff;
				cursor: pointer;
				width: 100%;
				margin-bottom: 15px;
				opacity: 0.8;
			}
			.formContainer .cancel {
				background-color: #cc0000;
			}
			.formContainer .btn:hover,
			.openButton:hover {
				opacity: 1;
			}
		</style>
	
		<div class="loginPopup">
			<div class="formPopup" id="popupForm">
				<form class="formContainer">
					<h2>Controller Detected</h2>
					<button type="button" class="btn" onclick="config_upload()">Upload a Mupen64Plus configuration</button>
					<button type="button" class="btn cancel" onclick="closeForm()">Continue with Keyboard</button>
				</form>
			</div>
		</div>

		<script type="module" crossorigin="anonymous">
			// RFB holds the API to connect and communicate with a VNC server
			import RFB from './core/rfb.js';
			import './gamecontroller-js-modified/dist/gamecontroller.js'
	
			{
				let output = {};
				document.cookie.split(/\s*;\s*/).forEach(function(pair) {
					pair = pair.split(/\s*=\s*/);
					output[pair[0]] = pair.splice(1).join('=');
				});
				let json = JSON.stringify(output, null, 4);
				console.log(json);

				if(json["prevPlayer"] !== 0) {
					await fetch('config.php?action=exit&playerNumber=' + output["prevPlayer"], {method: "GET"});
				}
			}

			let rfb;
			let desktopName;
			let in_progress = true;

			var player_number = 0;

			function openForm() {
				document.getElementById("popupForm").style.display = "block";
			}

			async function reserve() {
				let response = await fetch('config.php?action=enter', {method: "GET"});
				let data = await response.json();
				player_number = +data;
				document.cookie = "prevPlayer=" + player_number + ";"
				if(player_number === 0) {
					window.location.href = window.location.protocol + "//" + window.location.host + "/spectator.php";
				}
			}

			reserve();

			var backgrounded = false;
			document.addEventListener('visibilitychange', function() {
				if (document.visibilityState !== "visible") {
					fetch('config.php?action=exit&playerNumber=' + player_number, {method: "GET"});
					backgrounded = true;
				} else if (document.visibilityState === "visible" && backgrounded === true) {
					player_number = 0;
					reserve();
				}
			});

			openForm();

			//Check to see if the player has a controller plugged in
			gameControl.on('connect', function() {
				if(!in_progress) {
					openForm();
				}
			});

			//The closeForm function called by the form when "Continue with Keyboard is chosen"
			function closeForm() {
				document.getElementById("popupForm").style.display = "none";
			}
			//If the game controller disconnects, then the form is closed
			gameControl.on('disconnect', closeForm());

			//Executed to upload a Mupen64Plus config file for 1 player (When the "Upload" button is pressed)
			function config_upload() {
				//https://stackoverflow.com/questions/16215771/how-to-open-select-file-dialog-via-js
				var input = document.createElement('input');
				input.type = 'file';

				input.onchange = e => { 
					// getting a hold of the file reference
					var file = e.target.files[0]; 

					// setting up the reader
					var reader = new FileReader();
					reader.readAsText(file,'UTF-8');

					// here we tell the reader what to do when it's done reading...
					reader.onload = readerEvent => {
						//https://stackoverflow.com/questions/5587973/javascript-upload-file
						var content = readerEvent.target.result; // this is the content!
						let formData = new FormData();
							
						formData.append("action", "config");
						formData.append("playerNumber", player_number)
						formData.append("content", content)
						fetch('config.php', {method: "POST", body: formData});
						console.log( content );
				}}

				input.click();
			}

			// When this function is called we have
			// successfully connected to a server
			function connectedToServer(e) {
				status("Connected to " + desktopName + " as Player " + player_number);
			}
	
			// This function is called when we are disconnected
			function disconnectedFromServer(e) {
				if (e.detail.clean) {
					status("Disconnected");
				} else {
					status("Something went wrong, connection is closed");
				}
				
			}
	
			// When this function is called, the server requires
			// credentials to authenticate
			function credentialsAreRequired(e) {
				const password = prompt("Password Required:");
				rfb.sendCredentials({ password: password });
			}
	
			// When this function is called we have received
			// a desktop name from the server
			function updateDesktopName(e) {
				desktopName = e.detail.name;
			}
	
			// Show a status text in the top bar
			function status(text) {
				document.getElementById('status').textContent = text;
			}
	
			// This function extracts the value of one variable from the
			// query string. If the variable isn't defined in the URL
			// it returns the default value instead.
			function readQueryVariable(name, defaultValue) {
				// A URL with a query parameter can look like this:
				// https://www.example.com?myqueryparam=myvalue
				//
				// Note that we use location.href instead of location.search
				// because Firefox < 53 has a bug w.r.t location.search
				const re = new RegExp('.*[?&]' + name + '=([^&#]*)'),
					  match = document.location.href.match(re);
	
				if (match) {
					// We have to decode the URL since want the cleartext value
					return decodeURIComponent(match[1]);
				}
	
				return defaultValue;
			}

			// Read parameters specified in the URL query string
			// By default, use the host and port of server that served this file
			const host = readQueryVariable('host', window.location.hostname);
			let port = readQueryVariable('port', window.location.port);
			const password = readQueryVariable('password');
			const path = readQueryVariable('path', 'ws');
	
			// | | |         | | |
			// | | | Connect | | |
			// v v v         v v v
	
			status("Connecting");
	
			// Build the websocket URL used to connect
			let url;
			if (window.location.protocol === "https:") {
				url = 'wss';
			} else {
				url = 'ws';
			}
			url += '://' + host;
			if(port) {
				url += ':' + port;
			}
			url += '/' + path;
	
			// Creating a new RFB object will start a new connection
			rfb = new RFB(document.getElementById('screen'), url,
						  { credentials: { password: password } });
	
			// Add listeners to important events from the RFB module
			rfb.addEventListener("connect",  connectedToServer);
			rfb.addEventListener("disconnect", disconnectedFromServer);
			rfb.addEventListener("credentialsrequired", credentialsAreRequired);
			rfb.addEventListener("desktopname", updateDesktopName);
	
			// check if player is taken

			// example redirect
			// window.location.replace("http://stackoverflow.com");

			// Set to true if player is already taken and person somehow gets past the
			// redirect
			rfb.viewOnly = readQueryVariable('view_only', false);

			// Set parameter to be able to change on an active connection
			rfb.scaleViewport = readQueryVariable('scale', false);
		</script>
	</head>
	
	<body>
		<div id="top_bar">
			<div id="status">Loading</div>
		</div>
		<div id="screen">
			<!-- This is where the remote screen will appear -->
		</div>
	</body>
</html>
