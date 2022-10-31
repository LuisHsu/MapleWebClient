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

export class UICharCreate extends UIElement implements LoginState {
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
    }

    cancel(){
        // TODO:
        console.log("Cancel");
    }

    create_character(){
        // TODO:
        console.log(`Create character`);
    }

    clean(): void {
        this.menu.clean();
        this.tab_focus.remove();
    }

    return_character_select(){
        this.tab_focus.remove();
        LoginSession.character_list(this.selected_channel);
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
        this.menu.draw();
    }

    draw_foreground(): void {
        canvas.draw_texture(this.step_texture);
        canvas.draw_texture(this.selected_world_texture);
        canvas.draw_text(this.selected_world, 15, new Point(105, 600), new Color(255, 255, 255), TextAlign.Center);
        canvas.draw_text(`Ch. ${this.selected_channel + 1}`, 15, new Point(105, 580), new Color(255, 255, 255), TextAlign.Center);
        this.return_button.draw();
    }

    mouse_move(position: Point): void {
        this.menu.mouse_move(position);
        this.return_button.update_hover(position);
    }

    mouse_down(position: Point): void {
        this.menu.mouse_down(position);
        this.return_button.update_pressed(position);
    }

    mouse_up(position: Point): void {
        this.menu.mouse_up(position);
        this.return_button.update_released(position);
    }

    left_click(position: Point): void {
        this.menu.left_click(position);
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

    private return_button: MapleButton = new MapleButton({
        pressed: new Texture("UI/Common.BtStart.pressed.png", {size: new Size(136, 57)}),
        normal: new Texture("UI/Common.BtStart.normal.png", {size: new Size(136, 57)}),
        hovered: new Texture("UI/Common.BtStart.mouseOver.png", {size: new Size(136, 57)}),
        disabled: new Texture("UI/Common.BtStart.disabled.png", {size: new Size(136, 57)}),
        focused: new Texture("UI/Common.BtStart.mouseOver.png", {size: new Size(136, 57)}),
    }, new Point(73, 125), this.return_world_select.bind(this));

    public parent: UILoginState;
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
            this.check_button,
            this.confirm_button,
            this.cancel_button,
        ]);
    }
    
    check_name(){
        // TODO:
        console.log("Check name") 
    }

    confirm_click(){
        // TODO:
    }

    cancel_click(){
        switch(this.phase){
            case CreateMenu.Phase.Name:
                this.parent.return_character_select();
            case CreateMenu.Phase.Look:
            case CreateMenu.Phase.Ability:
        }
    }

    draw(): void {
        super.draw()  
        this.name_input.set_active(this.phase == CreateMenu.Phase.Name);  
        this.name_input.draw();
        this.check_button.draw();
        this.confirm_button.draw();
        this.cancel_button.draw();
    }

    mouse_move(position: Point): void {
        this.check_button.update_hover(position);
        this.confirm_button.update_hover(position);
        this.cancel_button.update_hover(position);
    }

    mouse_down(position: Point): void {
        this.check_button.update_pressed(position);
        this.confirm_button.update_pressed(position);
        this.cancel_button.update_pressed(position);
    }

    mouse_up(position: Point): void {
        this.check_button.update_released(position);
        this.confirm_button.update_released(position);
        this.cancel_button.update_released(position);
    }

    left_click(position: Point): void {
        this.check_button.handle_click(position, this.check_name.bind(this));
    }


    key_up(key: KeyType): void {
        TabFocus.update(key);
    }

    clean(): void {
        this.name_input.clean();
        this.tab_focus.remove();
    }

    public name_input: TextInput = new TextInput(new Point(771, 466), new Size(170, 25), {color: "white"});
    public parent: UICharCreate;
    public phase: CreateMenu.Phase = CreateMenu.Phase.Name;
    
    private tab_focus: TabFocus;
    private check_button: MapleButton = new MapleButton({
        pressed: new Texture("UI/CharCreate/NewChar.BtCheck.pressed.0.png", {size: new Size(60, 29)}),
        normal: new Texture("UI/CharCreate/NewChar.BtCheck.normal.0.png", {size: new Size(60, 29)}),
        hovered: new Texture("UI/CharCreate/NewChar.BtCheck.mouseOver.0.png", {size: new Size(60, 29)}),
        disabled: new Texture("UI/CharCreate/NewChar.BtCheck.disabled.0.png", {size: new Size(60, 29)}),
        focused: new Texture("UI/CharCreate/NewChar.BtCheck.mouseOver.0.png", {size: new Size(60, 29)}),
    }, new Point(830, 411), this.check_name.bind(this));

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