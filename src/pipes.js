import * as PIXI from 'pixi.js';

import Sprite from './sprite';


export default class Pipes extends Sprite {
    constructor() {
        super(
            PIXI.Sprite.from("static/env/pipes.png")
        );
    }

    update(delta) {
        if (this.sprite.x < -this.sprite.width) {
            this.sprite.x = 400;
        } else {
            this.sprite.x -= this.velocity * delta;
        }
    }
}