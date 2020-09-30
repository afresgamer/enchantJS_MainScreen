//2020.7.10　西野作成

//グローバル変数
//Coreを格納
var core;
//ゲーム画面を格納
var gamescene;
//プレイヤーを格納
var player;
//毛糸玉を格納
var yarnball;
//マップを格納
var map;
//for文で生成したマップタイルのスプライトを格納する配列
var MapArray = new Array();
//タッチ開始x座標を格納
var TouchStartX;
//タッチ終了y座標を格納
var TouchStartY;
//道の方向によって進行方法が変わるため、判別用の変数を用意(2020/09/29 菊地作成)
//方向設定用のenum(列挙)
var Direction = {
    Forward : 1,
    Right : 2,
    Backward : 3,
    Left : 4
};
var direction = Direction.Forward;
//回転する角度
var RotType = {
    ForwardRot : 90,
    RightRot : 180,
    BackwardRot : 270,
    LeftRot : 360
}
var rotType = RotType.ForwardRot;

//定数
//スタート画面背景のopacity値
const BackGroundOpacity = 0.8;
//画面のx軸サイズ
const SceneSizeX = 450;
//画面のy軸サイズ
const SceneSizeY = 800;
//スタート画像のx軸サイズ
const StartSizeX = 236;
//スタート画像のy軸サイズ
const StartSizeY = 48;
//スタート画像のx座標
const StartX = 100;
//スタート画像のy座標
const StartY = 400;
//タッチ処理判定の座標移動差
const TouchDifference = 150;
//タッチ処理判定の方向性振れ幅の座標範囲
const TouchWithin = 30;
//プレイヤーのサイズ
const PlayerSize = 128;
//プレイヤーのx座標
const PlayerX = 170;
//プレイヤーのy座標
const PlayerY = 480;
//プレイヤーのフレーム初期値
const PlayerInitialFrame = 28;
//プレイヤーのジャンプ時のy座標移動増減幅
const PlayerJumpY = -15;
//プレイヤーのフレーム
const PlayerFrame = [27, 28, 29, 28];
//プレイヤーのジャンプ時のフレーム
const PlayerJumpFrame = 27;
//プレイヤーの毛糸玉の登り降りスピード
const PlayerUpDownSpeed = 12;
//プレイヤーが毛糸玉から降りた時のy座標
const PlayerDownY = 600;
//毛糸玉のx軸サイズ
const YarnBallSizeX = 118;
//毛糸玉のy軸サイズ
const YarnBallSizeY = 120;
//毛糸玉のx座標
const YarnBallX = 175;
//毛糸玉のy座標
const YarnBallY = 590;
//毛糸玉のフレーム
const YarnBallFrame = 1;
//マップの初期x座標
const MapInitialX = -1522;
//マップの初期y座標
const MapInitialY = -10350;
//マップタイルのサイズ
const MapTileSize = 128;
//for文でマップタイルを表示する際の座標間隔（元画像を拡大した影響でスプライトの端が粗いため、少し重ねている）
const MapTileForSize = 121;
//マップのy座標移動スピード
const MapYSpeed = 12;
//2020/09/28 菊地追記
//マップ回転スピード
const MAP_DEF_SPINSPEED = 3;
//道のフレームナンバー
const MAP_ROAD = 3;
//フィールドマップのフレームナンバー
const MAP_EMPTY = 0;

//アセット
var Assets = {
    ImgPlayer : 'img/chara0.png',             //プレイヤーの画像
    ImgYarn : 'img/yarnball.png',             //毛糸玉の画像
    ImgMap : 'img/map0.png',                  //マップタイルの画像
    ImgMori : 'img/bg_natural_mori.jpg',      //タイトルの背景画像
    ImgStart : 'img/start.png',                //タイトルのスタート画像
    ImgGameOver : 'img/gameover.png'
}