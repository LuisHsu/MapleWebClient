/**
 * @category UI
 * @module UICharSelect
 */

import { CharEntry } from "../character/CharEntry";
import { CharLook } from "../character/CharLook";
import { Job } from "../character/Job";
import { AreaButton, MapleButton } from "../components/Button";
import Animation, { Frame } from "../graphics/Animation";
import canvas, { Drawable, Transform } from "../graphics/Canvas";
import { Sprite } from "../graphics/Sprite";
import { Texture } from "../graphics/Texture";
import { TabFocus, KeyType } from "../io/Keyboard";
import { Color, Point, Size, TextAlign } from "../Types";
import { UICharCreate } from "./UICharCreate";
import { UIElement } from "./UIElement";
import { LoginState, UILoginState } from "./UILoginState";
import { UIWorldSelect } from "./UIWorldSelect";

export class UICharSelect extends UIElement implements LoginState {

    // TODO: page
    // TODO: cloud

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
                look: new CharLook(entry),
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
        this.clean();
        this.parent.change_state(
            new UICharCreate(this.parent, this.selected_channel),
            UILoginState.Direction.Down,
            125
        );
    }

    select_character(index: number = null){
        if(index !== null){
            this.selected_character = index;
        }
        // TODO:
        if(this.selected_character !== null){
            console.log(`Select character ${this.selected_character}`);
        }
    }

    click_character(index: number){
        this.selected_character = index;
        this.select_char_effect.reset();
        this.select_char_effect.start();
        this.char_stats.set_entry(this.cheracters[index].entry);
    }

    clean(): void {
        this.tab_focus.remove();
    }

    return_world_select(){
        this.clean();
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
        if(this.selected_character !== null){
            canvas.open_scope(() => {
                canvas.apply_transform(new Transform({
                    translate: new Point(150 * (this.selected_character % 3) + 356, 760),
                    scale: new Size(1.2, 1.2)
                }));
                this.select_char_effect.draw();
            });
            canvas.open_scope(() => {
                canvas.apply_transform(new Transform({
                    translate: new Point(150 * (this.selected_character % 3) + 356, 540),
                    scale: new Size(1.2, 1.2),
                }));
                this.char_stats.draw();
            });
        }
        for(let slot_index = 0; slot_index < 3; ++slot_index){
            const index = (this.page * 3 + slot_index);
            const x_offset = 150 * slot_index;
            if(index >= this.cheracters.length){
                // Empty
                canvas.open_scope(() => {
                    canvas.apply_transform(new Transform({
                        translate: new Point(x_offset, 0)
                    }));
                    this.empty_character.draw();
                });
                this.character_buttons[index].active = false;
            }else{
                let body_pos = this.cheracters[index].look.body_pos ? this.cheracters[index].look.body_pos : new Point();
                // CharLook
                canvas.open_scope(() => {
                    canvas.apply_transform(new Transform({
                        translate: new Point(x_offset + 359, 294 - body_pos.y),
                        flip: [true, false],
                    }));
                    this.cheracters[index].look.draw();
                });
                // NameTag
                canvas.open_scope(() => {
                    canvas.apply_transform(new Transform({
                        translate: new Point(x_offset + 355, 280),
                    }));
                    this.cheracters[index].tag.draw();
                });
                this.character_buttons[index].active = true;
            }
        }
    }

    draw_foreground(): void {
        canvas.draw_texture(this.step_texture);
        canvas.draw_texture(this.selected_world_texture);
        canvas.draw_text(this.selected_world, 15, new Point(105, 600), Color.White, TextAlign.Center);
        canvas.draw_text(`Ch. ${this.selected_channel + 1}`, 15, new Point(105, 580), Color.White, TextAlign.Center);
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
        for(let char_index = 0; char_index < 3; ++char_index){
            this.character_buttons[char_index].update_pressed(position);
        }
    }

    mouse_up(position: Point): void {
        this.return_button.update_released(position);
        this.delete_char_button.update_released(position);
        this.new_char_button.update_released(position);
        this.select_char_button.update_released(position);
        for(let char_index = 0; char_index < 3; ++char_index){
            this.character_buttons[char_index].update_pressed(position);
        }
    }

    left_click(position: Point): void {
        this.return_button.handle_click(position, this.return_world_select.bind(this));
        this.delete_char_button.handle_click(position, this.delete_character.bind(this));
        this.new_char_button.handle_click(position, this.new_character.bind(this));
        this.select_char_button.handle_click(position, this.select_character.bind(this));
        for(let char_index = 0; char_index < 3; ++char_index){
            this.character_buttons[char_index].handle_click(position,
                this.click_character.bind(this, 3 * this.page + char_index)
            );
        }
    }

    double_click(position: Point): void {
        for(let char_index = 0; char_index < 3; ++char_index){
            this.character_buttons[char_index].handle_click(position,
                this.select_character.bind(this, 3 * this.page + char_index)
            );
        }
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
    private selected_world: string = "?????????";
    private selected_channel: number;
    private selected_character: number = null;
    private step_texture: Texture = new Texture("UI/CharSelect/Common.step.2.png", {origin: new Point(0, 700), size: new Size(165, 63)});
    private selected_world_texture: Texture = new Texture("UI/Common.selectWorld.png", {origin: new Point(0, 630), size: new Size(165, 63)});

    private return_button: MapleButton = new MapleButton({
        pressed: new Texture("UI/Common.BtStart.pressed.png", {size: new Size(136, 57)}),
        normal: new Texture("UI/Common.BtStart.normal.png", {size: new Size(136, 57)}),
        hovered: new Texture("UI/Common.BtStart.mouseOver.png", {size: new Size(136, 57)}),
        disabled: new Texture("UI/Common.BtStart.disabled.png", {size: new Size(136, 57)}),
        focused: new Texture("UI/Common.BtStart.mouseOver.png", {size: new Size(136, 57)}),
    }, new Point(73, 125), this.return_world_select.bind(this));

    private delete_char_button: MapleButton = new MapleButton({
        pressed: new Texture("UI/CharSelect/CharSelect.BtDelete.pressed.0.png", {size: new Size(126, 53)}),
        normal: new Texture("UI/CharSelect/CharSelect.BtDelete.normal.0.png", {size: new Size(126, 53)}),
        hovered: new Texture("UI/CharSelect/CharSelect.BtDelete.mouseOver.0.png", {size: new Size(126, 53)}),
        disabled: new Texture("UI/CharSelect/CharSelect.BtDelete.disabled.0.png", {size: new Size(126, 53)}),
        focused: new Texture("UI/CharSelect/CharSelect.BtDelete.focused.0.png", {size: new Size(160, 54), origin:new Point(-63, 28)}),
    }, new Point(818, 430), this.delete_character.bind(this));

    private new_char_button: MapleButton = new MapleButton({
        pressed: new Texture("UI/CharSelect/CharSelect.BtNew.pressed.0.png", {size: new Size(126, 44)}),
        normal: new Texture("UI/CharSelect/CharSelect.BtNew.normal.0.png", {size: new Size(126, 44)}),
        hovered: new Texture("UI/CharSelect/CharSelect.BtNew.mouseOver.0.png", {size: new Size(126, 44)}),
        disabled: new Texture("UI/CharSelect/CharSelect.BtNew.disabled.0.png", {size: new Size(126, 44)}),
        focused: new Texture("UI/CharSelect/CharSelect.BtNew.focused.0.png", {size: new Size(183, 43), origin: new Point(-65, 22)}),
    }, new Point(820, 501), this.new_character.bind(this));

    private select_char_button: MapleButton = new MapleButton({
        pressed: new Texture("UI/CharSelect/CharSelect.BtSelect.pressed.0.png", {size: new Size(126, 37)}),
        normal: new Texture("UI/CharSelect/CharSelect.BtSelect.normal.0.png", {size: new Size(126, 37)}),
        hovered: new Texture("UI/CharSelect/CharSelect.BtSelect.mouseOver.0.png", {size: new Size(126, 37)}),
        disabled: new Texture("UI/CharSelect/CharSelect.BtSelect.disabled.0.png", {size: new Size(126, 37)}),
        focused: new Texture("UI/CharSelect/CharSelect.BtSelect.focused.0.png", {size: new Size(166, 44), origin:new Point(-65, 23)}),
    }, new Point(819, 549), this.select_character.bind(this));

    private empty_character: UIElement = new UIElement([
        new Sprite(new Texture("UI/CharSelect/CharSelect.character.0.7.png", {origin: new Point(318, 300), size: new Size(74, 10)})),
        new Sprite(new Texture("UI/CharSelect/CharSelect.character.1.0.png", {origin: new Point(330, 365)}))
    ])

    private select_char_effect: Animation = new Animation([
        new Frame([new Texture("UI/CharSelect/CharSelect.effect.1.0.png", {origin: new Point(0, 0)})], 100),
        new Frame([new Texture("UI/CharSelect/CharSelect.effect.1.1.png", {origin: new Point(-6, 0)})], 100),
        new Frame([new Texture("UI/CharSelect/CharSelect.effect.1.2.png", {origin: new Point(-22, 0)})], 100),
        new Frame([new Texture("UI/CharSelect/CharSelect.effect.1.3.png", {origin: new Point(-28, 0)})], 100),
        new Frame([new Texture("UI/CharSelect/CharSelect.effect.1.4.png", {origin: new Point(-36, 0)})], 0)
    ]);

    private character_buttons: AreaButton[] = [
        new AreaButton(new Point(330, 365), new Size(50, 75)),
        new AreaButton(new Point(480, 365), new Size(50, 75)),
        new AreaButton(new Point(630, 365), new Size(50, 75)),
    ]

    private char_stats = new CharStats();

    parent: UILoginState;
}

