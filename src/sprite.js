import * as PIXI from 'pixi.js';


export default class Sprite {
    /**
     * 
     * @param {PIXI.Sprite | PIXI.AnimatedSprite} sprite 
     */
    constructor(sprite) {
        this.sprite = sprite;
        this.velocity = 1;
    }

    setAngle(angle) {
        this.sprite.angle = angle;
        return this;
    }

    setVelocity(velocity) {
        this.velocity = velocity;
        return this;
    }

    setPosition(x, y) {
        this.sprite.x = x;
        this.sprite.y = y;
        return this;
    }

    setAnchor(anchor) {
        this.sprite.anchor.set(anchor);
        return this;
    }

    setScale(x, y) {
        this.sprite.scale.set(x, y);
        return this;
    }

    load(app) {
        app.addChild(this.sprite);
        return this;
    }


}