//おまじない
enchant();

//プレイヤークラス
var Player = enchant.Class.create(Sprite,{
    initialize : function(){
        Sprite.call(this);
        this.width = P_SIZE;
        this.height = P_SIZE;
        this.image = core.assets["img_Player"];
        this.x = WIDTH / 2 - this.width / 2;
        this.y = HEIGHT / 2;
        this._style.zIndex = 1;
    },
    onenterframe : function(){
        //移動制御
        this.move();

        if(core.frame % P_SHOT_FRAME == 0){
            if(core.input.space){
                var shot_se = core.assets['shot_SE'].clone();
                shot_se.play();
                var shot = new Shot(this.x + S_SIZE,this.y);
                stage.addChild(shot);
            }  
        }

        for(var i = 0; i < B_bulletList.length; i++){
            if(this.intersect(B_bulletList[i])){
                stage.removeChild(B_bulletList[i]);
                delete B_bulletList[i];
                // if(Emeter.num > 0){

                // }

            }
        }
    },
    //移動範囲制限用関数
    move : function(){
        if(this.x <= 0) this.x = 0;
        if(this.x >= WIDTH - this.width) this.x = WIDTH - this.width;
        if(this.y <= 0) this.y = 0;
        if(this.y >= HEIGHT - this.height) this.y = HEIGHT - this.height;

        if(core.input.left){ this.x -= P_SPEED; }
        if(core.input.right){ this.x += P_SPEED; }
        if(core.input.up){ this.y -= P_SPEED; }
        if(core.input.down){ this.y += P_SPEED; }
    }
});


//敵クラス
 var Enemy = enchant.Class.create(Sprite,{
    initialize : function(){
        Sprite.call(this);
        this.width = E_SIZE;
        this.height = E_SIZE;
        this.frame = 0;
        this.image = core.assets["img_Enemy"];
        this.x = this.width + (Math.random() *  (WIDTH - this.width));
        this.y = -(this.height  * 2) + Math.random() * (this.height  * 2);
        this._style.zIndex = 1;
    },
    onenterframe : function(){
        this.y += E_SPEED;
        if(this.y >= HEIGHT) {
            this.initPos();
        }
    },//位置初期化
    initPos : function(){
        this.x = this.width + (Math.random() * (WIDTH - this.width));
        this.y = -(this.height  * 2) + Math.random() * (this.height  * 2);
    }
});

//弾クラス
var Shot = enchant.Class.create(Sprite,{
    initialize : function(x, y){
        Sprite.call(this);
        this.image = core.assets["img_Shot"];
        this.width = S_SIZE;
        this.height = S_SIZE;
        this.x = x;
        this.y = y;
        this.scaleX = 2;
        this.scaleY = 2;
        this.frame = 12;
        this._style.zIndex = 1;
    },
    onenterframe : function(){
        this.y -= S_SPEED;
        if(this.y <= 0){//必要なくなったら破棄
            stage.removeChild(this);
        }

        //敵との当たり判定
        for(var i = 0; i < enemyList.length; i++){
            if(this.intersect(enemyList[i])){
                stage.removeChild(this);
                stage.removeChild(enemyList[i]);
                delete enemyList[i];
                core.score += E_SCORE;

                var effect = new DestoryEffect(this.x, this.y);
                stage.addChild(effect);
            }
        }

        //ボス当たり判定あまりよろしくないが仕方ない
        if(boss == null) return;
        //ボスとの当たり判定
        if(this.intersect(boss)){
            stage.removeChild(this);
            core.score += B_SCORE;
            //体力更新処理
            if(Emeter_B.num > 0){
                Emeter_B.UpdateBossHp();
            }else if(Emeter_B.num == 0){
                Emeter_B.num = 0;
                stage.removeChild(boss);
                boss = null; //気に食わないが仕方なくやるか(悔しい)
                stage.removeChild(Emeter_B);
                isBossStart = false;
            }
        }
    }
});

//エフェクトクラス
var DestoryEffect = enchant.Class.create(Sprite,{
    initialize : function(x, y){
        Sprite.call(this, 16, 16);
        this.frame = 0;
        this.scaleX = 2;
        this.scaleY = 2;
        this.x = x;
        this.y = y;
        this.image = core.assets["img_Effect"];
        this._style.zIndex = 1;
        var bomb_se = core.assets['bomb_SE'];
        bomb_se.play();
    },
    onenterframe : function(){
        this.frame++;
        if(this.frame == 5){//必要なくなったら破棄
            stage.removeChild(this);
        }
    }
});

//HPゲージクラス
var Hp = enchant.Class.create(Group,{
    initialize : function(x, y){
        Group.call(this);
        this.x = x;
        this.y = y;
        this.num = P_HP;
        this.scaleX = 2;
        this.scaleY = 2;
        var hpLabel = new Label();
        hpLabel.text = 'HP:';
        hpLabel.color = 'white';
        hpLabel._style.zIndex = 10;
        this.addChild(hpLabel);
        hpBar = new Sprite(54,15);
        hpBar.image = core.assets['img_HpFrame'];
        hpBar.x = 30;
        hpBar._style.zIndex = 10;
        this.addChild(hpBar);
        hpScale = new Sprite(1,11);
        hpScale.image = core.assets['img_Hp'];
        hpScale.scaleX = this.num;
        hpScale.x = hpBar.x + (this.num / 2) + 1;
        hpScale.y = 2;
        hpScale._style.zIndex = 10;
        this.addChild(hpScale);
    },
    //Hpゲージ更新処理
    UpdateHp : function(){
        this.num -= E_SCORE;
        hpScale.scaleX = this.num;
        hpScale.x = hpBar.x + (this.num / 2) + 1;
        //死亡処理
        if(this.num == 0){
            isReStart = true;
            core.replaceScene(new ResultScene());
        }
    }
});

