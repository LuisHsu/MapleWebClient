/**
 * @category UI
 * @module UILogin
 */

import { Music } from "../audio/Audio";
import { Button, MapleButton } from "../components/Button";
import { TextInput } from "../components/TextInput";
import Animation, { Frame } from "../graphics/Animation";
import Canvas, { Transform } from "../graphics/Canvas";
import { Sprite } from "../graphics/Sprite";
import { Texture } from "../graphics/Texture";
import { KeyType, TabFocus } from "../io/Keyboard";
import Window from "../io/Window";
import { Point, Size } from "../Types";
import { UIElement } from "./UIElement";
import { UILoginState, LoginState } from "./UILoginState";
import { UIWorldSelect } from "./UIWorldSelect";

export class UILogin extends UIElement implements LoginState {

    constructor(parent: UILoginState){
        super(login_sprites());
        this.parent = parent;
        Music.play("Login", 1, true);
        this.login_button.state = Button.State.DISABLED;
        this.login_button.focus = () => {
            if(this.account_input.value() && this.password_input.value()){
                this.login_button.focused = true;
            }else{
                TabFocus.update(KeyType.Tab);
            }
        }
        let saved_account = window.localStorage.getItem("account");
        this.account_input = new TextInput(new Point(678, 401), new Size(185, 24), {
            color: "white",
            value: saved_account,
            focus_enter: () => {
                TabFocus.update(KeyType.Tab);
            }
        });
        this.password_input = new TextInput(new Point(678, 364), new Size(185, 24), {
            color: "white",
            type: "password",
            focus_enter: () => {
                if(this.account_input.value() && this.password_input.value()){
                    this.login();
                }
            },
        });
        this.save_account = (saved_account !== null);
        this.tab_focus = new TabFocus([
            this.account_input,
            this.password_input,
            this.login_button,
            this.account_save_button,
            this.quit_button,
        ]);
        TabFocus.update(KeyType.Tab);
    }

    login(): void {
        // Save account
        if(this.save_account){
            window.localStorage.setItem("account", this.account_input.value());
        }else{
            window.localStorage.removeItem("account");
        }
        // Clean input
        this.account_input.clean();
        this.password_input.clean();

        // TODO: login api
        this.tab_focus.remove();
        this.parent.change_state(
            new UIWorldSelect(this.parent),
            UILoginState.Direction.Down
        )
        console.log(`
            ${this.account_input.value()}
            ${this.password_input.value()}
        `);
    }

    private toggle_save_account(): void {
        this.save_account = !this.save_account;
    }

    draw(transform: Transform): void {
        super.draw(transform);
        this.account_save_button.draw(transform.concat(new Transform({scale: new Size(1.25, 1.25)})));
        Canvas.draw_texture(this.account_save_status[this.save_account ? 1 : 0], transform.concat(new Transform({scale: new Size(1.25, 1.25)})));
    }

    fg_draw(transform: Transform): void {
        this.login_button.state = (this.account_input.value() && this.password_input.value()) ? Button.State.NORMAL : Button.State.DISABLED;
        this.login_button.draw(transform.concat(new Transform({scale: new Size(1.25, 1.25)})));
        this.quit_button.draw(transform.concat(new Transform({scale: new Size(1.3, 1.3)})));
    }

    mouse_move(position: Point): void {
        this.login_button.update_hover(position);
        this.quit_button.update_hover(position);
        this.account_save_button.update_hover(position);
    }

    mouse_down(position: Point): void {
        this.login_button.update_pressed(position);
        this.quit_button.update_pressed(position);
        this.account_save_button.update_pressed(position);
    }

    mouse_up(position: Point): void {
        this.login_button.update_released(position);
        this.quit_button.update_released(position);
        this.account_save_button.update_released(position);
    }

    left_click(position: Point): void {
        this.login_button.handle_click(position, new Point, this.login.bind(this));
        this.quit_button.handle_click(position, new Point, Window.quit);
        this.account_save_button.handle_click(position, new Point, this.toggle_save_account.bind(this));
        this.account_input.handle_click();
        this.password_input.handle_click();
    }

    key_up(key: KeyType): void {
        TabFocus.update(key);
    }

    private save_account: boolean = false;

    private account_input: TextInput;
    private password_input: TextInput;

    private tab_focus: TabFocus;

    private login_button: MapleButton = new MapleButton({
        pressed: new Texture("UI/Login/Title.BtLogin.pressed.0.png"),
        normal: new Texture("UI/Login/Title.BtLogin.normal.0.png"),
        hovered: new Texture("UI/Login/Title.BtLogin.mouseOver.0.png"),
        disabled: new Texture("UI/Login/Title.BtLogin.disabled.0.png"),
        focused: new Texture("UI/Login/Title.BtLogin.mouseOver.0.png"),
    }, new Point(842, 409), this.login.bind(this));

    private quit_button: MapleButton = new MapleButton({
        pressed: new Texture("UI/Login/Title.BtQuit.pressed.0.png"),
        normal: new Texture("UI/Login/Title.BtQuit.normal.0.png"),
        hovered: new Texture("UI/Login/Title.BtQuit.mouseOver.0.png"),
        disabled: new Texture("UI/Login/Title.BtQuit.disabled.0.png"),
        focused: new Texture("UI/Login/Title.BtQuit.mouseOver.0.png"),
    }, new Point(838, 264), Window.quit);

