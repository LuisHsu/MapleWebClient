/**
 * @category UI
 * @module UIElement
 */

import { Drawable } from "../graphics/Canvas";
import { Sprite } from "../graphics/Sprite";

export class UIElement implements Drawable {

    sprites: Sprite[];

    constructor(sprites?: Sprite[]){
        this.sprites = sprites ? sprites : [];
    }

    draw(): void {
        this.sprites.forEach(sprite => {
            sprite.draw();
        })
    }
}