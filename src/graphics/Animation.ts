/**
 * @category Graphics
 * @module Animation
 */

import Setting from "../Setting";
import {Texture} from "./Texture";
import gl, {Drawable, Transform} from "./GL";
import {Point, Size} from "../Types";

export class Frame implements Drawable {
    constructor(texture: Texture, delay?: number, transform: Transform = new Transform, from?: Transform){
        this.texture = texture;
        this.delay = delay ? (delay * 1000) : null;
        this.transform = transform;
        if(from){
            this.counter = 0;
            this.from = from;
        }
    }
    draw(transform: Transform): void {
        if(this.delay && this.from && (this.counter <= this.delay)){
            gl.draw_texture(this.texture, new Transform({
                rotate: this.from.rotate + transform.rotate +
                    ((this.transform.rotate - this.from.rotate) * this.counter / this.delay),
                opacity: this.from.opacity * transform.opacity *
                    ((this.transform.opacity - this.from.opacity) * this.counter / this.delay),
                scale: new Size(
                    this.from.scale.width + transform.scale.width +
                    ((this.transform.scale.width - this.from.scale.width) * this.counter / this.delay),
                    this.from.scale.height + transform.scale.height +
                    ((this.transform.scale.height - this.from.scale.height) * this.counter / this.delay)
                ),
                offset: new Point(
                    this.from.offset.x + transform.offset.x +
                    ((this.transform.offset.x - this.from.offset.x) * this.counter / this.delay),
                    this.from.offset.y + transform.offset.y +
                    ((this.transform.offset.y - this.from.offset.y) * this.counter / this.delay)
                ),
            }));
            this.counter += Setting.FPS;
        }else{
            gl.draw_texture(this.texture, this.transform);
        }
    }
    reset(): void{
        this.counter = 0;
    }
    delay?: number;
    private texture: Texture;
    private transform: Transform;
    private counter?: number;
    private from?: Transform;
};

export class Animation implements Drawable{
    constructor(frames: Frame[], repeat: boolean = false){
        this.frames = frames;
        this.repeat = repeat;
    }
    start(){
        if((this.frames.length > 1) && (this.timeout === null)){
            this.frames[this.index].reset();
            this.timeout = setTimeout(this.update.bind(this), this.frames[this.index].delay);
        }
    }
    stop(){
        if((this.frames.length > 1) && this.timeout !== null){
            clearTimeout(this.timeout);
            this.timeout = null;
        }
    }
    reset(){
        this.index = 0;
    }
    draw(transform: Transform){
        this.frames[this.index].draw(transform);
    }
    private repeat: boolean;
    private frames: Frame[];
    private index: number = 0;
    private timeout: ReturnType<typeof setTimeout> = null;
    private update(){
        if(this.timeout !== null){
            if((this.index + 1) >= this.frames.length){
                if(this.repeat){
                    this.reset();
                }else{
                    this.stop();
                    return;
                }
            }else{
                this.index += 1;
            }
            this.frames[this.index].reset();
            this.timeout = setTimeout(this.update.bind(this), this.frames[this.index].delay)
        }
    }
}

export default Animation;