    private account_save_button: MapleButton = new MapleButton({
        pressed: new Texture("UI/Login/Title.BtEmailSave.pressed.0.png"),
        normal: new Texture("UI/Login/Title.BtEmailSave.normal.0.png"),
        hovered: new Texture("UI/Login/Title.BtEmailSave.mouseOver.0.png"),
        disabled: new Texture("UI/Login/Title.BtEmailSave.disabled.0.png"),
        focused: new Texture("UI/Login/Title.BtEmailSave.mouseOver.0.png"),
    }, new Point(615, 338), this.toggle_save_account.bind(this));

    private account_save_status: Texture[] = [
        new Texture("UI/Login/Title.check.0.png", {offset: new Point(567, 338)}),
        new Texture("UI/Login/Title.check.1.png", {offset: new Point(567, 338)}),
    ];

    parent: UILoginState;
}

const login_sprites = (): Sprite[] => [
    new Sprite(new Texture("Map/Back/back.11.png", {size: new Size(1080, 810), offset: new Point(475, 360)})),
    new Sprite(new Animation([
        new Frame(new Texture("UI/Login/Title.effect.0.0.png", {offset: new Point(935, 565)}), 4.5, new Transform({opacity: 0.9, scale: new Size(1.5, 1.5)}), new Transform({opacity: 0, scale: new Size(1.5, 1.5)})),
        new Frame(new Texture("UI/Login/Title.effect.0.2.png", {offset: new Point(935, 565)}), 3, new Transform({scale: new Size(1.5, 1.5), opacity: 0.9})),
        new Frame(new Texture("UI/Login/Title.effect.0.1.png", {offset: new Point(935, 565)}), 4.5, new Transform({opacity: 0, scale: new Size(1.5, 1.5)}), new Transform({opacity: 0.9, scale: new Size(1.5, 1.5)})),
    ], true, true)),
    new Sprite(new Animation([
        new Frame(new Texture("UI/Login/Title.effect.1.0.png", {offset: new Point(830, 625)}), 7.5, new Transform({opacity: 0.9, scale: new Size(1.5, 1.5)}), new Transform({opacity: 0.04, scale: new Size(1.5, 1.5)})),
        new Frame(new Texture("UI/Login/Title.effect.1.1.png", {offset: new Point(830, 625)}), 7.5, new Transform({opacity: 0.04, scale: new Size(1.5, 1.5)}), new Transform({opacity: 0.9, scale: new Size(1.5, 1.5)}))
    ], true, true)),
    new Sprite(new Animation([
        new Frame(new Texture("UI/Login/Title.effect.2.0.png", {offset: new Point(770, 608)}), 5.1, new Transform({opacity: 0.9, scale: new Size(1.5, 1.5)}), new Transform({opacity: 0, scale: new Size(1.5, 1.5)})),
        new Frame(new Texture("UI/Login/Title.effect.2.2.png", {offset: new Point(770, 608)}), 5.1, new Transform({scale: new Size(1.5, 1.5), opacity: 0.9})),
        new Frame(new Texture("UI/Login/Title.effect.2.1.png", {offset: new Point(770, 608)}), 5.1, new Transform({opacity: 0, scale: new Size(1.5, 1.5)}), new Transform({opacity: 0.9, scale: new Size(1.5, 1.5)})),
    ], true, true)),
    new Sprite(new Animation([
        new Frame(new Texture("UI/Login/Title.effect.3.0.png", {offset: new Point(846, 585)}), 9.0, new Transform({opacity: 0.9, scale: new Size(1.5, 1.5)}), new Transform({opacity: 0.04, scale: new Size(1.5, 1.5)})),
        new Frame(new Texture("UI/Login/Title.effect.3.1.png", {offset: new Point(846, 585)}), 9.0, new Transform({opacity: 0.04, scale: new Size(1.5, 1.5)}), new Transform({opacity: 0.9, scale: new Size(1.5, 1.5)}))
    ], true, true)),
    new Sprite(new Animation([
        new Frame(new Texture("UI/Login/Title.effect.4.0.png", {offset: new Point(866, 562)}), 8.4, new Transform({opacity: 0.9, scale: new Size(1.5, 1.5)}), new Transform({opacity: 0.04, scale: new Size(1.5, 1.5)})),
        new Frame(new Texture("UI/Login/Title.effect.4.1.png", {offset: new Point(866, 562)}), 8.4, new Transform({opacity: 0.04, scale: new Size(1.5, 1.5)}), new Transform({opacity: 0.9, scale: new Size(1.5, 1.5)}))
    ], true, true)),
    new Sprite(new Animation([
        new Frame(new Texture("UI/Login/Title.effect.5.0.png", {offset: new Point(875, 587)}), 3.0, new Transform({opacity: 0.8, scale: new Size(1.5, 1.5)}), new Transform({opacity: 0, scale: new Size(1.5, 1.5)})),
        new Frame(new Texture("UI/Login/Title.effect.5.2.png", {offset: new Point(875, 587)}), 7.5, new Transform({opacity: 0.8, scale: new Size(1.5, 1.5)})),
        new Frame(new Texture("UI/Login/Title.effect.5.1.png", {offset: new Point(875, 587)}), 3.0, new Transform({opacity: 0, scale: new Size(1.5, 1.5)}), new Transform({opacity: 0.8, scale: new Size(1.5, 1.5)})),
    ], true, true)),
    new Sprite(new Texture("UI/Login/Title.logo.png", {offset: new Point(507, 595), size: new Size(556, 307)})),
    new Sprite(new Texture("UI/Login/Title.signboard.png", {offset: new Point(676, 320), size: new Size(471, 302)})),
];