//HPゲージクラス
var BossHp = enchant.Class.create(Group,{
    initialize : function(x, y){
        Group.call(this);
        this.x = x;
        this.y = y;
        this.num = BOSS_HP;
        this.scaleX = 2;
        this.scaleY = 2;
        var hpLabel = new Label();
        hpLabel.text = 'HP:';
        hpLabel.color = 'white';
        hpLabel._style.zIndex = 10;
        this.addChild(hpLabel);
        B_hpBar = new Sprite(54,15);
        B_hpBar.image = core.assets['img_HpFrame'];
        B_hpBar.x = 30;
        B_hpBar._style.zIndex = 10;
        this.addChild(B_hpBar);
        B_hpScale = new Sprite(1,11);
        B_hpScale.image = core.assets['img_Hp'];
        B_hpScale.scaleX = this.num;
        B_hpScale.x = hpBar.x + (this.num / 2) + 1;
        B_hpScale.y = 2;
        B_hpScale._style.zIndex = 10;
        this.addChild(B_hpScale);
    },
    //Hpゲージ更新処理
    UpdateBossHp : function(){
        this.num -= B_SCORE;
        B_hpScale.scaleX = this.num;
        B_hpScale.x = B_hpBar.x + (this.num / 2) + 1;
        //死亡処理
        if(this.num == 0){
            this.num = 0;
            stage.removeChild(boss);
            stage.removeChild(Emeter_B);
            isBossStart = false;
        }
    }
});

var Boss = enchant.Class.create(Sprite,{
    initialize : function(x, y){
        Sprite.call(this);
        this.frame = 0; //フレーム数を初期化
        this.time = 0; //ボスクラスカウント変数
        this.isAttack = false;　//ボス攻撃開始フラグ
        this.x = x;
        this.y = y;
        this.isMoveDirectionX = false; //X移動反転用フラグ
        this.isMoveDirectionY = false; //Y移動反転用フラグ
        this.rad = 0;
        this.state = BOSS_STATE.IDLE; //ボスの状態を設定
        this.width = BOSS_SIZE;
        this.height = BOSS_SIZE;
        this.image = core.assets["img_Boss"];
        this._style.zIndex = 1;
    },
    onenterframe : function(){
        //ボスオブジェクトカウント制御
        this.time++;
        if(this.time >= 360) this.time = 0;
        //ボス状態制御
        this.Update();
    },
    Update : function(){
        switch(this.state){
            case BOSS_STATE.IDLE:
                //何もしない
                break;
            case BOSS_STATE.PATROL:
                this.Patrol();　//巡回しながらプレイヤーを探す
                break;
            case BOSS_STATE.ATTACK:
                this.Attack();　//プレイヤーを見つけたら攻撃する
                break;
        }
    },
    Attack : function(){
        if (this.time % B_SHOT_DURATION == 0) {    //shotIntervalフレーム経ったら弾発射
            const bullet = this.createNBullet(this);  //弾を自分の座標に設置
            stage.addChild(bullet);
        }

        if(this.state == BOSS_STATE.ATTACK){
            this.x += B_SPEED;
            if(this.x >= WIDTH - this.width){
                this.isMoveDirectionX = true;
            }
            if(this.x <= 0){
                this.isMoveDirectionX = false;
            }
            if(this.isMoveDirectionX){
                this.x -= B_SPEED * 2;
            }
        }
    },
    Patrol : function(){
        //移動制御
        this.y += B_SPEED;
        //this.x += Math.sin( (this.time >= 0 || this.time <= 360) ? this.time : 0 );
        if(this.y >= HEIGHT - this.height / 2){
            this.isMoveDirection = true;
        }
        if(this.y <= 0){
            this.isMoveDirection = false;
        }
        if(this.isMoveDirection){
            this.y -= B_SPEED * 2;
        }

    },//弾作成関数群
    createNBullet : function(sprite){
        const bullet = new Sprite(16, 16);
        bullet.image = core.assets["img_Shot"];
        bullet.frame = 13;
        bullet.moveTo(sprite.x + sprite.width / 2, sprite.y + sprite.height / 2);
        //毎フレーム毎に実行する関数
        bullet.onenterframe = function () {
            this.y += B_SHOT_SPEED;    //真上に向けて移動する
            //画面外に出たら消す
            if(bullet.x <= 0 || bullet.y <= 0 || bullet.x >= WIDTH || bullet.y >= HEIGHT){
                this.parentNode.removeChild(this);
            }
        }
        B_bulletList.push(bullet);
        return bullet; //上で作成したspriteを返す
    },
    createRotBullet : function(sprite){
        const bullet = new Sprite(16, 16);
        bullet.image = core.assets["img_Shot"];
        bullet.frame = 13;
        bullet.moveTo(sprite.x + sprite.width / 2 , sprite.y + sprite.height / 2);
        bullet.rad = (sprite.frame / B_SHOT_DURATION) * ROTATE_INTERVAL;    //現在の時間から角度を生成
        bullet.onenterframe = function () {
            this.x += Math.cos(this.rad) * B_SHOT_SPEED;    //移動角度のcosがX軸移動方向
            this.y += Math.sin(this.rad) * B_SHOT_SPEED;    //移動角度のsinがY軸移動方向
            if(bullet.x <= 0 || bullet.y <= 0 || bullet.x >= WIDTH || bullet.y >= HEIGHT){
                this.parentNode.removeChild(this);
            }
        }
        B_bulletList.push(bullet);
        return bullet; //上で作成したspriteを返す
    }
})