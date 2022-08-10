/**
 * @category UI
 * @module UILogin
 */

import { Music } from "../audio/Audio";
import Animation, { Frame } from "../graphics/Animation";
import GL, { Transform } from "../graphics/GL";
import { Sprite } from "../graphics/Sprite";
import { Texture } from "../graphics/Texture";
import { Point, Size } from "../Types";
import { UIState } from "./UI";
import { UIElement } from "./UIElement";

export class UILogin extends UIElement implements UIState {

    constructor(){
        super(login_sprites());
        // GL.set_clear_color(0, 0, 0, 1);
        Music.play("Login", 1, true);
    }

    draw(transform: Transform): void {
        super.draw(transform);
    }

    mouse_up(position: Point): void {
        
    }

}

const login_sprites = (): Sprite[] => [
    new Sprite(new Texture("Map/Back/back.11.png", new Point(475, 360), new Size(1080, 810))),
    new Sprite(new Texture("UI/Login/Title.logo.png", new Point(507, 595), new Size(556, 307))),
    new Sprite(new Texture("UI/Login/Title.signboard.png", new Point(676, 320), new Size(471, 302))),
    new Sprite(new Animation([
        new Frame(new Texture("UI/Login/Title.effect.0.0.png", new Point(935, 565)), 4.5, new Transform({opacity: 0.9, scale: new Size(1.5, 1.5)}), new Transform({opacity: 0, scale: new Size(1.5, 1.5)})),
        new Frame(new Texture("UI/Login/Title.effect.0.1.png", new Point(935, 565)), 4.5, new Transform({opacity: 0, scale: new Size(1.5, 1.5)}), new Transform({opacity: 0.9, scale: new Size(1.5, 1.5)})),
        new Frame(new Texture("UI/Login/Title.effect.0.2.png", new Point(935, 565)), 3, new Transform({scale: new Size(1.5, 1.5), opacity: 0.9}))
    ], true, true)),
    new Sprite(new Animation([
        new Frame(new Texture("UI/Login/Title.effect.1.0.png", new Point(810, 625)), 7.5, new Transform({opacity: 0.9, scale: new Size(1.5, 1.5)}), new Transform({opacity: 0.04, scale: new Size(1.5, 1.5)})),
        new Frame(new Texture("UI/Login/Title.effect.1.1.png", new Point(810, 625)), 7.5, new Transform({opacity: 0.04, scale: new Size(1.5, 1.5)}), new Transform({opacity: 0.9, scale: new Size(1.5, 1.5)}))
    ], true, true)),
    new Sprite(new Animation([
        new Frame(new Texture("UI/Login/Title.effect.2.0.png", new Point(770, 608)), 5.1, new Transform({opacity: 0.9, scale: new Size(1.5, 1.5)}), new Transform({opacity: 0, scale: new Size(1.5, 1.5)})),
        new Frame(new Texture("UI/Login/Title.effect.2.1.png", new Point(770, 608)), 5.1, new Transform({opacity: 0, scale: new Size(1.5, 1.5)}), new Transform({opacity: 0.9, scale: new Size(1.5, 1.5)})),
        new Frame(new Texture("UI/Login/Title.effect.2.2.png", new Point(770, 608)), 5.1, new Transform({scale: new Size(1.5, 1.5), opacity: 0.9}))
    ], true, true)),
    new Sprite(new Animation([
        new Frame(new Texture("UI/Login/Title.effect.3.0.png", new Point(846, 585)), 9.0, new Transform({opacity: 0.9, scale: new Size(1.5, 1.5)}), new Transform({opacity: 0.04, scale: new Size(1.5, 1.5)})),
        new Frame(new Texture("UI/Login/Title.effect.3.1.png", new Point(846, 585)), 9.0, new Transform({opacity: 0.04, scale: new Size(1.5, 1.5)}), new Transform({opacity: 0.9, scale: new Size(1.5, 1.5)}))
    ], true, true)),
    new Sprite(new Animation([
        new Frame(new Texture("UI/Login/Title.effect.4.0.png", new Point(846, 562)), 8.4, new Transform({opacity: 0.9, scale: new Size(1.5, 1.5)}), new Transform({opacity: 0.04, scale: new Size(1.5, 1.5)})),
        new Frame(new Texture("UI/Login/Title.effect.4.1.png", new Point(846, 562)), 8.4, new Transform({opacity: 0.04, scale: new Size(1.5, 1.5)}), new Transform({opacity: 0.9, scale: new Size(1.5, 1.5)}))
    ], true, true)),
    new Sprite(new Animation([
        new Frame(new Texture("UI/Login/Title.effect.5.0.png", new Point(875, 587)), 3.0, new Transform({opacity: 0.8, scale: new Size(1.5, 1.5)}), new Transform({opacity: 0, scale: new Size(1.5, 1.5)})),
        new Frame(new Texture("UI/Login/Title.effect.5.1.png", new Point(875, 587)), 3.0, new Transform({opacity: 0, scale: new Size(1.5, 1.5)}), new Transform({opacity: 0.8, scale: new Size(1.5, 1.5)})),
        new Frame(new Texture("UI/Login/Title.effect.5.2.png", new Point(875, 587)), 7.5, new Transform({opacity: 0.8, scale: new Size(1.5, 1.5)}))
    ], true, true)),
    new Sprite(new Texture("UI/Login/1024frame.png", new Point(512, 384), new Size(1024, 768))),
];