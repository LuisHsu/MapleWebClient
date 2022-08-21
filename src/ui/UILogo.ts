/**
 * @category UI
 * @module UILogo
 */

import GL, { Transform } from "../graphics/GL";
import UI, { UIState } from "./UI";
import { Animation, Frame } from "../graphics/Animation";
import { Point, Size } from "../Types";
import { Texture } from "../graphics/Texture";
import Setting from "../Setting";
import { Music } from "../audio/Audio";
import { UILoginState } from "./UILoginState";

export class UILogo implements UIState {

    draw(transform: Transform): void {
        this.animation.draw(transform);
    }

    left_click = this.next;

    constructor(){
        let frames = [
            create_logo_frame("UI/Logo/Gamania.0.png", 2, undefined, () => {
                Music.play("NxLogo");
            }),
            create_logo_frame("UI/Logo/Nexon.0.png", 2, undefined, () => {
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
        GL.set_clear_color(1, 1, 1, 1);
        this.animation.start();
    }

    private animation: Animation;
    private next(){
        this.animation.stop();
        GL.set_clear_color(0, 0, 0, 1);
        UI.change_state(new UILoginState);
    }
}

function create_logo_frame(id: string, delay: number, transform?: Transform, callback?: () => void): Frame{
    return new Frame(new Texture(id,
        new Point(Setting.ScreenSize.width / 2, Setting.ScreenSize.height / 2),
        new Size(Setting.ScreenSize.width, Setting.ScreenSize.height)
    ), delay, transform, null, callback);
}
function create_wizet_frame(index: number): Frame {
    return new Frame(new Texture(
        `UI/Logo/Wizet.${index}.png`,
        new Point(352, 499),
        new Size(704, 538),
    ), 0.1);
}