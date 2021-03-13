
//おまじない
enchant();

//Main関数
window.onload = function(){
    core = new Core(WIDTH, HEIGHT);
    core.fps = FPS;
    core.preload(ASSETS);
    core.preload(AUDIOS);
    core.score = 0;
    core.keybind(32, 'space');
    //core.keybind(13, 'enter');

    core.onload = function() {
        core.BGM = core.assets['main_BGM'];
        core.pushScene(new TitleScene());
    };
    core.start();
}

//背景初期化
/// 引数1 isCore 表示用処理分けフラグ
var initBG = function(isCore){
    //背景
    var background = new Sprite(WIDTH, HEIGHT);
    background.image = core.assets["img_BG"];
    background.x = 0;
    background.y = 0;
    background.on('enterframe', function() {
        background.y += BG_SPEED;
        if(background.y >= HEIGHT){
            background.y = 0;
        }
    });

    var background2 = new Sprite(WIDTH, HEIGHT);
    background2.image = core.assets["img_BG"];
    background2.x = 0;
    background2.y = -HEIGHT;
    background2.on('enterframe', function() {
        background2.y += BG_SPEED;
        if(background2.y >= 0){
            background2.y = -HEIGHT;
        }
    });

    //表示処理分け
    if(isCore){
        core.rootScene.addChild(background);
        core.rootScene.addChild(background2);
    }else{
        stage.addChild(background);
        stage.addChild(background2);
    }
}

//タイトル
var TitleScene = enchant.Class.create(Scene,{
    initialize : function(){
        Scene.call(this);
        core.score = 0; //初期化

        //背景
        initBG(true);
        //title
        var title =  new Sprite(380,100);
        title.image = core.assets['img_Title'];
        title.x = 0;
        title.y = HEIGHT / 6;
        this.addChild(title);
        //画面説明
        var titleTxt = new Label("画面クリックでスタートします");
        titleTxt.x = 50;
        titleTxt.y = HEIGHT / 2;
        titleTxt.color = 'white';
        titleTxt.font = '18px "Arial"';
        titleTxt.tl.fadeIn(15).fadeOut(15).loop();
        this.addChild(titleTxt);

        //クリックイベント
        this.addEventListener('touchend', function() {
            core.replaceScene(new MainScene());
        });
    }
})

//メイン
var MainScene = enchant.Class.create(Scene,{
    initialize : function(){
        Scene.call(this);
        stage = new Group();
        var time = 0;
        core.frame = 0;
        
        isReStart = false;
        isStop = false;
        var isOnceHpDisplay = false;//ボスHP表示フラグ
        //背景
        initBG(false);

        core.addEventListener('enterframe',function(){
            //敵生成
            if(core.frame % FPS == 0){
                var enemy = new Enemy();
                enemy.rotate(E_ROT);　//回転初期化
                stage.addChild(enemy);
                enemyList.push(enemy);
            }
        });
        
        //Player UI 
        Emeter = new Hp(180, 0);
        stage.addChild(Emeter);


        //プレイヤー
        var player = new Player();
        stage.addChild(player);

        //プレイヤー当たり判定
        this.addEventListener('enterframe',function(){
            for(var i = 0; i < enemyList.length; i++){
                if(player.intersect(enemyList[i])){
                    stage.removeChild(enemyList[i]);
                    delete enemyList[i];
                    //体力更新処理
                    if(Emeter.num > 0){
                        Emeter.UpdateHp();
                    }//死亡処理
                    else if(Emeter.num == 1){
                        isReStart = true;
                        core.replaceScene(new ResultScene());
                    }
                }
            }
        });

        //Boss
        boss = new Boss(WIDTH / 2, -BOSS_SIZE * 3);
        boss.state = BOSS_STATE.IDLE;
        boss.on('enterframe',function(){
            if(isBossStart){
                boss.state = BOSS_STATE.PATROL;
                isBossStart = false;
            }
            if(!boss.isAttack && 
                (Math.abs(player.x - boss.x) <= 120 && 
                Math.abs(player.y - boss.y) <= 120)){
                    boss.isAttack = true;
                    boss.state = BOSS_STATE.ATTACK;
            }
        });
        stage.addChild(boss);

        //UI
        var scoreTxt = new Label("SCORE: 0");
        scoreTxt.x = 0;
        scoreTxt.y = 0;
        scoreTxt.color = 'red';
        scoreTxt.font = '32px "Arial"';
        scoreTxt._style.zIndex = 10;
        //スコア更新
        scoreTxt.on('enterframe', function() {
            this.text = "SCORE: " + core.score.toString();
            //ボス出現
            if(core.score == BOSS_DISPLAY_SCORE) {
                isBossStart = true;
                
                if(!isOnceHpDisplay){
                    //Boss UI
                    Emeter_B = new BossHp(10, HEIGHT - BOSS_SIZE);
                    stage.addChild(Emeter_B);
                    isOnceHpDisplay = true;
                }
            }
            
        });
        stage.addChild(scoreTxt);

        //タイマー
        var timer = new Label("30");
        timer.x = WIDTH / 2 - 20;
        timer.y = HEIGHT - 50;
        timer.color = 'green';
        timer.font = '40px "Arial"';
        timer._style.zIndex = 10;
        //タイマー更新処理
        timer.on('enterframe', function() {
            var progress = parseInt(core.frame / core.fps);
            time = GAME_TIME - progress;
            this.text = time;
            
            if(time <= 0){
                isReStart = true;
                core.replaceScene(new ResultScene());
            }
        });
        stage.addChild(timer);

        //メインオブジェクト表示
        this.addChild(stage);
    },
    onenterframe : function(){
        //BGM再生
        if(core.BGM.duration == core.BGM.currentTime){
            core.BGM.stop();
            core.BGM.play();
            isStop = false;
        }else if(core.BGM.duration != core.BGM.currentTime && !isStop){
            core.BGM.play();
            isStop = true;
        }
        if(core.BGM.src != null){
            core.BGM.src.loop = true;
        }
    }
})

//リザルト
var ResultScene = enchant.Class.create(Scene,{
    initialize : function(){
        Scene.call(this);

        initBG(true);
        
        //RESULT文字
        var result = new Sprite(380,100);
        result.image = core.assets["img_Result"];
        result.x = 0;
        result.y = HEIGHT / 6;
        this.addChild(result);
        
        //score結果
        var resultTxt = new Label();
        resultTxt.text = 'SCORE: ' + core.score.toString();
        resultTxt.x = 100;
        resultTxt.y = HEIGHT / 2;
        resultTxt.color = 'red';
        resultTxt.font = '32px "Arial"';
        this.addChild(resultTxt);

        //説明
        var resultTxt = new Label();
        resultTxt.text = 'クリックしてください';
        resultTxt.x = 100;
        resultTxt.y = HEIGHT - 150;
        resultTxt.color = 'white';
        resultTxt.font = '18px "Arial"';
        resultTxt.tl.fadeIn(15).fadeOut(15).loop();
        this.addChild(resultTxt);
        
        //イベントイベント
        this.addEventListener('touchend', function() {
            core.replaceScene(new TitleScene());
        });
    },
    onenterframe : function(){
        //BGM止める
        if(isReStart){
            core.BGM.stop();
        }
    }
})