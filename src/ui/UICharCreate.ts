/**
 * @category UI
 * @module UICharCreate
 */

import { TabFocus, KeyType } from "../io/Keyboard";
import { Color, Point, Size, TextAlign } from "../Types";
import { UIElement } from "./UIElement";
import { LoginState, UILoginState } from "./UILoginState";
import { UIWorldSelect } from "./UIWorldSelect";
import canvas, { Transform } from "../graphics/Canvas";
import { Texture } from "../graphics/Texture";
import { MapleButton } from "../components/Button";
import { Sprite } from "../graphics/Sprite";
import { TextInput } from "../components/TextInput";
import LoginSession from "../net/LoginSession";
import { CharEntry } from "../character/CharEntry";
import { CharLook } from "../character/CharLook";
import { NameTag } from "./UICharSelect";

export class UICharCreate extends UIElement implements LoginState {
    
    public parent: UILoginState;
    public cheracter: {
        entry: CharEntry,
        look?: CharLook,
        tag?: NameTag,
    } = {entry: new CharEntry};

    constructor(
        parent: UILoginState,
        selected_channel: number
    ){
        super(char_create_sprites());
        this.parent = parent;
        this.selected_channel = selected_channel;
        this.menu = new CreateMenu(this);
        this.tab_focus = new TabFocus([ 
            this.return_button,
        ]);
        this.cheracter.look = new CharLook(this.cheracter.entry);
    }

    create_character(){
        // TODO:
        console.log(`Create character`);
    }

    clean(): void {
        this.tab_focus.remove();
        this.menu.clean();
    }

    return_character_select(){
        this.clean();
        LoginSession.character_list(this.selected_channel);
    }

    return_world_select(){
        this.clean();
        this.parent.change_state(
            new UIWorldSelect(this.parent),
            UILoginState.Direction.Up
        );
    }

    draw_state(translate?: Point): void {
        this.offset = translate;
        canvas.open_scope(() => {
            if(translate){
                canvas.apply_transform(new Transform({translate}))
            }
            this.draw();
        })
    }

    draw(): void {
        super.draw();
        this.menu.draw();
        // CharLook
        canvas.open_scope(() => {
            canvas.apply_transform(new Transform({
                translate: new Point(520, 242),
            }));
            this.cheracter.look.draw();
        });
        // NameTag
        if(this.cheracter.tag){
            canvas.open_scope(() => {
                canvas.apply_transform(new Transform({
                    translate: new Point(525, 208),
                }));
                this.cheracter.tag.draw();
            });
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
        this.menu.mouse_move(position.concat(this.offset.neg()));
        this.return_button.update_hover(position);
    }

    mouse_down(position: Point): void {
        this.menu.mouse_down(position.concat(this.offset.neg()));
        this.return_button.update_pressed(position);
    }

    mouse_up(position: Point): void {
        this.menu.mouse_up(position.concat(this.offset.neg()));
        this.return_button.update_released(position);
    }

    left_click(position: Point): void {
        this.menu.left_click(position.concat(this.offset.neg()));
        this.return_button.handle_click(position, this.return_world_select.bind(this));
    }

    key_up(key: KeyType): void {
        TabFocus.update(key);
    }

    private tab_focus: TabFocus;
    private selected_world: string = "測試機";
    private selected_channel: number;
    private step_texture: Texture = new Texture("UI/CharCreate/Common.step.3.png", {origin: new Point(0, 700), size: new Size(165, 63)});
    private selected_world_texture: Texture = new Texture("UI/Common.selectWorld.png", {origin: new Point(0, 630), size: new Size(165, 63)});
    private menu: CreateMenu;
    private offset: Point = new Point;

    private return_button: MapleButton = new MapleButton({
        pressed: new Texture("UI/Common.BtStart.pressed.png", {size: new Size(136, 57)}),
        normal: new Texture("UI/Common.BtStart.normal.png", {size: new Size(136, 57)}),
        hovered: new Texture("UI/Common.BtStart.mouseOver.png", {size: new Size(136, 57)}),
        disabled: new Texture("UI/Common.BtStart.disabled.png", {size: new Size(136, 57)}),
        focused: new Texture("UI/Common.BtStart.mouseOver.png", {size: new Size(136, 57)}),
    }, new Point(73, 125), this.return_world_select.bind(this));
}

const char_create_sprites = (): Sprite[] => {
    return [
        new Sprite(new Texture("Map/Back/back.2.png", {origin: new Point(0, 740), size: new Size(1024, 768)})),
        new Sprite(new Texture("Map/Back/back.15.png", {origin: new Point(30, 92), size: new Size(501, 488)})),
        new Sprite(new Texture("Map/Back/back.16.png", {origin: new Point(32, 223), size: new Size(613, 131)})),
        new Sprite(new Texture("Map/Back/back.17.png", {origin: new Point(26, 426), size: new Size(528, 203)})),
        new Sprite(new Texture("Map/Back/back.18.png", {origin: new Point(34, 618), size: new Size(625, 192)})),
    ]
};

class CreateMenu extends UIElement{

