/**
 * @category IO
 * @module Cursor
 */

import Animation, { Frame } from "../graphics/Animation";
import canvas, { Drawable, Transform } from "../graphics/Canvas";
import { Texture } from "../graphics/Texture";
import { NeedInit, Point, Size } from "../Types";
import Window from "./Window";

export class Cursor implements Drawable, NeedInit {
    public position: Point = new Point(Window.size.width / 2, Window.size.height / 2);
    init(): void {
        this.set_state(CursorState.Idle);
    }
    state(): CursorState {
        return this._state;
    }
    set_state(state: CursorState): void {
        if(this._animation){
            this._animation.stop();
        }
        this._animation = new Animation(CursorData[state].map(data => new Frame(
            [new Texture(`UI/Cursor/${data.path}`, {size: data.size, origin: data.offset})],
            data.delay
        )), true);
        this._animation.start();
        this._state = state;
    }
    draw: () => void = canvas.open_scope(() => {
        canvas.apply_transform(new Transform({translate: this.position}));
        this._animation.draw();
    })
    private _state: CursorState;
    private _animation: Animation = null;
};

export enum CursorState {
    Idle = 0,
    CanClick,
    Game,
    House,
    CanGrab,
    Gift,
    VScroll,
    HScroll,
    VScrollIdle,
    HScrollIdle,
    Grabbing,
    Clicking,
    RClick,
}

type CursorDataType = {
    path: string,
    size: Size,
    offset: Point,
    delay?: number,
}

