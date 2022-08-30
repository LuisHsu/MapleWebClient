/**
 * @category UI
 * @module UILoginState
 */

import { Transform } from "../graphics/Canvas";
import { Point, Size } from "../Types";
import { UIState } from "./UI";
import { UILogin } from "./UILogin";
import { KeyType } from "../io/Keyboard";
import { UIElement } from "./UIElement";
import { Sprite } from "../graphics/Sprite";
import { Texture } from "../graphics/Texture";
import Window from "../io/Window";
import Setting from "../Setting";
import LoginSession from "../net/LoginSession";
import { UILoginNotice } from "./UILoginNotice";

export interface LoginState extends UIState {
    readonly parent: UILoginState;
    fg_draw?(transform: Transform): void;
    clean(): void;
}

export class UILoginState extends UIElement implements UIState {

    constructor(){
        super([
            new Sprite(new Texture("UI/Login/1024frame.png", {offset: new Point(512, 384), size: new Size(1024, 768)})),
        ])
        this.login_state = new UILogin(this);
        LoginSession.init(this);
    }

    draw(transform: Transform): void {
        if(this.context !== null){
            let next_offset = new Point;
            switch(this.context.direction){
                case UILoginState.Direction.Up:
                    this.context.offset.y += Window.size.height / Setting.FPS;
                    next_offset.y = this.context.offset.y - Window.size.height;
                break;
                case UILoginState.Direction.Down:
                    this.context.offset.y -= Window.size.height / Setting.FPS;
                    next_offset.y = Window.size.height + this.context.offset.y;
                break;
            }
            this.login_state.draw(transform.concat(new Transform({offset: this.context.offset})));
            this.context.next.draw(transform.concat(new Transform({offset: next_offset})));
        }else{
            this.login_state.draw(transform);
        }
        super.draw(transform);
        if(this.context === null && this.login_state.fg_draw){
            this.login_state.fg_draw(transform);
        }
        if(this.notice != null){
            this.notice.draw(transform);
        }
    }

    change_state(next: LoginState, direction: UILoginState.Direction){
        this.login_state.clean();
        this.context = new UILoginState.TransformContext(next, direction);
        setTimeout(() => {
            this.login_state = this.context.next;
            this.context = null;
        }, 1000);
    }

    set_notice(
        type: UILoginNotice.Type,
        message: UILoginNotice.MessageID,
        onConfirm?: () => void,
        onCancel?: () => void,
    ){
        this.notice = new UILoginNotice(type, message,
            () => {
                this.notice_cloce();
                if(onConfirm){
                    onConfirm();
                }
            },
            onCancel? (() => {
                this.notice_cloce();
                if(onCancel){
                    onCancel();
                }
            }) : null
        );
    }

    mouse_move(position: Point): void {
        if((this.context === null) && this.login_state.mouse_move){
            this.login_state.mouse_move(position);
        }
        if(this.notice !== null){
            this.notice.mouse_move(position);
        }
    }

    mouse_down(position: Point): void {
        if((this.context === null) && this.login_state.mouse_down){
            this.login_state.mouse_down(position);
        }
        if(this.notice !== null){
            this.notice.mouse_down(position);
        }
    }

    mouse_up(position: Point): void {
        if((this.context === null) && this.login_state.mouse_up){
            this.login_state.mouse_up(position);
        }
        if(this.notice !== null){
            this.notice.mouse_up(position);
        }
    }

    mouse_wheel(delta: number): void {
        if((this.context === null) && this.login_state.mouse_wheel){
            this.login_state.mouse_wheel(delta);
        }
    }

    double_click(position: Point): void {
        if((this.context === null) && this.login_state.double_click){
            this.login_state.double_click(position);
        }
    }

    right_click(position: Point): void {
        if((this.context === null) && this.login_state.right_click){
            this.login_state.right_click(position);
        }
    }

    left_click(position: Point): void {
        if((this.context === null) && this.login_state.left_click){
            this.login_state.left_click(position);
        }
        if(this.notice !== null){
            this.notice.left_click(position);
        }
    }

    key_down(key: KeyType): void {
        if((this.context === null) && this.login_state.key_down){
            this.login_state.key_down(key);
        }
    }

    key_up(key: KeyType): void {
        if((this.context === null) && this.login_state.key_up){
            this.login_state.key_up(key);
        }
    }

    notice_cloce(): void{
        this.notice.tab_focus.remove();
        this.notice = null;
    }

    public notice: UILoginNotice = null;
    private login_state: LoginState;
    private context: UILoginState.TransformContext = null;
}

export namespace UILoginState {
    export enum Direction{
        Up,
        Down,
    }
    export class TransformContext {
        next: LoginState;
        offset: Point;
        direction: Direction;
        constructor(next: LoginState, direction: Direction){
            this.next = next;
            this.direction = direction;
            this.offset = new Point;
        }
    }
}