/**
 * @category Components
 * @module Button
 */

import GL, { Transform } from "../graphics/GL";
import { Texture } from "../graphics/Texture";
import { Drawable, Point, Rect } from "../Types";

export abstract class Button implements Drawable {
    state: Button.State;
    active: boolean;
    position: Point;
    abstract draw(transform?: Transform): void;
    abstract bounds(offset: Point): Rect;

    update_hover(
        mouse_pos: Point,
        base_pos: Point = new Point,
        callback?: () => void
    ): void {
        if(this.active && (this.state == Button.State.NORMAL || this.state == Button.State.HOVERED)){
            let bounds = this.bounds(base_pos);
            if((mouse_pos.x <= bounds.right) && (mouse_pos.x >= bounds.left)
                && (mouse_pos.y <= bounds.top) && (mouse_pos.y >= bounds.bottom)
            ){
                this.state = Button.State.HOVERED;
                if(callback){
                    callback();
                }
            }else{
                this.state = Button.State.NORMAL;
            }
        }
    }

    update_pressed(
        mouse_pos: Point,
        base_pos: Point = new Point,
        callback?: () => void
    ): void {
        if(this.active && (this.state == Button.State.NORMAL || this.state == Button.State.HOVERED)){
            let bounds = this.bounds(base_pos);
            if((mouse_pos.x <= bounds.right) && (mouse_pos.x >= bounds.left)
                && (mouse_pos.y <= bounds.top) && (mouse_pos.y >= bounds.bottom)
            ){
                this.state = Button.State.PRESSED;
                if(callback){
                    callback();
                }
            }
        }
    }

    update_released(
        mouse_pos: Point,
        base_pos: Point = new Point,
        callback?: () => void
    ): void {
        if(this.active && this.state == Button.State.PRESSED){
            let bounds = this.bounds(base_pos);
            if((mouse_pos.x <= bounds.right) && (mouse_pos.x >= bounds.left)
                && (mouse_pos.y <= bounds.top) && (mouse_pos.y >= bounds.bottom)
            ){
                this.state = Button.State.HOVERED;
                if(callback){
                    callback();
                }
            }
        }
    }

    handle_click(
        mouse_pos: Point,
        base_pos: Point = new Point,
        callback: () => void
    ): void {
        if(this.active && this.state != Button.State.DISABLED && this.state != Button.State.IDENTITY){
            let bounds = this.bounds(base_pos);
            if((mouse_pos.x <= bounds.right) && (mouse_pos.x >= bounds.left)
                && (mouse_pos.y <= bounds.top) && (mouse_pos.y >= bounds.bottom)
            ){
                callback();
            }
        }
    }
}

export namespace Button {
    export enum State {
        NORMAL,
        DISABLED,
        HOVERED,
        PRESSED,
        IDENTITY,
    }
}

export class MapleButton extends Button{

    state: Button.State = Button.State.NORMAL;
    active: boolean = true;
    position: Point;

    constructor(textures: {
        pressed: Texture,
        hovered: Texture,
        disabled: Texture,
        normal: Texture,
    }, position: Point = new Point){
        super();
        this.textures = {
            [Button.State.PRESSED]: textures.pressed,
            [Button.State.HOVERED]: textures.hovered,
            [Button.State.DISABLED]: textures.disabled,
            [Button.State.NORMAL]: textures.normal,
        }
        this.position = position;
    }

    draw(transform?: Transform): void {
        if(this.active){
            let offset = new Transform({offset: this.position});
            GL.draw_texture(this.textures[this.state], transform ? transform.concat(offset) : offset);
        }
    }

    bounds(offset: Point = new Point): Rect {
        let origin = this.position.concat(offset);
        if(this.textures[this.state] && this.textures[this.state].size){
            let half_size = this.textures[this.state].size.div(2);
            return new Rect(
                origin.y + half_size.height,
                origin.y - half_size.height,
                origin.x - half_size.width,
                origin.x + half_size.width
            )
        }else{
            return new Rect(0, 0, 0, 0);
        }
    }

    private textures: {[state in Button.State]?: Texture};
}