const CursorData: CursorDataType[][] = [
    [
        {
            path: "Cursor.0.0.png",
            size: new Size(24, 28),
            offset: new Point(0, 3),
        },
    ],
    [
        {
            path: "Cursor.1.0.png",
            size: new Size(29, 30),
            offset: new Point(3, 6),
            delay: 500,
        },
        {
            path: "Cursor.1.1.png",
            size: new Size(30, 28),
            offset: new Point(4, 4),
            delay: 500,
        },
    ],
    [
        {
            path: "Cursor.2.0.png",
            size: new Size(32, 28),
            offset: new Point(3, 6),
            delay: 200,
        },
        {
            path: "Cursor.2.1.png",
            size: new Size(33, 26),
            offset: new Point(4, 4),
            delay: 100,
        },
        {
            path: "Cursor.2.2.png",
            size: new Size(33, 26),
            offset: new Point(4, 4),
            delay: 100,
        },
        {
            path: "Cursor.2.3.png",
            size: new Size(32, 28),
            offset: new Point(3, 6),
            delay: 100,
        },
        {
            path: "Cursor.2.4.png",
            size: new Size(32, 28),
            offset: new Point(3, 6),
            delay: 100,
        },
        {
            path: "Cursor.2.5.png",
            size: new Size(33, 26),
            offset: new Point(4, 4),
            delay: 100,
        },
        {
            path: "Cursor.2.6.png",
            size: new Size(33, 26),
            offset: new Point(4, 4),
            delay: 100,
        },
    ],
    [
        {
            path: "Cursor.3.0.png",
            size: new Size(34, 31),
            offset: new Point(3, 9),
            delay: 200,
        },
        {
            path: "Cursor.3.1.png",
            size: new Size(39, 37),
            offset: new Point(4, 15),
            delay: 200,
        },
        {
            path: "Cursor.3.2.png",
            size: new Size(38, 37),
            offset: new Point(3, 15),
            delay: 200,
        },
        {
            path: "Cursor.3.3.png",
            size: new Size(35, 31),
            offset: new Point(4, 9),
            delay: 200,
        },
        {
            path: "Cursor.3.4.png",
            size: new Size(38, 37),
            offset: new Point(3, 15),
            delay: 200,
        },
        {
            path: "Cursor.3.5.png",
            size: new Size(39, 37),
            offset: new Point(4, 15),
            delay: 200,
        },
    ],
    [
        {
            path: "Cursor.4.0.png",
            size: new Size(29, 30),
            offset: new Point(3, 6),
            delay: 50,
        },
        {
            path: "Cursor.4.1.png",
            size: new Size(30, 28),
            offset: new Point(4, 4),
            delay: 50,
        },
    ],
    [
        {
            path: "Cursor.5.0.png",
            size: new Size(27, 29),
            offset: new Point(6, 7),
            delay: 250,
        },
        {
            path: "Cursor.5.1.png",
            size: new Size(25, 23),
            offset: new Point(6, 3),
            delay: 100,
        },
        {
            path: "Cursor.5.2.png",
            size: new Size(22, 21),
            offset: new Point(5, 2),
            delay: 200,
        },
    ],
    [
        {
            path: "Cursor.6.0.png",
            size: new Size(32, 28),
            offset: new Point(3, 6),
            delay: 200,
        },
        {
            path: "Cursor.6.1.png",
            size: new Size(33, 26),
            offset: new Point(4, 4),
            delay: 100,
        },
        {
            path: "Cursor.6.2.png",
            size: new Size(33, 26),
            offset: new Point(4, 4),
            delay: 100,
        },
        {
            path: "Cursor.6.3.png",
            size: new Size(32, 28),
            offset: new Point(3, 6),
            delay: 100,
        },
        {
            path: "Cursor.6.4.png",
            size: new Size(32, 28),
            offset: new Point(3, 6),
            delay: 100,
        },
        {
            path: "Cursor.6.5.png",
            size: new Size(33, 26),
            offset: new Point(4, 4),
            delay: 100,
        },
        {
            path: "Cursor.6.6.png",
            size: new Size(33, 26),
            offset: new Point(4, 4),
            delay: 100,
        },
    ],
    [
        {
            path: "Cursor.7.0.png",
            size: new Size(33, 33),
            offset: new Point(12, 11),
            delay: 200,
        },
        {
            path: "Cursor.7.1.png",
            size: new Size(33, 35),
            offset: new Point(12, 13),
            delay: 200,
        },
        {
            path: "Cursor.7.2.png",
            size: new Size(33, 36),
            offset: new Point(12, 14),
            delay: 200,
        },
        {
            path: "Cursor.7.4.png",
            size: new Size(33, 35),
            offset: new Point(12, 13),
            delay: 200,
        },
    ],
    [
        {
            path: "Cursor.8.0.png",
            size: new Size(30, 35),
            offset: new Point(9, 13),
            delay: 200,
        },
        {
            path: "Cursor.8.1.png",
            size: new Size(32, 35),
            offset: new Point(11, 13),
            delay: 200,
        },
        {
            path: "Cursor.8.2.png",
            size: new Size(33, 35),
            offset: new Point(12, 13),
            delay: 200,
        },
        {
            path: "Cursor.8.4.png",
            size: new Size(32, 35),
            offset: new Point(11, 13),
            delay: 200,
        },
    ],
    [
        {
            path: "Cursor.9.0.png",
            size: new Size(33, 36),
            offset: new Point(12, 14),
        },
    ],
    [
        {
            path: "Cursor.10.0.png",
            size: new Size(33, 35),
            offset: new Point(12, 13),
        },
    ],
    [
        {
            path: "Cursor.11.0.png",
            size: new Size(22, 21),
            offset: new Point(5, 2),
        },
    ],
    [
        {
            path: "Cursor.12.0.png",
            size: new Size(25, 23),
            offset: new Point(4, 1),
        },
    ],
    [
        {
            path: "Cursor.13.0.png",
            size: new Size(29, 30),
            offset: new Point(3, 6),
            delay: 50,
        },
        {
            path: "Cursor.13.1.png",
            size: new Size(30, 28),
            offset: new Point(4, 4),
            delay: 50,
        },
    ],
]

export interface MouseHandler {
    right_click?(position: Point): void;
    double_click?(position: Point): void;
    mouse_down?(position: Point): void;
    mouse_up?(position: Point): void;
    left_click?(position: Point): void;
    mouse_move?(position: Point): void;
    mouse_wheel?(delta: number): void;
}