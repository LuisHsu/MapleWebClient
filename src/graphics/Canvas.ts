/** 
 *  #### Coordinate system
 *  * Model => Origin: center, Positive: up, right
 *  * View => Origin: bottom left, Positive: up, right
 * 
 *  @category Graphics
 *  @module Canvas
 */

import Setting from "../Setting";
import {Texture} from "./Texture";
import Window from "../io/Window";
import {Color, NeedInit, Point, Size, TextAlign} from "../Types";

const ctx = (document.getElementById("screen") as HTMLCanvasElement).getContext("2d");
ctx.textBaseline = "bottom";

export interface Drawable {
    draw(transform: Transform): void;
}

export class Transform {
    constructor(initializer?: {
        rotate?: number,
        offset?: Point,
        scale?: Size,
        opacity?: number,
        flip?: [boolean, boolean]
    }){
        if(initializer){
            if(typeof(initializer.rotate) !== "undefined"){
                this.rotate = initializer.rotate;
            }
            if(typeof(initializer.offset) !== "undefined"){
                this.offset = initializer.offset;
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
    offset: Point = new Point(0, 0);
    scale: Size = new Size(1, 1);
    opacity: number = 1.0;
    flip: [boolean, boolean] = [false, false];

    concat = (transform: Transform) => new Transform({
        rotate: this.rotate + transform.rotate,
        offset: this.offset.concat(transform.offset),
        scale: this.scale.concat(transform.scale),
        opacity: this.opacity * transform.opacity,
        flip: [this.flip[0] !== transform.flip[0], this.flip[1] !== transform.flip[1]],
    });
};

export class Canvas implements NeedInit{
    init(draw: () => void): void {
        this.draw = () => {
            ctx.clearRect(0, 0, Window.size.width, Window.size.height);
            draw();
        };
    }
    start(): void {
        if(this.interval === null){
            this.interval = setInterval(() => {window.requestAnimationFrame(this.draw);}, 1000.0 / Setting.FPS) // 60 fps
        }
    }
    pause(): void {
        if(this.interval){
            clearInterval(this.interval);
            this.interval = null;
        }
    }
    draw_texture(texture: Texture, transform: Transform = new Transform): void {
        if(texture.bitmap !== null){
            ctx.save();
            if(transform.rotate){
                ctx.rotate(transform.rotate * Math.PI / 180);
            }
            if(transform.offset){
                ctx.translate(transform.offset.x, -transform.offset.y);
            }
            let offset = texture.offset;
            let size = texture.size().concat(transform.scale);
            ctx.translate(
                offset.x - size.width / 2,
                Window.size.height - (offset.y + size.height / 2)
            );
            if(transform.flip[0] || transform.flip[1]){
                ctx.scale(
                    transform.flip[0] ? -1 : 1,
                    transform.flip[1] ? -1 : 1,
                );
                ctx.translate(
                    transform.flip[0] ? -size.width : 0,
                    transform.flip[1] ? -size.height : 0,
                );
            }
            ctx.globalAlpha = transform.opacity;
            ctx.drawImage(texture.bitmap, 0, 0,
                size.width, size.height
            );
            ctx.restore();
        }
    }
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
    private interval: ReturnType<typeof setInterval> = null;
    private draw: () => void;
}

const instance = new Canvas();
export default instance;