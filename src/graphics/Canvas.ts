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
import {NeedInit, Point, Size} from "../Types";

const ctx = (document.getElementById("screen") as HTMLCanvasElement).getContext("2d");
ctx.textBaseline = "bottom";

export interface Drawable {
    draw(transform: Transform): void;
}

export class Transform {
    constructor(initializer?: {rotate?: number, offset?: Point, scale?: Size, opacity?: number}){
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
        }
    }
    rotate: number = 0.0;
    offset: Point = new Point(0, 0);
    scale: Size = new Size(1, 1);
    opacity: number = 1.0;

    concat = (transform: Transform) => new Transform({
        rotate: this.rotate + transform.rotate,
        offset: this.offset.concat(transform.offset),
        scale: this.scale.concat(transform.scale),
        opacity: this.opacity * transform.opacity,
    });
};

export class Canvas implements NeedInit{
    init(draw: () => void): void {
        this.draw = () => {
            ctx.clearRect(0, 0, Window.size.width, Window.size.height);
            ctx.save();
            draw();
            ctx.restore();
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
                ctx.rotate(transform.rotate  * Math.PI / 180);
            }
            let offset = texture.offset.concat(transform.offset);
            let size = texture.size().concat(transform.scale);
            ctx.drawImage(texture.bitmap, 
                offset.x - size.width / 2,
                Window.size.height - (offset.y + size.height / 2),
                size.width, size.height
            );
            ctx.restore();
        }
    }
    draw_text(text: string, size: number, offset: Point){
        ctx.save();
        ctx.font = `${size}px sans-serif`;
        ctx.fillText(text, offset.x, offset.y)
        ctx.restore();
    }
    private interval: ReturnType<typeof setInterval> = null;
    private draw: () => void;
}

const instance = new Canvas();
export default instance;