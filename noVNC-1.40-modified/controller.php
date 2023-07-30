<?php
	$player_number = NULL;
	for ($x = 1; $x <= 4; $x++) {
		$temp_lock = "player".$x.".lock";
		if(!file_exists($temp_lock)) {
			$player_lock = $temp_lock;
			$player_number = $x;
			break;
		}
	}
	if ($player_lock == NULL) {
		header("Location: ./spectator.php");
	}
	touch($player_lock);
	header("Cache-Control: no-store");
?>
<!DOCTYPE html>
<html>
	<head>
		<title><?php echo "Player number ".$player_number ?></title>
		<style>
			html {
				touch-action: manipulation;
			}

			p, button {
				max-width: 50ch;
				font-family: Roboto, Arial, sans-serif;
				font-size: 1.125rem;
				line-height: 1.5em;
			}

			button {
				color: white;
				background: #369;
				border: 0;
				padding: 0.5rem 1rem;
			}

			button:hover {
				background: #136;
			}

			#amdfc-controller {
				position: absolute;
				top: 50%;
				left: 50%;
				margin-right: -50%;
				transform: translate(-50%, -50%);
				height:77vh;
				width: fit-content
			}
		</style>
	</head>
	<body>
		<div class="container">
			<div id="joy3Div" style="width:200px;height:200px;margin:50px;position:fixed;bottom:30px;left:500px;"></div>
			<script type="module" src="./gamepad-simulator-modified/src/index.js"></script>
			<script type="module" src="./gamepad-simulator-modified/public/js/example.js"></script>
			<script type="module" crossorigin="anonymous">
				var backgrounded = false;
				document.addEventListener('visibilitychange', function() {
					if (document.visibilityState !== "visible") {
						backgrounded = true;
						console.log("background");
						let formData = new FormData();
						formData.append("action", "exit")
						formData.append("playerNumber", "<?php echo $player_number ?>")
						fetch('config.php', {method: "POST", body: formData});
					} else if (document.visibilityState === "visible" && backgrounded === true) {
						console.log("foreground forwarding");
						window.location.href = window.location.protocol + "//" + window.location.host + "/spectator.php";
					}
				});
			</script>
		</div>
	</body>
</html>
