/**
 * @category UI
 * @module UI
 */

import { Drawable } from "../graphics/Canvas";
import { NeedInit, Point } from "../Types";
import { Cursor, CursorState, MouseHandler } from "../io/Cursor";
import { UILogo } from "./UILogo";
import { KeyboardHandler, KeyType } from "../io/Keyboard";

export type UIState = Drawable & MouseHandler & KeyboardHandler;

export class UI implements Drawable, NeedInit, MouseHandler, KeyboardHandler{
    
    cursor: Cursor;

    init(): void{
        this.cursor = new Cursor;
        this.cursor.init();
        this.state = new UILogo;
    }

    change_state(state: UIState){
        this.state = state;
    }

    draw(): void {
        this.state.draw();
        this.cursor.draw();
    }

    mouse_move(position: Point): void {
        this.cursor.position = position;
        if(this.state.mouse_move){
            this.state.mouse_move(position);
        }
    }

    mouse_down(position: Point): void {
        this.cursor.position = position;
        this.saved_cursor_state = this.cursor.state();
        this.cursor.set_state(CursorState.Clicking);
        if(this.state.mouse_down){
            this.state.mouse_down(position);
        }
    }

    mouse_up(position: Point): void {
        this.cursor.position = position;
        this.cursor.set_state(this.saved_cursor_state);
        if(this.state.mouse_up){
            this.state.mouse_up(position);
        }
    }

    mouse_wheel(delta: number): void {
        if(this.state.mouse_wheel){
            this.state.mouse_wheel(delta);
        }
    }

    double_click(position: Point): void {
        if(this.state.double_click){
            this.state.double_click(position);
        }
    }

    right_click(position: Point): void {
        if(this.state.right_click){
            this.state.right_click(position);
        }
    }

    left_click(position: Point): void {
        if(this.state.left_click){
            this.state.left_click(position);
        }
    }

    key_down(key: KeyType): void {
        if(this.state.key_down){
            this.state.key_down(key);
        }
    }

    key_up(key: KeyType): void {
        if(this.state.key_up){
            this.state.key_up(key);
        }
    }

    private saved_cursor_state: CursorState = CursorState.Idle;
    private state: UIState;
}

let _UI = new UI;
export default _UI;