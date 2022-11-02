/**
 * @category Components
 * @module ComboBox
 */

import { Sound } from "../audio/Audio";
import canvas, { Transform } from "../graphics/Canvas";
import { Texture } from "../graphics/Texture";
import { Color, Point, Rect, Size, TextAlign } from "../Types";
import { Button } from "./Button";

export class ComboBox extends Button{

    state: Button.State = Button.State.NORMAL;
    options: [string, any][];
    size: Size;
    type: ComboBox.Type;
    font_size: number;
    index?: number;
    placeholder?: string;
    expanded: boolean = false;
    hovered?: number;

    constructor(
        options: [string, any][],
        type: ComboBox.Type,
        position: Point,
        size: Size,
        font_size: number,
        placeholder?: string
    ){
        super();
        this.options = options;
        this.position = position;
        this.size = size;
        this.type = type;
        this.font_size = font_size;
        this.placeholder = placeholder;
        if(this.placeholder === undefined){
            this.index = 0;
        }
        if(type == ComboBox.Type.Blue){
            this.textures = {
                [Button.State.PRESSED]: [new Texture(`UI/Basic/${type}.pressed.0.png`, {size: this.size})],
                [Button.State.HOVERED]: [new Texture(`UI/Basic/${type}.mouseOver.0.png`, {size: this.size})],
                [Button.State.DISABLED]: [new Texture(`UI/Basic/${type}.disabled.0.png`, {size: this.size})],
                [Button.State.NORMAL]: [new Texture(`UI/Basic/${type}.normal.0.png`, {size: this.size})],
            }
        }else{
            this.textures = {
                [Button.State.PRESSED]: [
                    new Texture(`UI/Basic/${type}.pressed.0.png`, {size: new Size(5, this.size.height), origin: new Point(2, this.size.height / 2)}),
                    new Texture(`UI/Basic/${type}.pressed.1.png`, {size: new Size(5, this.size.height), origin: new Point(2, this.size.height / 2)}),
                    new Texture(`UI/Basic/${type}.pressed.2.png`, {size: new Size(17, this.size.height)}),
                ],
                [Button.State.HOVERED]: [
                    new Texture(`UI/Basic/${type}.mouseOver.0.png`, {size: new Size(5, this.size.height), origin: new Point(2, this.size.height / 2)}),
                    new Texture(`UI/Basic/${type}.mouseOver.1.png`, {size: new Size(5, this.size.height), origin: new Point(2, this.size.height / 2)}),
                    new Texture(`UI/Basic/${type}.mouseOver.2.png`, {size: new Size(17, this.size.height)}),
                ],
                [Button.State.DISABLED]: [
                    new Texture(`UI/Basic/${type}.disabled.0.png`, {size: new Size(5, this.size.height), origin: new Point(2, this.size.height / 2)}),
                    new Texture(`UI/Basic/${type}.disabled.1.png`, {size: new Size(5, this.size.height), origin: new Point(2, this.size.height / 2)}),
                    new Texture(`UI/Basic/${type}.disabled.2.png`, {size: new Size(17, this.size.height)}),
                ],
                [Button.State.NORMAL]: [
                    new Texture(`UI/Basic/${type}.normal.0.png`, {size: new Size(5, this.size.height), origin: new Point(2, this.size.height / 2)}),
                    new Texture(`UI/Basic/${type}.normal.1.png`, {size: new Size(5, this.size.height), origin: new Point(2, this.size.height / 2)}),
                    new Texture(`UI/Basic/${type}.normal.2.png`, {size: new Size(17, this.size.height)}),
                ],
            }
        }
    }

    set_active(active: boolean){
        this.active = active;
    }

