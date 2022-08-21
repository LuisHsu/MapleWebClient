/**
 * @category UI
 * @module UICharSelect
 */

import { Transform } from "../graphics/GL";
import { Sprite } from "../graphics/Sprite";
import { Texture } from "../graphics/Texture";
import { Point, Size } from "../Types";
import { UIState } from "./UI";
import { UIElement } from "./UIElement";

export class UICharSelect extends UIElement implements UIState {
    constructor(){
        super(char_select_sprites());
    }

    draw(transform?: Transform): void {
        super.draw(transform.concat(new Transform({offset: this.camera_position})));
        this.fixed_sprites.forEach(sprite => {
            sprite.draw(transform);
        })
    }

    private camera_position: Point = new Point(100, 0);

    private fixed_sprites: Sprite[] = [
        new Sprite(new Texture("UI/Login/1024frame.png", new Point(512, 384), new Size(1024, 768)))
    ]
}

const char_select_sprites = (): Sprite[] => {
    let results = [
        new Sprite(new Texture("Map/Back/back.1.png", new Point(525, 420), new Size(880, 660))),
        new Sprite(new Texture("Map/Back/back.14.png", new Point(520, 120), new Size(880, 160))),
    ]
    return results;
};