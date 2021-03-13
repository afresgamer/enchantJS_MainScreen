
//定数
var PLAYER_SPEED = 0.05;


//おまじない
enchant();

window.onload = function(){
	var game = new Game(320,320);
	game.keybind(32,'a');
	//game.preload('./droid.dae','./enchant.png');
	//game.preload('enchant.png','43447_sample.png','start.png');
	game.score = 0;
	
	game.onload = function(){
		//シーン作成
		var scene = new Scene();
		var scene3d = new Scene3D();
		// ライト
		var light = new DirectionalLight();
		light.color = [1.0, 1.0, 1.0];
		scene3d.setDirectionalLight(light);
			
		// カメラ
		var camera = new Camera3D();                                // カメラ生生
		camera.x = 0; camera.y = 10; camera.z = 50;                 // カメラ位置をセット
		camera.centerX = 0; camera.centerY = 0; camera.centerZ = 0; // 注視点をセット
		scene3d.setCamera(camera);

		//　読み込み失敗
		// var droid = game.assets['./droid.dae'].clone();
		// scene.addChild(droid);
		// var sp = new Sprite3D();
		// sp.set(game.assets['https://github.com/wise9/enchant.js/blob/master/images/droid.dae']);
		// scene3d.addChild(sp);
		var enemies = new Array();
		var bullets = new Array();

		//Player
		var player = new Cylinder();
		player.z = 10;
		scene3d.addChild(player);
		player.rotationSet(new Quat(0, 3, 0, Math.PI));
		player.addEventListener('touchmove', function(e){
			player.x = (e.x - 160) * PLAYER_SPEED;
		});

		// スコア
        	var score = new Label();
		score.x = 2;
		score.y = 16;
        	score.text = "スコア : " + 0;
        	score.addEventListener('enterframe', function(){
            		this.text = "スコア : " + game.score;
        	});
		scene.addChild(score);

		//更新処理
		game.addEventListener('enterframe', function(e){
			//Enemy
			if(this.frame % 40 == 0){
				var enemy = new Cube();
				//エラー
				//enemy.mesh.texture.src = game.assets['enchant.png'];
				enemy.z = -40;
				enemy.x = Math.random() * 10 - 5;
				scene3d.addChild(enemy);
				enemies.push(enemy);
				enemy.addEventListener('enterframe', function(){
					this.z += 0.3;
					//敵当たり判定
					for(var i = 0,l = bullets.length; i < l; i++){
						if(this.intersect(bullets[i])){
							scene3d.removeChild(bullets[i]);
							scene3d.removeChild(this);
							game.score += 10;
						}
						if(bullets[i].z <= -30){
							scene3d.removeChild(bullets[i]);
						}
					}
				});
			}
			//Bullet
			if(this.frame % 40 == 0){
				var bullet = new Sphere();
				bullet.scale(0.3 ,0.3 ,0.3);
				bullet.x = player.x;
				bullet.z = player.z - 10;
				scene3d.addChild(bullet);
				bullets.push(bullet);
				bullet.addEventListener('enterframe', function(){
					this.z -= 0.3;
				});
			}
			for(var i = 0, l = enemies.length; i < l; i++){
				//プレイヤー当たり判定
				if(player.intersect(enemies[i])){
					//ゲーム終了
					//game.replaceScene(titleGame());
					game.stop();
				}
			}
		});
		

		scene.addChild(scene3d);
	}
	game.start();
};
