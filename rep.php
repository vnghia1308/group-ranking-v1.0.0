<?php
/* Developed by Vy Nghia */
require_once ('server/config.php');

/*==============================*/
ini_set('memory_limit', '512M');
ini_set('post_max_size', '128M');
ini_set('max_input_vars', 10000000);
/*==============================*/

switch($_GET['to']){
	case 'json':
		if(isset($_POST['data']) && $_GET['secret'] == SECRET){
			$rankfile = fopen("rank.json", "w") or die("Unable to open file!");
			fwrite($rankfile, json_encode($_POST['data']));
			fclose($rankfile);

			echo "Post array count " . count($_POST['data']);
		}
		break;

	case 'bot':
		if(isset($_GET['user'])){
			$accessToken = access_token;
			$check = json_decode(file_get_contents("https://graph.facebook.com/{$_GET['user']}?access_token=$accessToken"), true);
			$ranks = json_decode(file_get_contents("rank.json"), true);

			if(isset($check['id'])){
				foreach($ranks as $rank){
					if($rank['id'] == $check['id']){
						$rankNumber = $rank['rank'];
						$rankPoints = $rank['points'];

						$rankMessage =  "Thành viên {$check['name']} đang đứng #$rankNumber với $rankPoints điểm";
					}
				}

				if(empty($rankNumber) && empty($rankPoints))
					$rankMessage =  "Thành viên này chưa được xếp hạng hoặc chưa tham gia nhóm!";

				$message = array(
							"messages" => array(
								array(
									"text" => $rankMessage
								)
							)
						);

				echo json_encode($message);
			} else {
				$message = array(
							"messages" => array(
								array(
									"text" => "Xin lỗi tài khoản không tồn tại!"
								)
							)
						);

				echo json_encode($message);
			}
		}
		break;
		
		case 'web':
			$accessToken = access_token;
			$check = json_decode(file_get_contents("https://graph.facebook.com/{$_POST['user']}?access_token=$accessToken"), true);
			$ranks = json_decode(file_get_contents("rank.json"), true);
			
			if(isset($check['id'])){
				foreach($ranks as $rank){
						if($rank['id'] == $check['id']){
							$rankNumber = $rank['rank'];
							$rankPoints = $rank['points'];
						}
					}
				if(isset($rankNumber) && isset($rankPoints))
					$status = array('error' => false, 'name' => $check['name'], 'rank' => $rankNumber, 'point' => $rankPoints);
				else
					$status = array('error' => true, 'message' => 'Tài khoản này chưa được xếp hạng hoặc chưa tham gia nhóm!');
			} else
				$status = array('error' => true, 'message' => 'Không tìm thấy tài khoản này!');
			
			echo json_encode($status);
}
