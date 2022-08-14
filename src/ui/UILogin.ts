/**
 * @category UI
 * @module UILogin
 */

import { Music } from "../audio/Audio";
import { Button, MapleButton } from "../components/Button";
import { TextInput } from "../components/TextInput";
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
        Music.play("Login", 1, true);
        this.login_button.state = Button.State.NORMAL;
        let saved_account = window.localStorage.getItem("account");
        this.account_input = new TextInput(new Point(678, 401), new Size(185, 24), {
            color: "white",
            value: saved_account,
        });
        this.password_input = new TextInput(new Point(678, 364), new Size(185, 24), {
            color: "white",
            type: "password",
        });
        this.save_account = (saved_account !== null);
    }

    login(): void {
        // Save account
        if(this.save_account){
            window.localStorage.setItem("account", this.account_input.value());
        }else{
            window.localStorage.removeItem("account");
        }
        // TODO: login api
        console.log(`
            ${this.account_input.value()}
            ${this.password_input.value()}
        `);
    }

    toggle_save_account(): void {
        this.save_account = !this.save_account;
    }

    draw(transform: Transform): void {
        super.draw(transform);
        this.login_button.draw(new Transform({scale: new Size(1.25, 1.25)}));
        this.account_save_button.draw(new Transform({scale: new Size(1.25, 1.25)}));
        GL.draw_texture(this.account_save_status[this.save_account ? 1 : 0], new Transform({scale: new Size(1.25, 1.25)}));
    }

    mouse_move(position: Point): void {
        this.login_button.update_hover(position);
        this.account_save_button.update_hover(position);
    }

    mouse_down(position: Point): void {
        this.login_button.update_pressed(position);
        this.account_save_button.update_pressed(position);
    }

    mouse_up(position: Point): void {
        this.login_button.update_released(position);
        this.account_save_button.update_released(position);
    }

    left_click(position: Point): void {
        this.login_button.handle_click(position, new Point, this.login.bind(this));
        this.account_save_button.handle_click(position, new Point, this.toggle_save_account.bind(this));
        this.account_input.handle_click();
    }

    save_account: boolean = false;

    account_input: TextInput;
    password_input: TextInput;

    login_button: MapleButton = new MapleButton({
        pressed: new Texture("UI/Login/Title.BtLogin.pressed.0.png"),
        normal: new Texture("UI/Login/Title.BtLogin.normal.0.png"),
        hovered: new Texture("UI/Login/Title.BtLogin.mouseOver.0.png"),
        disabled: new Texture("UI/Login/Title.BtLogin.disabled.0.png"),
    }, new Point(842, 409));

    account_save_button: MapleButton = new MapleButton({
        pressed: new Texture("UI/Login/Title.BtEmailSave.pressed.0.png"),
        normal: new Texture("UI/Login/Title.BtEmailSave.normal.0.png"),
        hovered: new Texture("UI/Login/Title.BtEmailSave.mouseOver.0.png"),
        disabled: new Texture("UI/Login/Title.BtEmailSave.disabled.0.png"),
    }, new Point(615, 338));

    account_save_status: Texture[] = [
        new Texture("UI/Login/Title.check.0.png", new Point(567, 338)),
        new Texture("UI/Login/Title.check.1.png", new Point(567, 338)),
    ];
}

