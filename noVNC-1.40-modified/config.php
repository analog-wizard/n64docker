<?php
# add     application/x-httpd-php               php;
# to mime.types

if(!empty($_POST)) {
	if(!empty($_POST['playerNumber']) && !empty($_POST['action'])) {
		if($_POST["action"] == "exit") {
			unlink("player".$_POST['playerNumber'].".lock");
		} else if ($_POST["action"] == "config") {
			$config = fopen('player'.$_POST['playerNumber'].".txt", "w");
			fwrite($config, $_POST['content']);
			fclose($config);

			unlink('master.txt');
			$master = fopen("master.txt", "a");
			$base = fopen("base.txt", "r");
			fwrite($master, fread($base, filesize("base.txt")));
			fclose($base);

			for ($x = 1; $x <= 4; $x++) {
				if(file_exists("player".$x.'.txt')) {
					$temp = fopen("player".$x.'.txt');
					fwrite($master, fread($temp, filesize("player".$x.'.txt')));
					fclose($temp);
				}
			}
		} else if ($_POST["action"] == "game") {
			$config = fopen('/games/./'.$_POST["game"]["name"], "w");
			fwrite($config, $_POST['content']);
			fclose($config);
		}
	}
} else if(!empty($_GET)) {
	if($_GET["action"] == "enter") {
		$player_number = NULL;
		$player_lock = NULL;

		error_log("entered");

		# for all in range 1-4, check to see if there is a lock in place and if not, attempt to reserve
		for ($x = 1; $x <= 4; $x++) {
			# create the final file name of the lock
			$temp_lock = "player".$x.".lock";

			# if the file does not exist, note the number and the completed file name to be locked
			if(!file_exists($temp_lock)) {
				$player_lock = $temp_lock;
				$player_number = $x;
				break;
			}
		}
		if ($player_lock == NULL) {
			header("Location: ./spectator.php");
		}

		# write the lock to the container filesystem
		touch($player_lock);

		echo "HELP";

		error_log("sent");
	}
}
parse_str($_SERVER['QUERY_STRING'], $_GET);
echo "empty get ".empty($_GET)." empty post ".empty($_POST);
echo var_dump($_GET);
?>