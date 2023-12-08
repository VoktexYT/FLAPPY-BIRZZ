import * as PIXI from 'pixi.js';

import Player from './player';
import Gravity from './gravity';
import Pipes from './pipes';
import Sprite from './sprite';
import { Howl, Howler } from 'howler';

import getRandomNumber from './random';


export default class Game {
    constructor(app, scene, tween) {
        this.tween = tween;
        this.scene = scene;
        this.app = app;
        this.resetValue();
    }

    resetValue() {
        this.END = false;

        this.PHYSIC_GRAVITY = new Gravity()
            .setGravity(0.001);

        this.TIME = 0;
        this.PHYSIC_VI = 0;

        this.CHRONO = new Date();

        this.ON_CLICK = false;
        this.ONCE_CLICK = true;

        this.PIPE_SPACE = 150;

        this.glitch_sound = new Howl({
            src: ['static/sound/glitch.mp3'], // Replace with the path to your sound file
            volume: 1.0, // Adjust the volume (0.0 to 1.0)
        });

        this.fly_sound = new Howl({
            src: ['static/sound/fly.mp3'], // Replace with the path to your sound file
            volume: 0.5, // Adjust the volume (0.0 to 1.0)
        });

        this.bg_sound = new Howl({
            src: ['static/sound/music.mp3'], // Replace with the path to your sound file
            volume: 0.5, // Adjust the volume (0.0 to 1.0)
            loop: true
        });

        this.bg_sound.seek(0);
        this.bg_sound.play();
    }

    start() {
        this.keyEvent();
        this.createSprites();
        this.game_over();
        this.setScore();
    }

    keyEvent() {
        document.addEventListener("mousedown", () => {
            this.ON_CLICK = true;
            this.fly_sound.play();
        });
        
        document.addEventListener("touchstart", () => {
            this.ON_CLICK = true;
            this.fly_sound.play();
        });
        
        document.addEventListener("mouseup", () => {
            this.ON_CLICK = false;
            this.ONCE_CLICK = true;
        });
        
        document.addEventListener("touchend", () => {
            this.ON_CLICK = false;
            this.ONCE_CLICK = true;
        });
    }

    setScore() {
        this.bg_score = new PIXI.Graphics();
            this.bg_score.beginFill(0x000);
            this.bg_score.drawRect(0, 0, 100, 45)
            this.bg_score.endFill()
            this.bg_score.alpha = 0.5
            this.scene.addChild(this.bg_score);

        this.score = new PIXI.Text('0', {
            fontFamily: 'monospace',
            fontSize: 24,
            fill: 0xFFFFFF,
            align: 'center',
        });
        
        this.score.x = 10;
        this.score.y = 10;
        this.scene.addChild(this.score);
    }

    createSprites() {
        const blueRect = new PIXI.Graphics();
            blueRect.beginFill(0x00a5cf);
            blueRect.drawRect(0, 0, this.app.screen.width, this.app.screen.height); // Rectangle position (x, y) and size (width, height)
            blueRect.endFill();
            this.scene.addChild(blueRect);

        this.player = new Player()
            .setPosition(100, 200)
            .setAnchor(0.5)
            .setVelocity(2)
            .setScale(0.4, 0.4)
            .load(this.scene);
        
        this.top_pipe = new Pipes()
            .setPosition(500, getRandomNumber(80, 350))
            .setVelocity(2)
            .setScale(0.5, -0.5)
            .load(this.scene);

        this.bottom_pipe = new Pipes()
            .setPosition(500, this.top_pipe.sprite.y + 150)
            .setVelocity(2)
            .setScale(0.5, 0.5)
            .load(this.scene);

        this.floor = new Sprite(PIXI.Sprite.from("static/env/grass.png"))
            .setPosition(1, 250)
            .setScale(1.37)
            .setVelocity(2)
            .load(this.scene);

        this.floor2 = new Sprite(PIXI.Sprite.from("static/env/grass.png"))
            .setPosition(this.app.screen.width, 250)
            .setScale(1.37)
            .setVelocity(2)
            .load(this.scene);

        this.playerCollide = new PIXI.Graphics();
            this.playerCollide.lineStyle(2, 0xFF0000);
            this.playerCollide.alpha = 0;
            this.playerCollide.drawRect(-50 / 2, -50 / 2, 50, 50);
            this.playerCollide.position.set(this.player.sprite.x, this.player.sprite.y);
            this.scene.addChild(this.playerCollide);
    }

