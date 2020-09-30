//テストタイトル画面、背景画像、テストスタート画像、ゲーム画面、プレイヤー、毛糸玉、テストスプライトグループマップ
//2020.8.30　西野作成

enchant();      //enchant.jsライブラリの初期化

//★★★　テストタイトル画面クラス　★★★
var TestTitleScene = Class.create(Scene, {
    initialize : function() {
        Scene.call(this);
        var BackGround = new BackGroundSprite();
        BackGround.opacity = BackGroundOpacity;
        this.addChild(BackGround);
        var Start = new TestStartSprite();
        this.addChild(Start);
    }
});

//★★★　背景画像クラス　★★★
var BackGroundSprite = Class.create(Sprite, {
    initialize : function() {
        Sprite.call(this, SceneSizeX, SceneSizeY);
        this.x = 0;
        this.y = 0;
        this.image = core.assets['ImgMori'];
    }
});

//★★★　テストスタート画像クラス　★★★
var TestStartSprite = Class.create(Sprite, {
    initialize : function() {
        Sprite.call(this, StartSizeX, StartSizeY);
        this.x = StartX;
        this.y = StartY;
        this.image = core.assets['ImgStart'];

        this.on(Event.TOUCH_START, function() {
            gamescene = new GameScene();
            core.replaceScene(gamescene);
        });
    }
});

//★★★　テストゲームオーバー画像クラス　★★★
var TestGameOverSprite = Class.create(Sprite, {
    initialize : function() {
        Sprite.call(this, 189, 97);
        this.x = StartX;
        this.y = StartY;
        this.image = core.assets['ImgGameOver'];
    }
});

//★★★　ゲーム画面クラス　★★★
var GameScene = Class.create(Scene, {
    initialize : function() {
        Scene.call(this);
        this.isOnceSpin = false;
        this.isArrangeMove = false;
        this.count = 0;
        direction = Direction.Forward;
        map = new TestSpriteGroupMap();
        this.addChild(map);
        map.isRun = true;
        yarnball = new YarnBall();
        this.addChild(yarnball);
        player = new Player();
        this.addChild(player);
    },

    onenterframe : function() {
        //タッチ開始座標の取得
        this.on(Event.TOUCH_START, function(e) {
            this.isOnceSpin = false;
            this.isArrangeMove = false;
            TouchStartX = e.x;
            TouchStartY = e.y;
        });

        //タッチ移動処理
        this.on(Event.TOUCH_MOVE, function(e) {
            //下ドラッグ
            //タッチ開始y座標よりタッチ終了y座標が150ピクセル以上大きい
            //タッチ終了x座標がタッチ開始x座標の±30ピクセルの範囲以内
            if (TouchStartY + TouchDifference <= e.y && e.x >= TouchStartX - TouchWithin && e.x <= TouchStartX + TouchWithin) 
            {
                if (!player.DownFlg) 
                {
                    player.DownFlg = true;      //毛糸玉から降りる動作を始める
                }
            }
        });

        //タッチ終了処理
        this.on(Event.TOUCH_END, function(e) {
            //上フリック
            //タッチ開始y座標よりタッチ終了y座標が150ピクセル以上小さい
            //タッチ終了x座標がタッチ開始x座標の±30ピクセルの範囲以内
            if (TouchStartY - TouchDifference >= e.y && e.x >= TouchStartX - TouchWithin && e.x <= TouchStartX + TouchWithin) 
            {
                if (!player.JumpFlg) 
                {
                    player.JumpY = PlayerJumpY;      //プレイヤーのJumpYの値を再設定
                    player.JumpFlg = true;           //ジャンプさせる
                }
            }
            //左フリック
            //タッチ開始x座標よりタッチ終了x座標が150ピクセル以上小さい
            //タッチ終了y座標がタッチ開始y座標の±30ピクセルの範囲以内
            if (TouchStartX - TouchDifference >= e.x && e.y >= TouchStartY - TouchWithin && e.y <= TouchStartY + TouchWithin) 
            {
                
            }
            //2020/09/28　タッチ処理修正(菊地)
            //右フリック
            //タッチ開始x座標よりタッチ終了x座標が150ピクセル以上大きい
            //タッチ終了y座標がタッチ開始y座標の±30ピクセルの範囲以内
            if (TouchStartX + TouchDifference <= e.x && e.y >= TouchStartY - TouchWithin && e.y <= TouchStartY + TouchWithin) 
            {
                //回転させます
                if(map.isSpin && !this.isOnceSpin){
                    map.isRun = false;
                    map.Rotate(-this.SetRot());
                    //console.log(map.rotation);
                }
            }
            //下ドラッグ終了
             if (player.DownFlg == true || player.FullDownFlg == true) 
            {
                player.DownFlg = false;          //毛糸玉から降りる動作をやめる
                player.FullDownFlg = false;      //毛糸玉から完全に降りていない
                player.UpFlg = true;             //毛糸玉に登る動作を始める
            }
        });

        //回転タイプ決定
        //rotType = this.SetRot();
        
        if(this.isOnceSpin){
            //回転入力処理が終わったら走行処理を再開
            this.count++;
            direction += 1;
            if(direction > Direction.Left){
                direction = Direction.Forward;
            }
            this.isOnceSpin = false;
            map.isSpin = false;
            // console.log(direction);
            // console.log("Player X:" + player.x + "Player Y:" + player.y);
            // console.log(map.originX);
            // console.log(map.originY);

            if(!this.isArrangeMove){
                this.isArrangeMove = true;
            }
            // core.stop();
            // setTimeout("core.resume()", 1000);
            //map.x -= MapYSpeed / MapYSpeed;
            //setTimeout("console.log('5秒間待ちました')", 5000);
 
            //map.isRun = true;
        }
    },

    //回転する角度を決定する
    SetRot : function(){
        switch(direction){
            case Direction.Forward:
                rotType = RotType.ForwardRot;
                break;
            case Direction.Right:
                rotType = RotType.RightRot;
                break;
            case Direction.Backward:
                rotType = RotType.BackwardRot;
                break;
            case Direction.Left:
                rotType = RotType.LeftRot;
                break;
        }
        //console.log(direction);

        return rotType;
    }
});

