/**
 * @category IO
 * @module UI
 */

import { Transform } from "../graphics/GL";
import { Drawable, MouseHandler, NeedInit, Point } from "../Types";
import { Cursor, CursorState } from "./Cursor";

export class UI implements Drawable, NeedInit, MouseHandler {
    
    cursor: Cursor;

    init(): void{
        this.cursor = new Cursor;
        this.cursor.init();
    }

    draw(transform: Transform = new Transform): void {
        this.cursor.draw(transform);
    }

    mouse_move(position: Point): void {
        this.cursor.position = position;
    }

    mouse_down(position: Point): void {
        this.cursor.position = position;
        this.saved_cursor_state = this.cursor.state();
        this.cursor.set_state(CursorState.Clicking);
    }

    mouse_up(position: Point): void {
        this.cursor.position = position;
        this.cursor.set_state(this.saved_cursor_state);
    }

    mouse_wheel(delta: number): void {
        
    }

    private saved_cursor_state: CursorState = CursorState.Idle;
}

export namespace UI{
    export enum State{
        LOGIN,
        GAME,
        CASHSHOP,
    }
}

let _UI = new UI;
export default _UI;