const char_select_sprites = (): Sprite[] => {
    let results = [
        new Sprite(new Texture("Map/Back/back.1.png", {origin: new Point(0, 768), size: new Size(1024, 768)})),
        new Sprite(new Animation([
            new Frame([new Texture("Map/Back/back.3.png", {origin: new Point(0, 300), size: new Size(224, 102)})],
                10000, new Transform({translate: new Point(1024, 300)}), new Transform({translate: new Point(0, 300)})
            ),
        ], true, true)),
        new Sprite(new Texture("Map/Back/back.13.png", {origin: new Point(11, 169), size: new Size(535, 464)})),
        new Sprite(new Texture("Map/Back/back.14.png", {origin: new Point(32, 372), size: new Size(921, 203)})),
        new Sprite(new Texture("Map/Back/back.15.png", {origin: new Point(30, 860), size: new Size(501, 488)})),
        new Sprite(new Texture("Map/Back/WorldSelect.signboard.1.0.png", {origin: new Point(310, 266), size: new Size(445, 201)})),
        new Sprite(new Texture("UI/CharSelect/CharSelect.signboard.png", {origin: new Point(735, 590), size: new Size(166, 298)})),
    ]
    return results;
};

export class NameTag implements Drawable{

    active: boolean = false;

    constructor(name: string){
        this.name = name;
        this.name_width = Math.ceil(canvas.measure_text(this.name, 15) / 9) + 1;
    }
    draw(): void {
        const x_offset = -(4 * this.name_width + 3);
        const textures = NameTag.textures[this.active ? 1 : 0];
        canvas.draw_texture(textures[0], new Transform({
            translate: new Point(x_offset, 0)
        }));
        for(let i = 1; i <= this.name_width; ++i){
            canvas.draw_texture(textures[1], new Transform({
                translate: new Point(8 * i + x_offset, 0)
            }));
        }
        canvas.draw_texture(textures[2], new Transform({
            translate: new Point(8 * (this.name_width + 1) - 1 + x_offset, 0)
        }));
        canvas.draw_text(this.name, 15,
            new Point(0, -9),
            Color.White,
            TextAlign.Center
        );
    }
    private name: string;
    private name_width: number;
    private static textures: Texture[][] = [
        [
            new Texture("UI/CharSelect/CharSelect.nameTag.0.0.png"),
            new Texture("UI/CharSelect/CharSelect.nameTag.0.1.png"),
            new Texture("UI/CharSelect/CharSelect.nameTag.0.2.png"),
        ],
        [
            new Texture("UI/CharSelect/CharSelect.nameTag.1.0.png"),
            new Texture("UI/CharSelect/CharSelect.nameTag.1.1.png"),
            new Texture("UI/CharSelect/CharSelect.nameTag.1.2.png"),
        ],
    ]
}

