/** 
 *  @category Graphics
 *  @module Sprite
 */

import { Point } from "../Types";
import Animation from "./Animation";
import canvas, { Drawable, Transform } from "./Canvas";
import { Texture } from "./Texture";

export class Sprite implements Drawable {
    sprite: (Animation | Texture);
    offset?: Point;

    constructor(sprite: (Animation | Texture), offset?: Point){
        this.sprite = sprite;
        this.offset = offset;
    }

    draw(): void{
        canvas.open_scope(() => {
            if(this.offset){
                canvas.apply_transform(new Transform({translate: this.offset}));
            }
            if(this.sprite instanceof Animation){
                this.sprite.draw();
            }else{
                canvas.draw_texture(this.sprite);
            }
        })
    };
}