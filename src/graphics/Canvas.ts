/** 
 *  #### Coordinate system
 *  * Model => Origin: center, Positive: up, right
 *  * View => Origin: bottom left, Positive: up, right
 * 
 *  @category Graphics
 *  @module Canvas
 */

import {Texture} from "./Texture";
import Window from "../io/Window";
import {Color, NeedInit, Point, Size, TextAlign} from "../Types";

const ctx = (document.getElementById("screen") as HTMLCanvasElement).getContext("2d");
ctx.textBaseline = "bottom";

export interface Drawable {
    draw(): void;
}

export class Transform {
    constructor(initializer?: {
        rotate?: number,
        translate?: Point,
        scale?: Size,
        opacity?: number,
        flip?: [boolean, boolean]
    }){
        if(initializer){
            if(typeof(initializer.rotate) !== "undefined"){
                this.rotate = initializer.rotate;
            }
            if(typeof(initializer.translate) !== "undefined"){
                this.translate = initializer.translate;
            }
            if(typeof(initializer.scale) !== "undefined"){
                this.scale = initializer.scale;
            }
            if(typeof(initializer.opacity) !== "undefined"){
                this.opacity = initializer.opacity;
            }
            if(typeof(initializer.flip) !== "undefined"){
                this.flip = initializer.flip;
            }
        }
    }
    rotate: number = 0.0;
    translate: Point = new Point(0, 0);
    scale: Size = new Size(1, 1);
    opacity: number = 1.0;
    flip: [boolean, boolean] = [false, false];

    concat = (transform: Transform) => new Transform({
        rotate: this.rotate + transform.rotate,
        translate: this.translate.concat(transform.translate),
        scale: this.scale.concat(transform.scale),
        opacity: this.opacity * transform.opacity,
        flip: [this.flip[0] !== transform.flip[0], this.flip[1] !== transform.flip[1]],
    });
};

export class Canvas implements NeedInit{
    init(draw: () => void): void {
        this.draw = (() => {
            ctx.save();
            ctx.clearRect(0, 0, Window.size.width, Window.size.height);
            draw();
            ctx.restore();
            if(this.started){
                window.requestAnimationFrame(this.draw);
            }
        }).bind(this);
    }

    start(): void{
        this.started = true;
        this.draw();
    }

    pause(): void {
        this.started = false;
    }

    apply_transform(transform: Transform){
        // TODO: flip
        if(transform.translate){
            ctx.translate(transform.translate.x, -transform.translate.y);
        }
        if(transform.scale){
            ctx.scale(transform.scale.width, transform.scale.height);
        }
        if(transform.rotate){
            ctx.rotate(transform.rotate * Math.PI / 180);
        }
        if(transform.opacity){
            ctx.globalAlpha = transform.opacity;
        }
    }

    open_scope(callback: () => void){
        ctx.save();
        callback();
        ctx.restore();
    }

    draw_texture(texture: Texture, transform?: Transform): void {
        if(texture.bitmap !== null){
            if(transform){
                this.apply_transform(transform);
            }
            const origin = texture.origin;
            ctx.drawImage(texture.bitmap,
                origin.x, -origin.y,
                texture.size().width, texture.size().height
            );
        }
    }
    // FIXME:
    draw_text(text: string, size: number, offset: Point, color: Color, align: TextAlign = TextAlign.Left){
        ctx.save();
        ctx.textAlign = align;
        ctx.fillStyle = color.toString();
        ctx.font = `${size}px serif`;
        ctx.fillText(text, offset.x, Window.size.height - offset.y)
        ctx.restore();
    }
    draw_axis(color: Color){
        ctx.save();
        ctx.strokeStyle = color.toString();
        ctx.beginPath();
        ctx.moveTo(512, 0);
        ctx.lineTo(512, 768);
        ctx.stroke();
        ctx.moveTo(0, 384);
        ctx.lineTo(1024, 384);
        ctx.stroke();
        ctx.restore();
    }
    private started = true;
    private draw: () => void;
}

const instance = new Canvas();
export default instance;