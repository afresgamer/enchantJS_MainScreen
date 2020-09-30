//2020.7.10　西野作成

//enchant.jsの初期化
enchant();

window.onload = function() {
    core = new Core(450, 800);
    core.fps = 30;
    core.preload(Assets);
    core.onload = function() {
        var titlescene = new TestTitleScene();
        core.replaceScene(titlescene);
    }
    core.start();
}