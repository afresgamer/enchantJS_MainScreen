
//定数
const WIDTH = 380;
const HEIGHT = 720;
const FPS = 24;
const BG_SPEED = 3;  //背景のスピード
const P_SIZE = 60;  //プレイヤーのサイズ
const P_SPEED = 5;  //プレイヤースピード
const P_SHOT_FRAME = 12;  //プレイヤーの弾発射間隔
const S_SIZE = 16;  //弾のサイズ
const S_SPEED = 5;  //弾のスピード
const E_SPEED = 5;  //敵のスピード
const E_SIZE = 40;  //敵のサイズ
const E_ROT = -90;  //敵の回転補正
const E_SCORE = 5;  //敵のポイント点
const E_POWER = 5;  //敵へのダメージ量
const GAME_TIME = 60;  //制限時間
const BOSS_SIZE = 120;  //ボスのサイズ
const DEG_TO_RAD = (2 * Math.PI) / 360;  //上の度数法をRadに変換する為の数値
const B_SPEED = 2;  //ボスのスピード
const B_SCORE = 10;  //ボスのポイント点
const B_POWER = 5;  //ボスへのダメージ量
const B_SHOT_SPEED = 5;　 //ボスの弾丸スピード
const B_SHOT_DURATION = 20;  //ボスの弾発射間隔
const ROTATE_INTERVAL = 30 * DEG_TO_RAD;  //弾の回転移動角度(30度)
const BOSS_HP = 120;  //ボスの体力
const BOSS_DISPLAY_SCORE = 100;  //ボス出現条件のスコア

var P_HP = 50;  //プレイヤーのHP
var isBossStart = false;  //ボス戦開始フラグ

//画像データ
var ASSETS = {
    img_Title: 'Title.png',
    img_Player:'sentouki.gif',
    img_BG:'img_post152_04.jpg',
    img_Enemy:'enemy1.png',
    img_Shot:'graphic.png',
    img_Effect:'effect0.gif',
    img_Hp:'20110720225859.png',
    img_HpFrame:'20110720225900.png',
    img_Result:'Result.png',
    img_Boss:'Boss1.png'
};

//サウンドデータ
var AUDIOS = {
    main_BGM:'Electric_Highway.mp3',
    shot_SE:'shoot1.mp3',
    bomb_SE:'bomb.mp3'
}

//Boss状態遷移変数
var BOSS_STATE = {
    IDLE : 1, //待機
    PATROL : 2,  //巡回
    ATTACK : 3,   //攻撃
}

//グローバル変数
var core;
var enemyList = new Array(); //敵格納リスト
var B_bulletList = new Array(); //ボス弾丸リスト
var Emeter; //HPデータ(Player)
var Emeter_B; //HPデータ(Boss)
var hpBar; //HP画像データ保存用変数
var hpScale; //HP枠画像データ保存用変数
var B_hpBar; //HP画像データ保存用変数(BOSS)
var B_hpScale; //HP枠画像データ保存用変数(BOSS)
var isReStart = false; //再スタート用フラグ
var isStop = false; //サウンド止める用フラグ
var stage; //メイン用グループオブジェクト
var boss; //ボスオブジェクト
