/**
 * @category UI
 * @module UILoginState
 */

import canvas, { Transform } from "../graphics/Canvas";
import { Point, Size } from "../Types";
import { UIState } from "./UI";
import { UILogin } from "./UILogin";
import { KeyType } from "../io/Keyboard";
import { UIElement } from "./UIElement";
import { Sprite } from "../graphics/Sprite";
import { Texture } from "../graphics/Texture";
import Window from "../io/Window";
import LoginSession from "../net/LoginSession";
import { UILoginNotice } from "./UILoginNotice";

export interface LoginState extends UIState {
    readonly parent: UILoginState;
    draw_state(offset?: Point): void;
    draw_foreground?(): void;
    clean(): void;
}

export class UILoginState extends UIElement implements UIState {

    constructor(){
        super([
            new Sprite(new Texture("UI/Login/1024frame.png", {
                size: new Size(1024, 768),
                origin: new Point(0, 768),
            })),
        ])
        this.login_state = new UILogin(this);
        LoginSession.init(this);
    }

    draw(): void{
        canvas.open_scope(() => {
            if(this.context !== null){
                const elapsed = Date.now() - this.context.timestamp;
                if(elapsed >= 900){
                    this.login_state = this.context.next;
                    this.context = null;
                    this.login_state.draw_state();
                }else{
                    let next_offset = new Point;
                    switch(this.context.direction){
                        case UILoginState.Direction.Up:
                            this.context.offset.y = Window.size.height * (elapsed / 900);
                            next_offset.y = this.context.offset.y - Window.size.height;
                            this.login_state.draw_state(this.context.offset);
                            this.context.next.draw_state(next_offset);
                        break;
                        case UILoginState.Direction.Down:
                            this.context.offset.y = -Window.size.height * (elapsed / 900);
                            next_offset.y = Window.size.height + this.context.offset.y;
                            this.context.next.draw_state(next_offset);
                            this.login_state.draw_state(this.context.offset);
                        break;
                    }
                    
                }
            }else{
                this.login_state.draw_state();
            }
            super.draw();
            if(this.context === null && this.login_state.draw_foreground){
                this.login_state.draw_foreground();
            }
            if(this.notice != null){
                this.notice.draw();
            }
        })
    };

    change_state(next: LoginState, direction: UILoginState.Direction){
        this.login_state.clean();
        this.context = new UILoginState.TransformContext(next, direction);
    }

    set_notice(
        type: UILoginNotice.Type,
        message: UILoginNotice.MessageID,
        onConfirm?: () => void,
        onCancel?: () => void,
    ){
        this.notice = new UILoginNotice(type, message,
            () => {
                this.notice_close();
                if(onConfirm){
                    onConfirm();
                }
            },
            onCancel? (() => {
                this.notice_close();
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

    notice_close(): void{
        this.notice.tab_focus.remove();
        this.notice = null;
    }

    is_changing(){
        return this.context !== null;
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
        timestamp: number;
        constructor(next: LoginState, direction: Direction){
            this.next = next;
            this.direction = direction;
            this.offset = new Point;
            this.timestamp = Date.now();
        }
    }
}