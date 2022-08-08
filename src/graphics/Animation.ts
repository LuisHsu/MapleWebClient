import Texture from "./Texture";
import gl, { Drawable, Transform } from "./GL";

export class Frame implements Drawable {
    constructor(texture: Texture, delay: number, transform: Transform = new Transform){
        this.texture = texture;
        this.delay = delay;
        this.transform = transform;
    }
    draw(): void {
        gl.draw_texture(this.texture, this.transform);
    }
    delay: number;
    private texture: Texture;
    private transform: Transform;
};

class Animation implements Drawable{
    constructor(frames: Frame[], repeat: boolean = false){
        this.frames = frames;
        this.repeat = repeat;
    }
    start(){
        if(this.timeout === null){
            this.timeout = setTimeout(this.update.bind(this), this.frames[this.index].delay);
        }
    }
    stop(){
        if(this.timeout !== null){
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
    private repeat: boolean;
    private frames: Frame[];
    private index: number = 0;
    private timeout: ReturnType<typeof setTimeout> = null;
    private update(){
        if(this.timeout !== null){
            this.index += 1;
            if(this.index >= this.frames.length){
                if(this.repeat){
                    this.index = 0;
                }else{
                    this.stop();
                    return;
                }
            }
            this.timeout = setTimeout(this.update.bind(this), this.frames[this.index].delay)
        }
    }
}

export default Animation;