    constructor(parent: UICharCreate){
        super(name_phase_sprites(CreateMenu.Phase.Name));
        this.parent = parent;
        this.tab_focus = new TabFocus([
            this.confirm_button,
            this.cancel_button,
        ]);
    }

    confirm_click(){
        switch(this.phase){
            case CreateMenu.Phase.Name:
                LoginSession.character_name(this.name_input.value());
                break;
            case CreateMenu.Phase.Look:
            case CreateMenu.Phase.Ability:
        }
    }

    cancel_click(){
        switch(this.phase){
            case CreateMenu.Phase.Name:
                this.parent.return_character_select();
                break;
            case CreateMenu.Phase.Look:
            case CreateMenu.Phase.Ability:
        }
    }

    draw(): void {
        super.draw()  
        this.name_input.set_active(this.phase == CreateMenu.Phase.Name);  
        this.name_input.draw();
        this.confirm_button.draw();
        this.cancel_button.draw();
    }

    mouse_move(position: Point): void {
        this.confirm_button.update_hover(position);
        this.cancel_button.update_hover(position);
    }

    mouse_down(position: Point): void {
        this.confirm_button.update_pressed(position);
        this.cancel_button.update_pressed(position);
    }

    mouse_up(position: Point): void {
        this.confirm_button.update_released(position);
        this.cancel_button.update_released(position);
    }

    left_click(position: Point): void {
        this.confirm_button.handle_click(position, this.confirm_click.bind(this));
        this.cancel_button.handle_click(position, this.cancel_click.bind(this));
    }


    key_up(key: KeyType): void {
        TabFocus.update(key);
    }

    clean(): void {
        this.tab_focus.remove();
        this.name_input.clean();
    }

    public name_input: TextInput = new TextInput(new Point(771, 466), new Size(170, 25), {color: "white"});
    public parent: UICharCreate;
    public phase: CreateMenu.Phase = CreateMenu.Phase.Name;
    
    private tab_focus: TabFocus;

    private confirm_button: MapleButton = new MapleButton({
        pressed: new Texture("UI/CharCreate/NewChar.BtYes.pressed.0.png", {size: new Size(97, 49)}),
        normal: new Texture("UI/CharCreate/NewChar.BtYes.normal.0.png", {size: new Size(97, 49)}),
        hovered: new Texture("UI/CharCreate/NewChar.BtYes.mouseOver.0.png", {size: new Size(97, 49)}),
        disabled: new Texture("UI/CharCreate/NewChar.BtYes.disabled.0.png", {size: new Size(97, 49)}),
        focused: new Texture("UI/CharCreate/NewChar.BtYes.mouseOver.0.png", {size: new Size(97, 49)}),
    }, new Point(732, 267), this.confirm_click.bind(this));

    private cancel_button: MapleButton = new MapleButton({
        pressed: new Texture("UI/CharCreate/NewChar.BtNo.pressed.0.png", {size: new Size(97, 49)}),
        normal: new Texture("UI/CharCreate/NewChar.BtNo.normal.0.png", {size: new Size(97, 49)}),
        hovered: new Texture("UI/CharCreate/NewChar.BtNo.mouseOver.0.png", {size: new Size(97, 49)}),
        disabled: new Texture("UI/CharCreate/NewChar.BtNo.disabled.0.png", {size: new Size(97, 49)}),
        focused: new Texture("UI/CharCreate/NewChar.BtNo.mouseOver.0.png", {size: new Size(97, 49)}),
    }, new Point(820, 268), this.cancel_click.bind(this));
}

const name_phase_sprites = (phase: CreateMenu.Phase): Sprite[] => {
    switch(phase){
        case CreateMenu.Phase.Name:
            return [
                new Sprite(new Texture("UI/CharCreate/NewChar.charName.png", {origin: new Point(650, 505), size: new Size(241, 269)})),
            ]
        case CreateMenu.Phase.Look:
            return [
                new Sprite(new Texture("UI/CharCreate/NewChar.charName.png", {origin: new Point(650, 505), size: new Size(241, 269)})),
            ]
        case CreateMenu.Phase.Ability:
            return [
                new Sprite(new Texture("UI/CharCreate/NewChar.charName.png", {origin: new Point(650, 505), size: new Size(241, 269)})),
            ]
    }
};

namespace CreateMenu{
    export enum Phase{
        Name, Look, Ability
    }
}