    game_over() {
        const game_over = new PIXI.Text('Game Over!', {
            fontFamily: 'monospace',
            fontSize: 24,
            fill: 0xFF0000,
            align: 'center',
        });

        game_over.x = this.app.screen.width / 2;
        game_over.y = this.app.screen.height / 2
        game_over.anchor.set(0.5);
    }

    update(TWEEN) {
        PIXI.Ticker.shared.add((delta) => {
            TWEEN.update();
            this.playerCollide.position.set(this.player.sprite.x, this.player.sprite.y);

            if (!this.END) {
                // CHRONO
                this.score.text = (new Date() - this.CHRONO).toString().slice(0, -3);

                this.floor.setVelocity(2 + Number(this.score.text) / 20);
                this.floor2.setVelocity(2 + Number(this.score.text) / 20);
                this.top_pipe.setVelocity(2 + Number(this.score.text) / 20);
                this.bottom_pipe.setVelocity(2 + Number(this.score.text) / 20);

                // FLOOR
                if (this.floor.sprite.x < -this.floor.sprite.width) {
                    this.floor.sprite.x = (this.app.screen.width-10);
                } else {
                    this.floor.sprite.x -= this.floor.velocity * delta;
                }

                if (this.floor2.sprite.x < -this.floor2.sprite.width) {
                    this.floor2.sprite.x = (this.app.screen.width-10);
                } else {
                    this.floor2.sprite.x -= this.floor2.velocity * delta;
                }
        
                ////////////// GRAVITY ///////////////
                let lastY = this.player.sprite.y;
        
                if (this.player.sprite.y + this.playerCollide.height <= this.app.screen.height) {
                    this.player.sprite.y -= this.PHYSIC_GRAVITY.apply(this.PHYSIC_VI, this.TIME) * delta;
                } else {
                    this.tween.start();
                    this.glitch_sound.play();
                    this.resetValue();
                    this.start();
                    this.bg_sound.stop();
                }
        
                ///////////// PLAYER JUMP /////////////////
                if (this.ON_CLICK && this.ONCE_CLICK) {
                    this.ONCE_CLICK = false;
                    this.TIME = 160;
                    this.PHYSIC_VI = 0.1;
                    this.player.sprite.gotoAndStop(0);
                    this.player.sprite.play()
                }
        
                if (lastY > this.player.sprite.y && this.player.sprite.rotation > -0.5) {// in jump
                    this.player.sprite.rotation -= 0.1 * delta;
                }
        
                if (lastY < this.player.sprite.y && this.player.sprite.rotation < 0.5) {
                    this.player.sprite.rotation += 0.1 * delta;
                }
        
                /////////// PLAYER ANIMATION ////////////////
                this.player.sprite.update(delta);
        
                ///////////// PIPE SLIDE //////////////////
                this.bottom_pipe.update(delta);
                this.top_pipe.update(delta);
        
                if (this.bottom_pipe.sprite.x < -this.bottom_pipe.sprite.width) {
                    this.top_pipe.sprite.y = getRandomNumber(80, 350);
                    this.bottom_pipe.sprite.y = (this.top_pipe.sprite.y + 150);
                }
        
                //////////// DEATH PLAYER EVENT /////////////
                const playerIsDeath = (
                    this.player.deathPipes("bottom", this.bottom_pipe) ||
                    this.player.deathPipes("top", this.top_pipe)
                );

                if (playerIsDeath) {
                    this.END = true;
                    this.tween.start();
                    this.glitch_sound.play();
                    this.resetValue();
                    this.start();
                    this.bg_sound.stop();
                }
        
                /////////////// UPDATE TIME /////////////////
                this.TIME += 1 * delta;
            }
        });
    }
}