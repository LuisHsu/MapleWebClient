/**
 * @category UI
 * @module UILogo
 */

import UI, { UIState } from "./UI";
import { Animation, Frame } from "../graphics/Animation";
import { Point, Size } from "../Types";
import { Texture } from "../graphics/Texture";
import Setting from "../Setting";
import { Music } from "../audio/Audio";
import { UILoginState } from "./UILoginState";
import canvas, { Transform } from "../graphics/Canvas";

export class UILogo implements UIState {

    draw(): void{
        canvas.open_scope(() => {
            this.animation.draw()
        })
    };

    left_click = this.next;

    constructor(){
        let frames = [
            create_logo_frame("UI/Logo/Gamania.0.png", 2000, () => {
                Music.play("NxLogo");
            }),
            create_logo_frame("UI/Logo/Nexon.0.png", 2000, () => {
                Music.play("WzLogo");
            })
        ];
        for(let i = 0; i < 62; ++i){
            frames.push(create_wizet_frame(i));
        }
        frames[frames.length - 1].callback = () => {
            this.next();
        }
        this.animation = new Animation(frames, false);
        this.animation.start();
    }

    private animation: Animation;
    private next(){
        this.animation.stop();
        UI.change_state(new UILoginState);
    }
}

function create_logo_frame(id: string, delay: number, callback?: () => void): Frame{
    return new Frame([new Texture(id, {
        size: new Size(Setting.ScreenSize.width, Setting.ScreenSize.height),
        origin: new Point(0, Setting.ScreenSize.height),
    })], delay, undefined, null, callback);
}
function create_wizet_frame(index: number): Frame {
    return new Frame([new Texture(
        `UI/Logo/Wizet.${index}.png`, {
        size: new Size(704, 538),
        origin: new Point(0, Setting.ScreenSize.height),
    })], 100);
}