//★★★　プレイヤークラス　★★★
var Player = Class.create(Sprite, {
    initialize : function() {
        Sprite.call(this, PlayerSize, PlayerSize);
        this.x = PlayerX;
        this.y = PlayerY;
        this.frame = PlayerInitialFrame;
        this.image = core.assets['ImgPlayer'];
        this.JumpFlg = false;          //ジャンプしているか判定するフラグ･･･true = ジャンプしている    false = ジャンプしていない
        this.JumpY = PlayerJumpY;      //ジャンプのy座標の移動増減幅の初期値
        this.DownFlg = false;          //毛糸玉から降りる動作中か判定するフラグ･･･true = 降りている    false = 降りていない
        this.FullDownFlg = false;      //毛糸玉から完全に降りているか判定するフラグ･･･true = 降りている    false = 降りていない
        this.UpFlg = false;            //毛糸玉に登る動作中か判定するフラグ･･･true = 登っている    false = 登っていない
    },

    onenterframe : function() {
        this.frame = PlayerFrame;
        this.jump();
        this.Down();
        this.Up();
    },

    //ジャンプさせるメソッド
    jump : function() {
        if (this.JumpFlg) {
            this.y += this.JumpY++;
            this.frame = PlayerJumpFrame;
            if (this.y > PlayerY) {
                this.y = PlayerY;
                this.JumpFlg = false;      //ジャンプをやめる
            }
        }
    },

    //毛糸玉から降りる動作をするためのメソッド
    Down : function() {
        if (this.DownFlg) {
            this.y += PlayerUpDownSpeed;
            if (this.y > PlayerDownY) {
                this.y = PlayerDownY;
                this.DownFlg = false;         //毛糸玉からおりる動作をやめる
                this.FullDownFlg = true;      //毛糸玉から完全におりている
            }
        }
    },

    //毛糸玉に登る動作をするためのメソッド
    Up : function() {
        if (this.UpFlg) {
            this.y -= PlayerUpDownSpeed;
            if (this.y < PlayerY) {
                this.y = PlayerY;
                this.UpFlg = false;      //毛糸玉に登る動作をやめる
            }
        }
    }
});

