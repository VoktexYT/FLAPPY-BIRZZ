import * as PIXI from 'pixi.js';
import * as TWEEN from 'tween.js'
import Game from './game';


window.onload = () => {
    const app = new PIXI.Application({ background: '#000', width: 350, height: 600 });
    document.body.appendChild(app.view);

    PIXI.Ticker.shared.maxFPS = 120;

    const game_scene = new PIXI.Container();
    app.stage.addChild(game_scene);

    game_scene.alpha = 1;

    const fadeOutTween = new TWEEN.Tween(game_scene)
    .to({ alpha: 0 }, 200)
    .onComplete(() => {
        setTimeout(() => {
            const tween = new TWEEN.Tween(game_scene)
                .to({ alpha: 1 }, 200)
            tween.start();
        }, 1000);
    });
    

    const GAME = new Game(app, game_scene, fadeOutTween, );
        GAME.start();
        GAME.update(TWEEN);
}