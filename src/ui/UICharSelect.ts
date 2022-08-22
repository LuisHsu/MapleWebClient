/**
 * @category UI
 * @module UICharSelect
 */

import { MapleButton } from "../components/Button";
import Canvas, { Transform } from "../graphics/Canvas";
import { Sprite } from "../graphics/Sprite";
import { Texture } from "../graphics/Texture";
import { Color, Point, Size, TextAlign } from "../Types";
import { UIElement } from "./UIElement";
import { LoginState, UILoginState } from "./UILoginState";
import { UIWorldSelect } from "./UIWorldSelect";

export class UICharSelect extends UIElement implements LoginState {
    constructor(parent: UILoginState, selected_channel: number){
        super(char_select_sprites());
        this.parent = parent;
        this.selected_channel = selected_channel;
    }

    return_world_select(){
        this.parent.change_state(
            new UIWorldSelect(this.parent),
            UILoginState.Direction.Up
        );
    }

    draw(transform?: Transform): void {
        super.draw(transform);
    }

    fg_draw(transform: Transform): void {
        Canvas.draw_texture(this.step_texture, transform);
        Canvas.draw_texture(this.selected_world_texture, transform);
        Canvas.draw_text(this.selected_world, 15, new Point(105, 631), new Color(255, 255, 255), TextAlign.Center);
        Canvas.draw_text(`Ch. ${this.selected_channel + 1}`, 15, new Point(105, 611), new Color(255, 255, 255), TextAlign.Center);
        this.return_button.draw(transform);
    }

    mouse_move(position: Point): void {
        this.return_button.update_hover(position);
    }

    mouse_down(position: Point): void {
        this.return_button.update_pressed(position);
    }

    mouse_up(position: Point): void {
        this.return_button.update_released(position);
    }

    left_click(position: Point): void {
        this.return_button.handle_click(position, new Point, this.return_world_select.bind(this));
    }

    private selected_world: string = "測試機";
    private selected_channel: number;
    private step_texture: Texture = new Texture("UI/CharSelect/Common.step.2.png", {offset: new Point(75, 700), size: new Size(165, 63)});
    private selected_world_texture: Texture = new Texture("UI/CharSelect/Common.selectWorld.png", {offset: new Point(75, 630), size: new Size(165, 63)});

    private return_button: MapleButton = new MapleButton({
        pressed: new Texture("UI/CharSelect/Common.BtStart.pressed.png", {size: new Size(136, 57)}),
        normal: new Texture("UI/CharSelect/Common.BtStart.normal.png", {size: new Size(136, 57)}),
        hovered: new Texture("UI/CharSelect/Common.BtStart.mouseOver.png", {size: new Size(136, 57)}),
        disabled: new Texture("UI/CharSelect/Common.BtStart.disabled.png", {size: new Size(136, 57)}),
        focused: new Texture("UI/CharSelect/Common.BtStart.mouseOver.png", {size: new Size(136, 57)}),
    }, new Point(73, 125), this.return_world_select.bind(this));

    parent: UILoginState;
}

const char_select_sprites = (): Sprite[] => {
    let results = [
        new Sprite(new Texture("Map/Back/back.1.png", {offset: new Point(512, 364), size: new Size(1024, 768)})),
        new Sprite(new Texture("Map/Back/back.13.png", {offset: new Point(285, -83), size: new Size(535, 464)})),
        new Sprite(new Texture("Map/Back/back.14.png", {offset: new Point(500, 250), size: new Size(921, 203)})),
        new Sprite(new Texture("Map/Back/back.15.png", {offset: new Point(288, 595), size: new Size(501, 488)})),
        new Sprite(new Texture("Map/Back/WorldSelect.signboard.1.0.png", {offset: new Point(520, 146), size: new Size(445, 201)})),
        new Sprite(new Texture("UI/CharSelect/CharSelect.signboard.png", {offset: new Point(818, 421), size: new Size(166, 298)})),
    ]
    return results;
};