import { Transform } from "./graphics/GL";

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
}

export interface Drawable {
    draw(transform: Transform): void;
}

export interface NeedInit {
    init(): void;
}