class CharStats extends UIElement{

    constructor(){
        super([
            new Sprite(new Texture("UI/CharSelect/CharSelect.scroll.1.0.png",
                {size: new Size(220, 200), origin: new Point(-114, 104)}
            )),
            new Sprite(new Texture("UI/CharSelect/CharSelect.charInfo1.png")),
        ])
    }

    draw(): void {
        super.draw();
        if(this.character){
            canvas.draw_text(`${Job.Name[this.character.job.id]}`, 12, new Point(17, 60), CharStats.color, TextAlign.Center);
            canvas.draw_text(`${this.character.level}`, 12, new Point(-27, 42), CharStats.color, TextAlign.Center);
            canvas.draw_text(`${this.character.str}`, 12, new Point(-27, 24), CharStats.color, TextAlign.Center);
            canvas.draw_text(`${this.character.dex}`, 12, new Point(-27, 6), CharStats.color, TextAlign.Center);
            canvas.draw_text(`${this.character.fame}`, 12, new Point(63, 42), CharStats.color, TextAlign.Center);
            canvas.draw_text(`${this.character.int}`, 12, new Point(63, 24), CharStats.color, TextAlign.Center);
            canvas.draw_text(`${this.character.luk}`, 12, new Point(63, 6), CharStats.color, TextAlign.Center);
            canvas.draw_text(`${this.character.job_rank.value}`, 12, new Point(0, -37), CharStats.color, TextAlign.Center);
            canvas.draw_texture(this.trand_textures[this.character.job_rank.trend], new Transform({translate: new Point(75, -30)}));
            canvas.draw_text(`${this.character.rank.value}`, 12, new Point(0, -75), CharStats.color, TextAlign.Center);
            canvas.draw_texture(this.trand_textures[this.character.rank.trend], new Transform({translate: new Point(75, -68)}));
        }
    }

    set_entry(char: CharEntry){
        this.character = char;
    }
    private static color: Color = new Color(0, 0, 0);
    private character: CharEntry;
    private trand_textures: {[trand in CharEntry.Trend]: Texture} = {
        [CharEntry.Trend.increase]: new Texture("UI/CharSelect/CharSelect.icon.up.png"),
        [CharEntry.Trend.even]: new Texture("UI/CharSelect/CharSelect.icon.same.png"),
        [CharEntry.Trend.decrease]: new Texture("UI/CharSelect/CharSelect.icon.down.png"),
    };
}