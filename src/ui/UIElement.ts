/**
 * @category UI
 * @module UIElement
 */

import { Transform } from "../graphics/GL";
import { Sprite } from "../graphics/Sprite";
import { Drawable } from "../Types";

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