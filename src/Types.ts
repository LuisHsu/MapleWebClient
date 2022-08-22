import { Transform } from "./graphics/Canvas";
import { KeyType } from "./io/Keyboard";

/**
 * Point: 2D location
 */
export class Point{
    x: number;
    y: number;

    /**
     * @param x : x position
     * @param y : y position
     */
    constructor(x: number = 0, y: number = 0){
        this.x = x;
        this.y = y;
    }
    concat = (value: Point) => new Point(this.x + value.x, this.y + value.y);
    add = (value: number) => new Point(this.x + value, this.y + value);
    sub = (value: number) => this.add(-value);
    mul = (value: number) => new Point(this.x * value, this.y * value);
    div = (value: number) => new Point(this.x / value, this.y / value);
}

/**
 * Size: 2D size
 */
export class Size{
    width: number;
    height: number;
    constructor(w: number = 0, h: number = 0){
        this.width = w;
        this.height = h;
    }
    concat = (value: Size) => new Size(this.width * value.width, this.height * value.height);
    add = (value: number) => new Size(this.width + value, this.height + value);
    sub = (value: number) => this.add(-value);
    mul = (value: number) => new Size(this.width * value, this.height * value);
    div = (value: number) => new Size(this.width / value, this.height / value);
}

/**
 * Rect: 2D rectangle
 */
export class Rect{
    top: number;
    bottom: number;
    left: number;
    right: number;
    constructor(top: number, bottom: number, left: number, right: number){
        this.top = top;
        this.bottom = bottom;
        this.left = left;
        this.right = right;
    }
}

export enum TextAlign {
    Left = "left",
    Right = "right",
    Center = "center",
}

export class Color {
    r: number;
    g: number;
    b: number;
    a: number;
    constructor(r: number, g: number, b: number, a: number = 1){
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    toString(): string {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`
    }
}

export interface NeedInit {
    init(...args: any[]): void;
}
