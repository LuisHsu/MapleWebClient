/** 
 *  @category Graphics
 *  @module Sprite
 */

import Animation from "./Animation";
import GL, { Drawable, Transform } from "./GL";
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
            GL.draw_texture(this.sprite, transform);
        }
    }
}