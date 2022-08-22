/** 
 *  @category Graphics
 *  @module Sprite
 */

import Animation from "./Animation";
import Canvas, { Drawable, Transform } from "./Canvas";
import { Texture } from "./Texture";

export class Sprite implements Drawable {
    sprite: Animation | Texture;

    constructor(sprite: Animation | Texture){
        this.sprite = sprite;
    }

    draw(transform: Transform = new Transform): void {
        if(this.sprite instanceof Animation){
            this.sprite.draw(transform);
        }else{
            Canvas.draw_texture(this.sprite, transform);
        }
    }
}