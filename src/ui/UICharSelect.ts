/**
 * @category UI
 * @module UICharSelect
 */

import { MapleButton } from "../components/Button";
import Animation, { Frame } from "../graphics/Animation";
import Canvas, { Transform } from "../graphics/Canvas";
import { Sprite } from "../graphics/Sprite";
import { Texture } from "../graphics/Texture";
import { TabFocus, KeyType } from "../io/Keyboard";
import { Color, Point, Size, TextAlign } from "../Types";
import { UIElement } from "./UIElement";
import { LoginState, UILoginState } from "./UILoginState";
import { UIWorldSelect } from "./UIWorldSelect";

export class UICharSelect extends UIElement implements LoginState {
    constructor(parent: UILoginState, selected_channel: number){
        super(char_select_sprites());
        this.parent = parent;
        this.selected_channel = selected_channel;
        this.tab_focus = new TabFocus([
            this.select_char_button,
            this.new_char_button,
            this.delete_char_button,
            this.return_button,
        ]);
    }

    delete_character(){
        // TODO:
        console.log("Delete character");
    }

    new_character(){
        // TODO:
        console.log("New character");
    }

    select_character(){
        // TODO:
        console.log("Select character");
    }

    return_world_select(){
        this.tab_focus.remove();
        this.parent.change_state(
            new UIWorldSelect(this.parent),
            UILoginState.Direction.Up
        );
    }

    draw(transform?: Transform): void {
        super.draw(transform);
        this.delete_char_button.draw(transform);
        this.new_char_button.draw(transform);
        this.select_char_button.draw(transform);
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
        this.delete_char_button.update_hover(position);
        this.new_char_button.update_hover(position);
        this.select_char_button.update_hover(position);
    }

    mouse_down(position: Point): void {
        this.return_button.update_pressed(position);
        this.delete_char_button.update_pressed(position);
        this.new_char_button.update_pressed(position);
        this.select_char_button.update_pressed(position);
    }

    mouse_up(position: Point): void {
        this.return_button.update_released(position);
        this.delete_char_button.update_released(position);
        this.new_char_button.update_released(position);
        this.select_char_button.update_released(position);
    }

    left_click(position: Point): void {
        this.return_button.handle_click(position, this.return_world_select.bind(this));
        this.delete_char_button.handle_click(position, this.delete_character.bind(this));
        this.new_char_button.handle_click(position, this.new_character.bind(this));
        this.select_char_button.handle_click(position, this.select_character.bind(this));
    }

    key_up(key: KeyType): void {
        TabFocus.update(key);
    }

    private tab_focus: TabFocus;
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

    private delete_char_button: MapleButton = new MapleButton({
        pressed: new Texture("UI/CharSelect/CharSelect.BtDelete.pressed.0.png", {size: new Size(126, 53)}),
        normal: new Texture("UI/CharSelect/CharSelect.BtDelete.normal.0.png", {size: new Size(126, 53)}),
        hovered: new Texture("UI/CharSelect/CharSelect.BtDelete.mouseOver.0.png", {size: new Size(126, 53)}),
        disabled: new Texture("UI/CharSelect/CharSelect.BtDelete.disabled.0.png", {size: new Size(126, 53)}),
        focused: new Texture("UI/CharSelect/CharSelect.BtDelete.focused.0.png", {size: new Size(160, 54), offset:new Point(17, 1)}),
    }, new Point(818, 410), this.delete_character.bind(this));

    private new_char_button: MapleButton = new MapleButton({
        pressed: new Texture("UI/CharSelect/CharSelect.BtNew.pressed.0.png", {size: new Size(126, 44)}),
        normal: new Texture("UI/CharSelect/CharSelect.BtNew.normal.0.png", {size: new Size(126, 44)}),
        hovered: new Texture("UI/CharSelect/CharSelect.BtNew.mouseOver.0.png", {size: new Size(126, 44)}),
        disabled: new Texture("UI/CharSelect/CharSelect.BtNew.disabled.0.png", {size: new Size(126, 44)}),
        focused: new Texture("UI/CharSelect/CharSelect.BtNew.focused.0.png", {size: new Size(183, 43), offset:new Point(27, 1)}),
    }, new Point(820, 481), this.new_character.bind(this));

    private select_char_button: MapleButton = new MapleButton({
        pressed: new Texture("UI/CharSelect/CharSelect.BtSelect.pressed.0.png", {size: new Size(126, 37)}),
        normal: new Texture("UI/CharSelect/CharSelect.BtSelect.normal.0.png", {size: new Size(126, 37)}),
        hovered: new Texture("UI/CharSelect/CharSelect.BtSelect.mouseOver.0.png", {size: new Size(126, 37)}),
        disabled: new Texture("UI/CharSelect/CharSelect.BtSelect.disabled.0.png", {size: new Size(126, 37)}),
        focused: new Texture("UI/CharSelect/CharSelect.BtSelect.focused.0.png", {size: new Size(166, 44), offset:new Point(18, 2)}),
    }, new Point(819, 529), this.select_character.bind(this));

    parent: UILoginState;
}

const char_select_sprites = (): Sprite[] => {
    let results = [
        new Sprite(new Texture("Map/Back/back.1.png", {offset: new Point(512, 364), size: new Size(1024, 768)})),
        new Sprite(new Animation([
            new Frame(new Texture("Map/Back/back.3.png", {offset: new Point(-112, 51), size: new Size(224, 102)}),
                10, new Transform({offset: new Point(1136, 0)}), new Transform({offset: new Point(0, 0)})
            ),
        ], true, true)),
        new Sprite(new Texture("Map/Back/back.13.png", {offset: new Point(285, -83), size: new Size(535, 464)})),
        new Sprite(new Texture("Map/Back/back.14.png", {offset: new Point(500, 250), size: new Size(921, 203)})),
        new Sprite(new Texture("Map/Back/back.15.png", {offset: new Point(288, 595), size: new Size(501, 488)})),
        new Sprite(new Texture("Map/Back/WorldSelect.signboard.1.0.png", {offset: new Point(520, 146), size: new Size(445, 201)})),
        new Sprite(new Texture("UI/CharSelect/CharSelect.signboard.png", {offset: new Point(818, 421), size: new Size(166, 298)})),
    ]
    return results;
};