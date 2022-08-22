/**
 * @category UI
 * @module UICharSelect
 */

import { MapleButton } from "../components/Button";
import Canvas, { Transform } from "../graphics/Canvas";
import { Sprite } from "../graphics/Sprite";
import { Texture } from "../graphics/Texture";
import { Point, Size } from "../Types";
import { UIElement } from "./UIElement";
import { LoginState, UILoginState } from "./UILoginState";
import { UIWorldSelect } from "./UIWorldSelect";

export class UICharSelect extends UIElement implements LoginState {
    constructor(parent: UILoginState){
        super(char_select_sprites());
        this.parent = parent;
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
        new Sprite(new Texture("Map/Back/back.13.png", {offset: new Point(250, -70), size: new Size(500, 448)})),
        new Sprite(new Texture("Map/Back/back.14.png", {offset: new Point(450, 250), size: new Size(860, 196)})),
        new Sprite(new Texture("Map/Back/back.15.png", {offset: new Point(252, 579), size: new Size(468, 462)})),
        new Sprite(new Texture("Map/Back/WorldSelect.signboard.1.0.png", {offset: new Point(520, 146), size: new Size(470, 201)})),
    ]
    return results;
};