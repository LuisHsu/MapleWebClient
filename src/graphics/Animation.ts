/**
 * @category Graphics
 * @module Animation
 */

import Setting from "../Setting";
import {Texture} from "./Texture";
import gl, {Transform} from "./GL";
import {Drawable, Point, Size} from "../Types";

export class Frame implements Drawable {
    /**
     * 
     * @param texture Frame texture
     * @param delay Frame delay in seconds
     * @param transform Frame transformation
     * @param from Frame transformation that begins from
     * @param callback Callback function after frame expired
     */
    constructor(texture: Texture,
            delay?: number,
            transform: Transform = new Transform,
            from?: Transform,
            callback?: () => void
        ){
        this.texture = texture;
        this.delay = delay ? (delay * 1000) : null;
        this.transform = transform;
        this.callback = callback;
        if(from){
            this.counter = 0;
            this.from = from;
        }
    }
    draw(transform: Transform = new Transform): void {
        if(this.delay && this.from && (this.counter <= this.delay)){
            gl.draw_texture(this.texture, new Transform({
                rotate: this.from.rotate + ((this.transform.rotate - this.from.rotate) * this.counter / this.delay),
                opacity: this.from.opacity + ((this.transform.opacity - this.from.opacity) * this.counter / this.delay),
                scale: new Size(
                    this.from.scale.width + ((this.transform.scale.width - this.from.scale.width) * this.counter / this.delay),
                    this.from.scale.height + ((this.transform.scale.height - this.from.scale.height) * this.counter / this.delay)
                ),
                offset: new Point(
                    this.from.offset.x + ((this.transform.offset.x - this.from.offset.x) * this.counter / this.delay),
                    this.from.offset.y + ((this.transform.offset.y - this.from.offset.y) * this.counter / this.delay)
                ),
            }));
            this.counter += Setting.FPS;
        }else{
            gl.draw_texture(this.texture, new Transform({
                rotate: this.transform.rotate + transform.rotate,
                opacity: this.transform.opacity * transform.opacity,
                scale: new Size(
                    this.transform.scale.width * transform.scale.width,
                    this.transform.scale.height * transform.scale.height
                ),
                offset: new Point(
                    this.transform.offset.x + transform.offset.x,
                    this.transform.offset.y + transform.offset.y
                ),
            }));
        }
    }
    reset(): void{
        this.counter = 0;
    }
    delay?: number;
    callback?: () => void;
    private texture: Texture;
    private transform: Transform;
    private counter?: number;
    private from?: Transform;
};

export class Animation implements Drawable{
    constructor(frames: Frame[], repeat: boolean = false, auto_start: boolean = false){
        this.frames = frames;
        this.repeat = repeat;
        if(auto_start){
            this.start();
        }
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
    draw(transform: Transform = new Transform){
        this.frames[this.index].draw(transform);
    }
    private repeat: boolean;
    private frames: Frame[];
    private index: number = 0;
    private timeout: ReturnType<typeof setTimeout> = null;
    private update(){
        if(this.timeout !== null){
            const previous = this.frames[this.index];
            if((this.index + 1) >= this.frames.length){
                if(this.repeat){
                    this.reset();
                }else{
                    this.stop();
                    if(previous.callback){
                        previous.callback();
                    }
                    return;
                }
            }else{
                this.index += 1;
            }
            this.frames[this.index].reset();
            this.timeout = setTimeout(this.update.bind(this), this.frames[this.index].delay);
            if(previous.callback){
                previous.callback();
            }
        }
    }
}

export default Animation;