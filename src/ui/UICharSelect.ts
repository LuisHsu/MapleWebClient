/**
 * @category UI
 * @module UICharSelect
 */

import { CharEntry } from "../character/CharEntry";
import { CharLook } from "../character/CharLook";
import { MapleButton } from "../components/Button";
import Animation, { Frame } from "../graphics/Animation";
import canvas, { Drawable, Transform } from "../graphics/Canvas";
import { Sprite } from "../graphics/Sprite";
import { Texture } from "../graphics/Texture";
import { TabFocus, KeyType } from "../io/Keyboard";
import { Color, Point, Size, TextAlign } from "../Types";
import { UIElement } from "./UIElement";
import { LoginState, UILoginState } from "./UILoginState";
import { UIWorldSelect } from "./UIWorldSelect";

export class UICharSelect extends UIElement implements LoginState {
    constructor(
        parent: UILoginState,
        selected_channel: number,
        characters: CharEntry[]
    ){
        super(char_select_sprites());
        this.parent = parent;
        this.cheracters = characters.map(((entry: CharEntry) => (
            {
                entry,
                look: new CharLook(entry, (() => {
                    this.cheracters.forEach(character => {
                        character.look.set_repeat(true);
                        character.look.start();
                    })
                }).bind(this)),
                tag: new NameTag(entry.name),
            }
        )).bind(this));
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

    clean(): void {
        // TODO:
    }

    return_world_select(){
        this.tab_focus.remove();
        this.parent.change_state(
            new UIWorldSelect(this.parent),
            UILoginState.Direction.Up
        );
    }

    draw_state(translate?: Point): void {
        canvas.open_scope(() => {
            if(translate){
                canvas.apply_transform(new Transform({translate}))
            }
            this.draw();
        })
    }

    draw(): void {
        super.draw();
        this.delete_char_button.draw();
        this.new_char_button.draw();
        this.select_char_button.draw();
        for(let slot_index = 0; slot_index < 3; ++slot_index){
            let index = (this.page * 3 + slot_index);
            // CharLook
            canvas.open_scope(() => {
                if(index >= this.cheracters.length){
                    canvas.apply_transform(new Transform({
                        translate: new Point(150 * slot_index, 0)
                    }));
                    this.empty_character.draw();
                }else{
                    let body_pos = this.cheracters[index].look.body_pos ? this.cheracters[index].look.body_pos : new Point();
                    canvas.apply_transform(new Transform({
                        translate: new Point(150 * slot_index + 389, 274 - body_pos.y),
                        flip: [true, false],
                    }));
                    this.cheracters[index].look.draw();
                }
            });
            // NameTag
        }
    }

    draw_foreground(): void {
        canvas.draw_texture(this.step_texture);
        canvas.draw_texture(this.selected_world_texture);
        canvas.draw_text(this.selected_world, 15, new Point(105, 600), new Color(255, 255, 255), TextAlign.Center);
        canvas.draw_text(`Ch. ${this.selected_channel + 1}`, 15, new Point(105, 580), new Color(255, 255, 255), TextAlign.Center);
        this.return_button.draw();
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

    private page: number = 0;
    private cheracters: {
        entry: CharEntry,
        look: CharLook,
        tag: NameTag,
    }[] = [];
    private tab_focus: TabFocus;
    private selected_world: string = "測試機";
    private selected_channel: number;
    private step_texture: Texture = new Texture("UI/CharSelect/Common.step.2.png", {origin: new Point(0, 700), size: new Size(165, 63)});
    private selected_world_texture: Texture = new Texture("UI/CharSelect/Common.selectWorld.png", {origin: new Point(0, 630), size: new Size(165, 63)});

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
        focused: new Texture("UI/CharSelect/CharSelect.BtDelete.focused.0.png", {size: new Size(160, 54), origin:new Point(-63, 28)}),
    }, new Point(818, 410), this.delete_character.bind(this));

    private new_char_button: MapleButton = new MapleButton({
        pressed: new Texture("UI/CharSelect/CharSelect.BtNew.pressed.0.png", {size: new Size(126, 44)}),
        normal: new Texture("UI/CharSelect/CharSelect.BtNew.normal.0.png", {size: new Size(126, 44)}),
        hovered: new Texture("UI/CharSelect/CharSelect.BtNew.mouseOver.0.png", {size: new Size(126, 44)}),
        disabled: new Texture("UI/CharSelect/CharSelect.BtNew.disabled.0.png", {size: new Size(126, 44)}),
        focused: new Texture("UI/CharSelect/CharSelect.BtNew.focused.0.png", {size: new Size(183, 43), origin: new Point(-65, 22)}),
    }, new Point(820, 481), this.new_character.bind(this));

    private select_char_button: MapleButton = new MapleButton({
        pressed: new Texture("UI/CharSelect/CharSelect.BtSelect.pressed.0.png", {size: new Size(126, 37)}),
        normal: new Texture("UI/CharSelect/CharSelect.BtSelect.normal.0.png", {size: new Size(126, 37)}),
        hovered: new Texture("UI/CharSelect/CharSelect.BtSelect.mouseOver.0.png", {size: new Size(126, 37)}),
        disabled: new Texture("UI/CharSelect/CharSelect.BtSelect.disabled.0.png", {size: new Size(126, 37)}),
        focused: new Texture("UI/CharSelect/CharSelect.BtSelect.focused.0.png", {size: new Size(166, 44), origin:new Point(-65, 23)}),
    }, new Point(819, 529), this.select_character.bind(this));

    private empty_character: UIElement = new UIElement([
        new Sprite(new Texture("UI/CharSelect/CharSelect.character.0.7.png", {origin: new Point(348, 280), size: new Size(74, 10)})),
        new Sprite(new Texture("UI/CharSelect/CharSelect.character.1.0.png", {origin: new Point(360, 345)}))
    ])

    parent: UILoginState;
}

const char_select_sprites = (): Sprite[] => {
    let results = [
        new Sprite(new Texture("Map/Back/back.1.png", {origin: new Point(0, 768), size: new Size(1024, 768)})),
        new Sprite(new Animation([
            new Frame([new Texture("Map/Back/back.3.png", {origin: new Point(0, 300), size: new Size(224, 102)})],
                10, new Transform({translate: new Point(1136, 300)}), new Transform({translate: new Point(0, 300)})
            ),
        ], true, true)),
        new Sprite(new Texture("Map/Back/back.13.png", {origin: new Point(11, 149), size: new Size(535, 464)})),
        new Sprite(new Texture("Map/Back/back.14.png", {origin: new Point(32, 352), size: new Size(921, 203)})),
        new Sprite(new Texture("Map/Back/back.15.png", {origin: new Point(30, 840), size: new Size(501, 488)})),
        new Sprite(new Texture("Map/Back/WorldSelect.signboard.1.0.png", {origin: new Point(310, 246), size: new Size(445, 201)})),
        new Sprite(new Texture("UI/CharSelect/CharSelect.signboard.png", {origin: new Point(735, 570), size: new Size(166, 298)})),
    ]
    return results;
};

class NameTag implements Drawable{
    constructor(name: string){
        this.name = name;
        console.log(Math.ceil(canvas.measure_text(name, 15) / 9))// FIXME:
    }
    draw(): void {
        
    }
    private name: string;
    static textures: Texture[][] = [
        [
            new Texture("UI/CharSelect/CharSelect.nameTag.0.0.png")
        ],
    ]
}