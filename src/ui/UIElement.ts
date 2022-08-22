/**
 * @category UI
 * @module UIElement
 */

import { Drawable, Transform } from "../graphics/Canvas";
import { Sprite } from "../graphics/Sprite";

export class UIElement implements Drawable {

    sprites: Sprite[];

    constructor(sprites?: Sprite[]){
        this.sprites = sprites ? sprites : [];
    }

    draw(transform: Transform = new Transform): void {
        this.sprites.forEach(sprite => {
            sprite.draw(transform);
        })
    }
}