    draw(): void {
        if(this.active){
            canvas.open_scope(() => {
                canvas.apply_transform(new Transform({translate: this.position}));
                // Button texture
                const textures = this.textures[(this.state == Button.State.INVALID) ? Button.State.DISABLED : this.state];
                if(this.type == ComboBox.Type.Blue){
                    canvas.draw_texture(textures[0]);
                }else{
                    const actual_half = this.actual_size().div(2);
                    const width_mul = Math.floor(this.size.width / this.textures[this.state][1].size().width + 1);
                    
                    canvas.draw_texture(textures[0], new Transform({translate: new Point(-actual_half.width - textures[0].size().width / 2)}));
                    for(let i = 1; i <= width_mul + 1; ++i){
                        canvas.draw_texture(textures[1], new Transform({translate: new Point(-actual_half.width + textures[1].size().width * (i - 0.5))}));
                    }
                    canvas.draw_texture(textures[2], new Transform({translate: new Point(actual_half.width - textures[2].size().width / 2)}));
                }
                // Button text
                let inner_width = this.actual_size().width - textures[0].size().width - textures[2].size().width;
                let option_text = (this.index == undefined) ? this.placeholder : this.options[this.index][0];
                canvas.draw_text(option_text, this.font_size, new Point(-this.actual_size().width / 2 + textures[0].size().width + inner_width / 2, -this.font_size / 2), new Color(0, 0, 0), TextAlign.Center);

                if(this.expanded){
                    // Dropdown back
                    let dropdown_pos = new Point(-this.actual_size().width / 2, -this.size.height / 2);
                    canvas.draw_rect(Color.DustyGray, dropdown_pos, new Size(this.actual_size().width, this.size.height * this.options.length));

                    // Dropdown option
                    this.options.forEach(([label], index) => {
                        let bgColor = Color.Gallery;
                        if(this.hovered !== undefined && index == this.hovered){
                            bgColor = Color.GrayOlive;
                        }
                        canvas.draw_rect(
                            bgColor,
                            dropdown_pos.concat(new Point(1, -this.size.height * index - 1)),
                            new Size(this.actual_size().width - 2, this.size.height - 2));
                        canvas.draw_text(
                            label, this.font_size,
                            new Point(0, dropdown_pos.y - this.size.height * (index + 0.5) - this.font_size / 2),
                            Color.Black, TextAlign.Center
                        );
                    })
                }
            })
        }
    }

    update_hover(
        mouse_pos: Point,
        base_pos: Point = new Point,
        callback?: () => void
    ): void {
        super.update_hover(mouse_pos, base_pos, callback);
        if(this.expanded){
            let dropdown_bound = this.bounds(base_pos);
            dropdown_bound.top -= this.size.height;
            dropdown_bound.bottom -= this.size.height * this.options.length;
            if((mouse_pos.x <= dropdown_bound.right) && (mouse_pos.x >= dropdown_bound.left)
                && (mouse_pos.y <= dropdown_bound.top) && (mouse_pos.y >= dropdown_bound.bottom)
            ){
                Sound.play("BtMouseOver");
                this.hovered = Math.floor((dropdown_bound.top - mouse_pos.y) / this.size.height);
            }
        }
    }

    handle_click(
        mouse_pos: Point,
        callback: (value: any) => void,
        base_pos: Point = new Point
    ): void {
        super.handle_click(mouse_pos, () => {
            this.expanded = !this.expanded;
        }, base_pos);
        if(this.expanded){
            let dropdown_bound = this.bounds(base_pos);
            dropdown_bound.top -= this.size.height;
            dropdown_bound.bottom -= this.size.height * this.options.length;
            if((mouse_pos.x <= dropdown_bound.right) && (mouse_pos.x >= dropdown_bound.left)
                && (mouse_pos.y <= dropdown_bound.top) && (mouse_pos.y >= dropdown_bound.bottom)
            ){
                Sound.play("BtMouseClick");
                this.expanded = !this.expanded;
                this.index = Math.floor((dropdown_bound.top - mouse_pos.y) / this.size.height);
                this.hovered = this.index;
                callback(this.options[this.index][1]);
            }
        }
    }

    bounds(offset: Point): Rect {
        let origin = this.position.concat(offset);
        if(this.textures[this.state] && 
            this.textures[this.state][0].bitmap && (this.type == ComboBox.Type.Blue || (this.textures[this.state][1].bitmap && this.textures[this.state][2].bitmap))
        ){
            let half_size = this.actual_size().div(2);
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

    private actual_size(): Size {
        if(this.type == ComboBox.Type.Blue){
            return this.textures[this.state][0].size();
        }else{
            const width_mul = Math.floor(this.size.width / this.textures[this.state][1].size().width) + 1;
            return new Size(
                this.textures[this.state][0].size().width + this.textures[this.state][1].size().width * width_mul + this.textures[this.state][2].size().width,
                this.size.height
            );
        }
    }

    private textures: {[state in Button.State]?: Texture[]};

    focus: () => void;
    focus_enter: () => void;
    blur: () => void;
}

export namespace ComboBox{
    export enum Type{
        Default = "ComboBox",
        Blue = "ComboBox2",
        Brown = "ComboBox3",
        Basic = "ComboBox4",
        Black = "ComboBox5",
    }
}