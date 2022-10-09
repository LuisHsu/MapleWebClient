/**
 * @category Components
 * @module Button
 */

import { Sound } from "../audio/Audio";
import canvas, { Drawable, Transform } from "../graphics/Canvas";
import { Texture } from "../graphics/Texture";
import { TabHandler } from "../io/Keyboard";
import { Point, Rect } from "../Types";

export abstract class Button implements Drawable, TabHandler {
    state: Button.State;
    active: boolean;
    position: Point;
    tab_active: boolean = true;
    
    abstract draw(): void;
    abstract bounds(offset: Point): Rect;
    abstract focus?(): void;
    abstract blur?(): void;
    abstract focus_enter?(): void;

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
                if(this.state == Button.State.NORMAL){
                    Sound.play("BtMouseOver");
                    this.state = Button.State.HOVERED;
                }
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
        callback: () => void,
        base_pos: Point = new Point
    ): void {
        if(this.active && this.state != Button.State.DISABLED && this.state != Button.State.IDENTITY){
            let bounds = this.bounds(base_pos);
            if((mouse_pos.x <= bounds.right) && (mouse_pos.x >= bounds.left)
                && (mouse_pos.y <= bounds.top) && (mouse_pos.y >= bounds.bottom)
            ){
                Sound.play("BtMouseClick");
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

export class MapleButton extends Button {

    state: Button.State = Button.State.NORMAL;
    active: boolean = true;
    position: Point;
    focused: boolean = false;
    transform?: Transform;

    constructor(textures: {
        pressed: Texture,
        hovered: Texture,
        disabled: Texture,
        normal: Texture,
        focused?: Texture,
    }, position: Point = new Point, focus_click?: () => void, transform?: Transform){
        super();
        this.textures = {
            [Button.State.PRESSED]: textures.pressed,
            [Button.State.HOVERED]: textures.hovered,
            [Button.State.DISABLED]: textures.disabled,
            [Button.State.NORMAL]: textures.normal,
        }
        this.position = position;
        this.transform = transform;
        this.focus_texture = textures.focused;
        this.focus_enter = focus_click;
    }

    draw(): void {
        if(this.active){
            canvas.open_scope(() => {
                let transform;
                if(this.transform){
                    transform = this.transform.concat(new Transform({translate: this.position}));
                }else{
                    transform = new Transform({translate: this.position});
                }
                canvas.apply_transform(transform);
                canvas.draw_texture(this.textures[this.state]);
                if(this.focused && this.focus_texture){
                    canvas.draw_texture(this.focus_texture);
                }
            })
        }
    }

    bounds(offset: Point = new Point): Rect {
        let origin = this.position.concat(offset);
        if(this.textures[this.state] && this.textures[this.state].bitmap){
            let half_size = this.textures[this.state].size().div(2);
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

    focus(): void {
        this.focused = true;
    }

    blur(): void {
        this.focused = false;
    }

    focus_enter?(): void;

    private textures: {[state in Button.State]?: Texture};
    private focus_texture?: Texture;
}