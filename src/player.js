import * as PIXI from 'pixi.js';

import Sprite from './sprite';
import Pipes from './pipes';


export default class Player extends Sprite {
    constructor() {
        // sprite anims
        const frames = [];

        for (let i = 0; i < 3; i++) {
            frames.push(PIXI.Texture.from(`static/bird/frame${i}.png`));
        }
        const sprite = new PIXI.AnimatedSprite(frames);
            sprite.animationSpeed = 0.1;
            sprite.loop = false;

        super(sprite);
    }

    /**
     * 
     * @param {Pipes} pipesObject 
     */
    deathPipes(pipeType, pipesObject) {
        const player_x = this.sprite.x;
        const player_y = this.sprite.y;
        const player_width = this.sprite.width;
        const player_height = this.sprite.height;

        const pipe_x = pipesObject.sprite.x;
        const pipe_y = pipesObject.sprite.y;
        const pipe_width = pipesObject.sprite.width;
        const pipe_height = pipesObject.sprite.height;

        if (player_x + player_width / 2 > pipe_x && player_x - player_width / 2 < pipe_x + pipe_width) {
            if (pipeType === "bottom" && player_y + player_height / 2 > pipe_y) {
                return true;
            }
            else if (pipeType === "top" && player_y - player_height / 2 < pipe_y) {
                return true;
            }
        }

        return false;
    }
}