/**
 * @category Graphics
 * @module Animation
 */

import { Texture } from "./Texture";
import canvas, { Drawable, Transform } from "./Canvas";
import { Size } from "../Types";

export type FrameItem = (Texture | Animation);

export class Frame implements Drawable {
    /**
     * @param items Frame item
     * @param delay Frame delay in milliseconds
     * @param transform Frame transformation
     * @param from Frame transformation that begins from
     * @param onEnd Callback function after frame end
     * @param onBebin Callback function before frame begin
     */
    constructor(items: FrameItem[],
            delay?: number,
            transform: Transform = new Transform,
            from?: Transform,
            callback?: () => void
        ){
        this.items = items;
        this.delay = delay;
        this.transform = transform;
        this.callback = callback;
        if(from){
            this.from = from;
        }
    }
    draw(): void {
        const elapsed = Date.now() - this.timestamp;
        if(this.delay && this.from && (elapsed <= this.delay)){
            this.items.forEach(item => {
                const composed = new Transform({
                    rotate: this.from.rotate + ((this.transform.rotate - this.from.rotate) * elapsed / this.delay),
                    opacity: this.from.opacity + ((this.transform.opacity - this.from.opacity) * elapsed / this.delay),
                    scale: new Size(
                        this.from.scale.width + ((this.transform.scale.width - this.from.scale.width) * elapsed / this.delay),
                        this.from.scale.height + ((this.transform.scale.height - this.from.scale.height) * elapsed / this.delay)
                    ),
                    translate: this.from.translate.concat(this.transform.translate.concat(this.from.translate.mul(-1)).mul(elapsed).div(this.delay)),
                });
                if(item instanceof Texture){
                    canvas.draw_texture(item, composed);
                }else{
                    canvas.apply_transform(this.transform);
                    item.draw();
                }
            })
        }else{
            this.items.forEach(item => {
                if(item instanceof Texture){
                    canvas.draw_texture(item, this.transform);
                }else{
                    canvas.apply_transform(this.transform);
                    item.draw();
                }
            })
        }
    }
    reset(): void{
        this.timestamp = Date.now();
    }
    start(): void{
        this.items.filter(item => (item instanceof Animation)).forEach((item: Animation) => {
            item.start();
        })
    }
    delay?: number;
    callback?: () => void;
    private items: FrameItem[];
    private transform: Transform;
    private timestamp: number = Date.now();
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
    draw(){
        this.frames[this.index].draw();
    }
    repeat: boolean;
    frames: Frame[];
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
            if(this.frames[this.index] instanceof Animation){
                this.frames[this.index].start();
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