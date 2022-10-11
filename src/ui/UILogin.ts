/**
 * @category UI
 * @module UILogin
 */

import { Music } from "../audio/Audio";
import { Button, MapleButton } from "../components/Button";
import { TextInput } from "../components/TextInput";
import canvas, { Transform } from "../graphics/Canvas";
import { Sprite } from "../graphics/Sprite";
import { Texture } from "../graphics/Texture";
import { KeyType, TabFocus } from "../io/Keyboard";
import Window from "../io/Window";
import LoginSession from "../net/LoginSession";
import { Color, Point, Size } from "../Types";
import { UIElement } from "./UIElement";
import { UILoginState, LoginState } from "./UILoginState";

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
        this.account_input = new TextInput(new Point(669, 410), new Size(185, 24), {
            color: "white",
            value: saved_account,
            focus_enter: () => {
                TabFocus.update(KeyType.Tab);
            }
        });
        this.password_input = new TextInput(new Point(669, 373), new Size(185, 24), {
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
        Window.set_background(new Color(0, 0, 0));
    }

    login(): void {
        // Save account
        if(this.save_account){
            window.localStorage.setItem("account", this.account_input.value());
        }else{
            window.localStorage.removeItem("account");
        }

        // Login
        LoginSession.open(() => {
            LoginSession.login(this.account_input.value(), this.password_input.value());
        });
    }

    clean(): void {
        this.account_input.clean();
        this.password_input.clean();
        this.tab_focus.remove();
    }

    private toggle_save_account(): void {
        this.save_account = !this.save_account;
    }

    draw_state(offset?: Point): void {
        canvas.open_scope(() => {
            if(offset){
                canvas.apply_transform(new Transform({translate: offset}))
            }
            this.draw();
        });
    }

    draw(){
        super.draw();
        this.account_input.set_active(this.parent.notice === null && !this.parent.is_changing());
        this.password_input.set_active(this.parent.notice === null && !this.parent.is_changing());
        if(this.parent.notice === null){
            this.tab_focus.activate();
        }else{
            this.tab_focus.deactivate();
        }
        this.account_input.draw();
        this.password_input.draw();
    };

    draw_foreground(){
        this.login_button.state = (this.account_input.value() && this.password_input.value()) ? Button.State.NORMAL : Button.State.DISABLED;
        this.account_save_button.draw();
        canvas.draw_texture(this.account_save_status[this.save_account ? 1 : 0]);
        this.login_button.draw();
        this.quit_button.draw();
    };

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
        this.login_button.handle_click(position, this.login.bind(this));
        this.quit_button.handle_click(position, Window.quit);
        this.account_save_button.handle_click(position, this.toggle_save_account.bind(this));
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
    }, new Point(831, 418), this.login.bind(this), new Transform({scale: new Size(1.25, 1.25)}));

    private quit_button: MapleButton = new MapleButton({
        pressed: new Texture("UI/Login/Title.BtQuit.pressed.0.png"),
        normal: new Texture("UI/Login/Title.BtQuit.normal.0.png"),
        hovered: new Texture("UI/Login/Title.BtQuit.mouseOver.0.png"),
        disabled: new Texture("UI/Login/Title.BtQuit.disabled.0.png"),
        focused: new Texture("UI/Login/Title.BtQuit.mouseOver.0.png"),
    }, new Point(829, 274), Window.quit, new Transform({scale: new Size(1.3, 1.3)}));

    private account_save_button: MapleButton = new MapleButton({
        pressed: new Texture("UI/Login/Title.BtEmailSave.pressed.0.png"),
        normal: new Texture("UI/Login/Title.BtEmailSave.normal.0.png"),
        hovered: new Texture("UI/Login/Title.BtEmailSave.mouseOver.0.png"),
        disabled: new Texture("UI/Login/Title.BtEmailSave.disabled.0.png"),
        focused: new Texture("UI/Login/Title.BtEmailSave.mouseOver.0.png"),
    }, new Point(605, 347), this.toggle_save_account.bind(this), new Transform({scale: new Size(1.25, 1.25)}));

    private account_save_status: Texture[] = [
        new Texture("UI/Login/Title.check.0.png", {size: new Size(19, 16), origin: new Point(542, 354)}),
        new Texture("UI/Login/Title.check.1.png", {size: new Size(19, 16), origin: new Point(542, 354)}),
    ];

    parent: UILoginState;
}

const login_sprites = (): Sprite[] => [
    new Sprite(new Texture("Map/Back/back.11.png", {size: new Size(1080, 810), origin: new Point(-60, 768)})),
    new Sprite(new Texture("UI/Login/Title.signboard.png", {origin: new Point(430, 480), size: new Size(471, 302)})),
    new Sprite(new Texture("UI/Login/Title.logo.png", {origin: new Point(250, 740), size: new Size(556, 307)})),
];