//★★★　毛糸玉クラス　★★★
var YarnBall = Class.create(Sprite, {
    initialize : function() {
        Sprite.call(this, YarnBallSizeX, YarnBallSizeY);
        this.x = YarnBallX;
        this.y = YarnBallY;
        this.frame = YarnBallFrame;
        this.image = core.assets['ImgYarn'];
    }
});

//2020/09/28　テストマップクラス修正(菊地)
//★★★　テストスプライトグループマップクラス　★★★
var TestSpriteGroupMap = Class.create(Group, {
    initialize : function() {
        Group.call(this);
        this.x = MapInitialX;
        this.y = MapInitialY;
        //this.corner = 0;
        //回転する原点を設定
        this.originX = null;
        this.originY = null;
        //走っているかどうか
        this.isRun = false;
        //回転用フラグ(false:回転してない,true:回転している)
        this.isSpin = false;
        this.rotation = 0;
        this.spinSpeed = MAP_DEF_SPINSPEED;
        for (var a = 0; a < mapdata.length; a++) {
            for (var b = 0; b < mapdata[a].length; b++) {
                //マップ配置
                var sprite = new TestMapTip(b * MapTileForSize, a * MapTileForSize, mapdata[a][b]);
                //当たり判定設定
                if(this.IsSpinPlace(a, b)){ MapArray.push(sprite); }

                //当たり判定を拡張処理(回転する判定が厳しかったため)
                if(MapArray.filter(data => data.x == sprite.x && data.y == sprite.y).length > 0)
                {
                    //既に存在するデータを削除してから入れ直す
                    MapArray.forEach((item, index) => {
                        if(item.x == sprite.x && item.y == sprite.y) {
                            MapArray.splice(index, 1);
                        }
                    });
                    MapArray.push(sprite);
                }
                this.addChild(sprite);
                //console.log(MapArray.length);
            }
        }
    },

    onenterframe : function() {
        if(gamescene.isArrangeMove){
            gamescene.isArrangeMove = false;
            this.y += MapTileSize;
            this.isRun = true;
            //setTimeout("console.log('2秒間待ちます')",5000);
        }

        if(this.isRun){
            this.y += MapYSpeed;
        }
    },

    //回転用関数(原点が設定されてない場合は何もしない)
    Rotate : function (angle) {
        if(this.originX == 0 || this.originY == 0){ return; }
        
        this.rotation += Math.sign(angle) * this.spinSpeed;
        //既に到達目標角度以上になったら目標角度に設定
        if(this.rotation > 0){
            if(this.rotation >= angle) 
            { 
                this.rotation = angle;
                gamescene.isOnceSpin = true;
            }
        }
        else{
            if(this.rotation <= angle) 
            { 
                this.rotation = angle;
                gamescene.isOnceSpin = true;
            }
        }
    },

    //回転出来る場所かどうか
    IsSpinPlace : function (x, y){
        if(x - 1 < 0){ return false; }
        if(x + 1 > mapdata.length - 1){ return false; }
        if(y - 1 < 0){ return false; }
        if(y + 1 > mapdata[x].length - 1){ return false; }

        var nowFrame = mapdata[x][y];          //現在の場所
        var forwardFrame = mapdata[x - 1][y];  //前の場所
        var backwardFrame = mapdata[x + 1][y]; //後ろの場所
        var rightFrame = mapdata[x][y + 1];    //右の場所
        var leftFrame = mapdata[x][y - 1];     //左の場所

        //現在の場所が道かどうか判定
        if(nowFrame != MAP_ROAD){ return false; }

        //前後の道があるかどうか判定
        if(nowFrame == MAP_ROAD && forwardFrame != MAP_ROAD && backwardFrame != MAP_ROAD){ return false; }

        //左右の道があるかどうか判定
        if(nowFrame == MAP_ROAD && rightFrame != MAP_ROAD && leftFrame != MAP_ROAD){ return false; }

        //現在と後ろに道があるかどうか判定
        if(nowFrame == MAP_ROAD && backwardFrame == MAP_ROAD){
            //現在と後ろに道があって左右どちらも道がないかどうか判定
            if(rightFrame != MAP_ROAD && leftFrame != MAP_ROAD){ return false; }
            //現在と後ろに道があって左右に道がある場合は回転判定あり
            if(rightFrame == MAP_ROAD)
            {
                //近くにあるタイルも判定ありにする
                var nearMap = new TestMapTip(y * MapTileForSize, (x + 1) * MapTileForSize, MAP_ROAD);
                MapArray.push(nearMap);
                nearMap.x = (y + 1) * MapTileForSize;
                nearMap.y = x * MapTileForSize;
                MapArray.push(nearMap);

                return true; 
            }
            if(leftFrame == MAP_ROAD)
            {
                //近くにあるタイルも判定ありにする
                var nearMap = new TestMapTip(y * MapTileForSize, (x + 1) * MapTileForSize, MAP_ROAD);
                MapArray.push(nearMap);
                nearMap.x = (y - 1) * MapTileForSize;
                nearMap.y = x * MapTileForSize;
                MapArray.push(nearMap);

                return true; 
            }
        }

        //現在と前に道があるかどうか判定
        if(nowFrame == MAP_ROAD && forwardFrame == MAP_ROAD){
            //現在と前に道があって左右どちらもに道がないかどうか判定
            if(rightFrame != MAP_ROAD && leftFrame != MAP_ROAD){ return false; }
            //現在と前に道があって左右に道がある場合は回転判定あり
            if(rightFrame == MAP_ROAD)
            {
                //近くにあるタイルも判定ありにする
                var nearMap = new TestMapTip(y * MapTileForSize, (x + 1) * MapTileForSize, MAP_ROAD);
                MapArray.push(nearMap);
                nearMap.x = (y + 1) * MapTileForSize;
                nearMap.y = x * MapTileForSize;
                MapArray.push(nearMap);

                return true; 
            }
            if(leftFrame == MAP_ROAD)
            {
                //近くにあるタイルも判定ありにする
                var nearMap = new TestMapTip(y * MapTileForSize, (x + 1) * MapTileForSize, MAP_ROAD);
                MapArray.push(nearMap);
                nearMap.x = (y - 1) * MapTileForSize;
                nearMap.y = x * MapTileForSize;
                MapArray.push(nearMap);

                return true; 
            }
        }
    }
});

//★★★　テストスプライトマップチップクラス　★★★
var TestMapTip = Class.create(Sprite, { 
    initialize : function(_x, _y, mapTipFrame) {
        Sprite.call(this, MapTileSize, MapTileSize);
        this.x = _x;
        this.y = _y;
        this.frame = mapTipFrame;
        this.image = core.assets['ImgMap'];
    },

    onenterframe : function() {
        if(this.frame === MAP_ROAD){
            if(this.intersect(yarnball)){ 
                map.isSpin = true;
                map.originX = this.x;
                map.originY = this.y;
            }
            else{ map.isSpin = false; }
        }

        // if(core.actualFps >= 60){
        //     //ゲームオーバー処理(仮なので適当)
        //     if(this.frame == MAP_EMPTY){
        //         if(this.intersect(yarnball)){
        //             map.isRun = false;
        //             //本来はここでリザルト画面に遷移
        //             //今はラベル出してます
        //             var gameover = new TestGameOverSprite();
        //             gamescene.addChild(gameover);
        //         }
        //     }
        // }
    },
});