import * as PIXI from 'pixi.js';

import Player from './player';
import Gravity from './gravity';
import Pipes from './pipes';
import Sprite from './sprite';


function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


const app = new PIXI.Application({ background: '#1099bb', width: 350, height: 600 });
document.body.appendChild(app.view);

const game_scene = new PIXI.Container();
app.stage.addChild(game_scene);

let endGame = false;

const gravity = new Gravity()
    .setGravity(0.001);

let time = 0;
let Vi = 0;

let onmouse = false;
let onceMouseClick = true;

let difficult = [150, 200]; // hard to easy
let diff_idx = difficult[0];

//////////////// KEY ////////////////////
document.addEventListener("mousedown", () => {
    onmouse = true;
});

document.addEventListener("mouseup", () => {
    onmouse = false;
    onceMouseClick = true;
});


/////////////// SPRITE //////////////////////
const player = new Player()
    .setPosition(100, 200)
    .setAnchor(0.5)
    .setVelocity(2)
    .setScale(0.4, 0.4)
    .load(game_scene);

const top_pipe = new Pipes()
    .setPosition(400, getRandomNumber(80, 350))
    .setVelocity(2)
    .setScale(0.5, -0.5)
    .load(game_scene);

const bottom_pipe = new Pipes()
    .setPosition(400, top_pipe.sprite.y + diff_idx)
    .setVelocity(2)
    .setScale(0.5, 0.5)
    .load(game_scene);

const floor = new Sprite(PIXI.Sprite.from("static/env/grass.png"))
    .setPosition(0, 220)
    .setScale(1.5)
    .setVelocity(2)
    .load(game_scene);

const defaultXpos = floor.sprite.width;

const floor2 = new Sprite(PIXI.Sprite.from("static/env/grass.png"))
    .setPosition(defaultXpos, 220)
    .setScale(1.5)
    .setVelocity(2)
    .load(game_scene);

/////////////// SCORE ////////////////
const text = new PIXI.Text('0', {
    fontFamily: 'monospace',
    fontSize: 24,
    fill: 0xFFFFFF,
    align: 'center',
});

text.x = 10;
text.y = 10;

game_scene.addChild(text)

let chrono = new Date().getSeconds()

/////////////////// GAME OVER ///////////////////
const game_over = new PIXI.Text('Game Over!', {
    fontFamily: 'monospace',
    fontSize: 24,
    fill: 0xFF0000,
    align: 'center',
});
game_over.x = app.screen.width / 2;
game_over.y = app.screen.height / 2
game_over.anchor.set(0.5);

function death_player_event() {
    game_scene.removeChildren();
    game_scene.addChild(game_over)
    endGame = true;
    setTimeout(() => {
        window.location.reload()
    }, 2000);
}
/////////////// LOOP ////////////////////
app.ticker.add((delta) => {
    if (!endGame) {
        text.text = new Date().getSeconds() - chrono;

        ////////// FLOOR SLIDE ////////////////
        floor.sprite.x -= floor.velocity;
        floor2.sprite.x -= floor2.velocity;

        if (floor.sprite.x < -floor.sprite.width) {
            floor.sprite.x = defaultXpos;
        }

        if (floor2.sprite.x < -floor2.sprite.width) {
            floor2.sprite.x = defaultXpos;
        }

        ////////////// GRAVITY ///////////////
        let lastY = player.sprite.y;

        if (player.sprite.y + player.sprite.height / 2 < app.screen.height) {
            player.sprite.y -= gravity.apply(Vi, time) * delta;
        } else {
            death_player_event();
        }

        ///////////// PLAYER JUMP /////////////////
        if (onmouse && onceMouseClick) {
            onceMouseClick = false;
            time = 160;
            Vi = 0.1;
            player.sprite.gotoAndStop(0);
            player.sprite.play()
        }

        if (lastY > player.sprite.y && player.sprite.rotation > -0.5) {// in jump
            player.sprite.rotation -= 0.1 * delta;
        }

        if (lastY < player.sprite.y && player.sprite.rotation < 0.5) {
            player.sprite.rotation += 0.1 * delta;
        }

        /////////// PLAYER ANIMATION ////////////////
        player.sprite.update(delta);

        ///////////// PIPE SLIDE //////////////////
        bottom_pipe.update(delta);
        top_pipe.update(delta);

        if (bottom_pipe.sprite.x < -bottom_pipe.sprite.width) {
            let new_y = getRandomNumber(80, 350);
            top_pipe.sprite.y = new_y;
            bottom_pipe.sprite.y = top_pipe.sprite.y + diff_idx;
        }

        //////////// DEATH PLAYER EVENT /////////////
        const playerIsDeath = (
            player.deathPipes("bottom", bottom_pipe) ||
            player.deathPipes("top", top_pipe)
        );

        if (playerIsDeath) {
            death_player_event();
        }

        /////////////// UPDATE TIME /////////////////
        time++;
    }
});