const login_sprites = (): Sprite[] => [
    new Sprite(new Texture("Map/Back/back.11.png", new Point(475, 360), new Size(1080, 810))),
    new Sprite(new Animation([
        new Frame(new Texture("UI/Login/Title.effect.0.0.png", new Point(935, 565)), 4.5, new Transform({opacity: 0.9, scale: new Size(1.5, 1.5)}), new Transform({opacity: 0, scale: new Size(1.5, 1.5)})),
        new Frame(new Texture("UI/Login/Title.effect.0.2.png", new Point(935, 565)), 3, new Transform({scale: new Size(1.5, 1.5), opacity: 0.9})),
        new Frame(new Texture("UI/Login/Title.effect.0.1.png", new Point(935, 565)), 4.5, new Transform({opacity: 0, scale: new Size(1.5, 1.5)}), new Transform({opacity: 0.9, scale: new Size(1.5, 1.5)})),
    ], true, true)),
    new Sprite(new Animation([
        new Frame(new Texture("UI/Login/Title.effect.1.0.png", new Point(830, 625)), 7.5, new Transform({opacity: 0.9, scale: new Size(1.5, 1.5)}), new Transform({opacity: 0.04, scale: new Size(1.5, 1.5)})),
        new Frame(new Texture("UI/Login/Title.effect.1.1.png", new Point(830, 625)), 7.5, new Transform({opacity: 0.04, scale: new Size(1.5, 1.5)}), new Transform({opacity: 0.9, scale: new Size(1.5, 1.5)}))
    ], true, true)),
    new Sprite(new Animation([
        new Frame(new Texture("UI/Login/Title.effect.2.0.png", new Point(770, 608)), 5.1, new Transform({opacity: 0.9, scale: new Size(1.5, 1.5)}), new Transform({opacity: 0, scale: new Size(1.5, 1.5)})),
        new Frame(new Texture("UI/Login/Title.effect.2.2.png", new Point(770, 608)), 5.1, new Transform({scale: new Size(1.5, 1.5), opacity: 0.9})),
        new Frame(new Texture("UI/Login/Title.effect.2.1.png", new Point(770, 608)), 5.1, new Transform({opacity: 0, scale: new Size(1.5, 1.5)}), new Transform({opacity: 0.9, scale: new Size(1.5, 1.5)})),
    ], true, true)),
    new Sprite(new Animation([
        new Frame(new Texture("UI/Login/Title.effect.3.0.png", new Point(846, 585)), 9.0, new Transform({opacity: 0.9, scale: new Size(1.5, 1.5)}), new Transform({opacity: 0.04, scale: new Size(1.5, 1.5)})),
        new Frame(new Texture("UI/Login/Title.effect.3.1.png", new Point(846, 585)), 9.0, new Transform({opacity: 0.04, scale: new Size(1.5, 1.5)}), new Transform({opacity: 0.9, scale: new Size(1.5, 1.5)}))
    ], true, true)),
    new Sprite(new Animation([
        new Frame(new Texture("UI/Login/Title.effect.4.0.png", new Point(866, 562)), 8.4, new Transform({opacity: 0.9, scale: new Size(1.5, 1.5)}), new Transform({opacity: 0.04, scale: new Size(1.5, 1.5)})),
        new Frame(new Texture("UI/Login/Title.effect.4.1.png", new Point(866, 562)), 8.4, new Transform({opacity: 0.04, scale: new Size(1.5, 1.5)}), new Transform({opacity: 0.9, scale: new Size(1.5, 1.5)}))
    ], true, true)),
    new Sprite(new Animation([
        new Frame(new Texture("UI/Login/Title.effect.5.0.png", new Point(875, 587)), 3.0, new Transform({opacity: 0.8, scale: new Size(1.5, 1.5)}), new Transform({opacity: 0, scale: new Size(1.5, 1.5)})),
        new Frame(new Texture("UI/Login/Title.effect.5.2.png", new Point(875, 587)), 7.5, new Transform({opacity: 0.8, scale: new Size(1.5, 1.5)})),
        new Frame(new Texture("UI/Login/Title.effect.5.1.png", new Point(875, 587)), 3.0, new Transform({opacity: 0, scale: new Size(1.5, 1.5)}), new Transform({opacity: 0.8, scale: new Size(1.5, 1.5)})),
    ], true, true)),
    new Sprite(new Texture("UI/Login/Title.logo.png", new Point(507, 595), new Size(556, 307))),
    new Sprite(new Texture("UI/Login/Title.signboard.png", new Point(676, 320), new Size(471, 302))),
    new Sprite(new Texture("UI/Login/1024frame.png", new Point(512, 384), new Size(1024, 768))),
];
