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
import { CharEntry, Gender } from "../character/CharEntry";
import { CharLook } from "../character/CharLook";
import { NameTag } from "./UICharSelect";
import { ComboBox } from "../components/ComboBox";
import { LocaleString } from "../Util";

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
        this.tab_focus = new TabFocus([ 
            this.return_button,
        ]);
    }

    create_character(){
        // TODO:
        console.log(`Create character`);
    }

    change_phase = (phase: UICharCreate.Phase) => this.menu.change_phase(phase);

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
        if(this.cheracter.look){
            canvas.open_scope(() => {
                canvas.apply_transform(new Transform({
                    translate: new Point(520, 242),
                }));
                this.cheracter.look.draw();
            });
        }
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
        canvas.draw_text(this.selected_world, 15, new Point(105, 600), Color.White, TextAlign.Center);
        canvas.draw_text(`Ch. ${this.selected_channel + 1}`, 15, new Point(105, 580), Color.White, TextAlign.Center);
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
    private menu: CreateMenu = new CreateMenu(this);
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

export namespace UICharCreate{
    export enum Phase{
        Name, Look, Ability
    }
}

class CreateMenu extends UIElement{

    constructor(parent: UICharCreate){
        super(menu_sprites(UICharCreate.Phase.Name));
        this.parent = parent;
        this.tab_focus = new TabFocus([
            this.confirm_button,
            this.cancel_button,
        ]);
        this.confirm_button.validate = this.validate.bind(this);
        LocaleString.Eqp("Face").then(face_list => {
            this.face_list = [
                [100, 401, 402].map(id => ({id, name: face_list[id].name})),
                [1700, 1201, 1002].map(id => ({id, name: face_list[id].name})),
            ]
        })
    }

    change_phase(phase: UICharCreate.Phase): void{
        switch(phase){
            case UICharCreate.Phase.Name:
                this.confirm_button.validate = this.validate.bind(this);
                this.confirm_button.position = new Point(732, 268);
                this.cancel_button.position = new Point(820, 268);
                break;
            case UICharCreate.Phase.Look:
                this.confirm_button.validate = undefined;
                this.confirm_button.position = new Point(732, 152);
                this.cancel_button.position = new Point(820, 152);
                break;
            case UICharCreate.Phase.Ability:
        }
        this.sprites = menu_sprites(phase);
        this.phase = phase;
    }

    private validate(): boolean{
        return this.name_input.value() != "";
    }

    private change_face(step: number){
        if(step > 0){
            this.face_list[this.parent.cheracter.entry.gender].unshift(this.face_list[this.parent.cheracter.entry.gender][this.face_list[this.parent.cheracter.entry.gender].length - 1]);
            this.face_list[this.parent.cheracter.entry.gender].pop();
        }else{
            this.face_list[this.parent.cheracter.entry.gender].push(this.face_list[this.parent.cheracter.entry.gender].shift());
        }
        this.refresh_look();
    }
    private change_hair(step: number){
        // TODO:
        console.log(step);
    }
    private change_upper(step: number){
        // TODO:
        console.log(step);
    }
    private change_lower(step: number){
        // TODO:
        console.log(step);
    }
    private change_shoe(step: number){
        // TODO:
        console.log(step);
    }
    private change_weapon(step: number){
        // TODO:
        console.log(step);
    }

    private refresh_look(): void{
        this.parent.cheracter.entry.face_id = this.face_list[this.parent.cheracter.entry.gender][0].id;
        this.parent.cheracter.look = new CharLook(this.parent.cheracter.entry);
    }

    private confirm_click(): void{
        switch(this.phase){
            case UICharCreate.Phase.Name:
                LoginSession.character_name(this.name_input.value());
                break;
            case UICharCreate.Phase.Look:
            case UICharCreate.Phase.Ability:
        }
    }

    private cancel_click(): void{
        switch(this.phase){
            case UICharCreate.Phase.Name:
                this.parent.return_character_select();
                break;
            case UICharCreate.Phase.Look:
                this.change_phase(UICharCreate.Phase.Name);
                break;
            case UICharCreate.Phase.Ability:
        }
    }

    draw(): void {
        super.draw()  
        this.name_input.set_active(this.phase == UICharCreate.Phase.Name);
        this.name_input.draw();
        this.gender_combobox.set_active(this.phase == UICharCreate.Phase.Look);
        this.confirm_button.draw();
        this.cancel_button.draw();
        if(this.phase == UICharCreate.Phase.Look){
            this.face_buttons.forEach(button => button.draw());
            this.hair_buttons.forEach(button => button.draw());
            this.upper_buttons.forEach(button => button.draw());
            this.lower_buttons.forEach(button => button.draw());
            this.shoe_buttons.forEach(button => button.draw());
            this.weapon_buttons.forEach(button => button.draw());
            if(this.face_list && this.parent.cheracter.entry.gender !== undefined){
                canvas.draw_text(this.face_list[this.parent.cheracter.entry.gender][0].name, 14, new Point(790, 363), Color.Black, TextAlign.Center);
            }
        }
        this.gender_combobox.draw();
    }

    mouse_move(position: Point): void {
        this.confirm_button.update_hover(position);
        this.cancel_button.update_hover(position);
        this.gender_combobox.update_hover(position);
        if(this.phase == UICharCreate.Phase.Look){
            this.face_buttons.forEach(button => button.update_hover(position));
            this.hair_buttons.forEach(button => button.update_hover(position));
            this.upper_buttons.forEach(button => button.update_hover(position));
            this.lower_buttons.forEach(button => button.update_hover(position));
            this.shoe_buttons.forEach(button => button.update_hover(position));
            this.weapon_buttons.forEach(button => button.update_hover(position));
        }
    }

    mouse_down(position: Point): void {
        this.confirm_button.update_pressed(position);
        this.cancel_button.update_pressed(position);
        if(this.phase == UICharCreate.Phase.Look){
            this.face_buttons.forEach(button => button.update_pressed(position));
            this.hair_buttons.forEach(button => button.update_pressed(position));
            this.upper_buttons.forEach(button => button.update_pressed(position));
            this.lower_buttons.forEach(button => button.update_pressed(position));
            this.shoe_buttons.forEach(button => button.update_pressed(position));
            this.weapon_buttons.forEach(button => button.update_pressed(position));
        }
    }

    mouse_up(position: Point): void {
        this.confirm_button.update_released(position);
        this.cancel_button.update_released(position);
        if(this.phase == UICharCreate.Phase.Look){
            this.face_buttons.forEach(button => button.update_released(position));
            this.hair_buttons.forEach(button => button.update_released(position));
            this.upper_buttons.forEach(button => button.update_released(position));
            this.lower_buttons.forEach(button => button.update_released(position));
            this.shoe_buttons.forEach(button => button.update_released(position));
            this.weapon_buttons.forEach(button => button.update_released(position));
        }
    }

    left_click(position: Point): void {
        this.confirm_button.handle_click(position, this.confirm_click.bind(this));
        this.cancel_button.handle_click(position, this.cancel_click.bind(this));
        if(this.phase == UICharCreate.Phase.Look){
            this.gender_combobox.handle_click(position, value => {
                this.parent.cheracter.entry.gender = value;
                this.refresh_look();
            });
            this.face_buttons.forEach((button, index) => button.handle_click(position, this.change_face.bind(this, index * 2 - 1)));
            this.hair_buttons.forEach((button, index) => button.handle_click(position, this.change_hair.bind(this, index * 2 - 1)));
            this.upper_buttons.forEach((button, index) => button.handle_click(position, this.change_upper.bind(this, index * 2 - 1)));
            this.lower_buttons.forEach((button, index) => button.handle_click(position, this.change_lower.bind(this, index * 2 - 1)));
            this.shoe_buttons.forEach((button, index) => button.handle_click(position, this.change_shoe.bind(this, index * 2 - 1)));
            this.weapon_buttons.forEach((button, index) => button.handle_click(position, this.change_weapon.bind(this, index * 2 - 1)));
        }
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
    public phase: UICharCreate.Phase = UICharCreate.Phase.Name;
    
    private tab_focus: TabFocus;

    private face_list: {id: number, name:string}[][];

    private gender_combobox: ComboBox = new ComboBox([["女", Gender.female], ["男", Gender.male],],
        ComboBox.Type.Default, new Point(812, 415), new Size(60, 20), 14, "角色性別"
    );

    private confirm_button: MapleButton = new MapleButton({
        pressed: new Texture("UI/CharCreate/NewChar.BtYes.pressed.0.png", {size: new Size(97, 49)}),
        normal: new Texture("UI/CharCreate/NewChar.BtYes.normal.0.png", {size: new Size(97, 49)}),
        hovered: new Texture("UI/CharCreate/NewChar.BtYes.mouseOver.0.png", {size: new Size(97, 49)}),
        disabled: new Texture("UI/CharCreate/NewChar.BtYes.disabled.0.png", {size: new Size(97, 49)}),
        focused: new Texture("UI/CharCreate/NewChar.BtYes.mouseOver.0.png", {size: new Size(97, 49)}),
    }, new Point(732, 268), this.confirm_click.bind(this));

    private cancel_button: MapleButton = new MapleButton({
        pressed: new Texture("UI/CharCreate/NewChar.BtNo.pressed.0.png", {size: new Size(97, 49)}),
        normal: new Texture("UI/CharCreate/NewChar.BtNo.normal.0.png", {size: new Size(97, 49)}),
        hovered: new Texture("UI/CharCreate/NewChar.BtNo.mouseOver.0.png", {size: new Size(97, 49)}),
        disabled: new Texture("UI/CharCreate/NewChar.BtNo.disabled.0.png", {size: new Size(97, 49)}),
        focused: new Texture("UI/CharCreate/NewChar.BtNo.mouseOver.0.png", {size: new Size(97, 49)}),
    }, new Point(820, 268), this.cancel_click.bind(this));

    private static left_button_textures = {
        pressed: new Texture("UI/CharCreate/NewChar.BtLeft.pressed.0.png", {size: new Size(17, 18)}),
        normal: new Texture("UI/CharCreate/NewChar.BtLeft.normal.0.png", {size: new Size(17, 18)}),
        hovered: new Texture("UI/CharCreate/NewChar.BtLeft.mouseOver.0.png", {size: new Size(17, 18)}),
        disabled: new Texture("UI/CharCreate/NewChar.BtLeft.disabled.0.png", {size: new Size(17, 18)}),
        focused: new Texture("UI/CharCreate/NewChar.BtLeft.mouseOver.0.png", {size: new Size(17, 18)}),
    };

    private static right_button_textures = {
        pressed: new Texture("UI/CharCreate/NewChar.BtRight.pressed.0.png", {size: new Size(17, 18)}),
        normal: new Texture("UI/CharCreate/NewChar.BtRight.normal.0.png", {size: new Size(17, 18)}),
        hovered: new Texture("UI/CharCreate/NewChar.BtRight.mouseOver.0.png", {size: new Size(17, 18)}),
        disabled: new Texture("UI/CharCreate/NewChar.BtRight.disabled.0.png", {size: new Size(17, 18)}),
        focused: new Texture("UI/CharCreate/NewChar.BtRight.mouseOver.0.png", {size: new Size(17, 18)}),
    };

    private face_buttons: MapleButton[] = [
        new MapleButton(CreateMenu.left_button_textures, new Point(725, 370), this.change_face.bind(this, -1)),
        new MapleButton(CreateMenu.right_button_textures, new Point(855, 370), this.change_face.bind(this, 1)),
    ];
    private hair_buttons: MapleButton[] = [
        new MapleButton(CreateMenu.left_button_textures, new Point(725, 348), this.change_hair.bind(this, -1)),
        new MapleButton(CreateMenu.right_button_textures, new Point(855, 348), this.change_hair.bind(this, 1)),
    ];
    private upper_buttons: MapleButton[] = [
        new MapleButton(CreateMenu.left_button_textures, new Point(725, 326), this.change_upper.bind(this, -1)),
        new MapleButton(CreateMenu.right_button_textures, new Point(855, 326), this.change_upper.bind(this, 1)),
    ];
    private lower_buttons: MapleButton[] = [
        new MapleButton(CreateMenu.left_button_textures, new Point(725, 304), this.change_lower.bind(this, -1)),
        new MapleButton(CreateMenu.right_button_textures, new Point(855, 304), this.change_lower.bind(this, 1)),
    ];
    private shoe_buttons: MapleButton[] = [
        new MapleButton(CreateMenu.left_button_textures, new Point(725, 282), this.change_shoe.bind(this, -1)),
        new MapleButton(CreateMenu.right_button_textures, new Point(855, 282), this.change_shoe.bind(this, 1)),
    ];
    private weapon_buttons: MapleButton[] = [
        new MapleButton(CreateMenu.left_button_textures, new Point(725, 260), this.change_weapon.bind(this, -1)),
        new MapleButton(CreateMenu.right_button_textures, new Point(855, 260), this.change_weapon.bind(this, 1)),
    ];
}

const menu_sprites = (phase: UICharCreate.Phase): Sprite[] => {
    switch(phase){
        case UICharCreate.Phase.Name:
            return [
                new Sprite(new Texture("UI/CharCreate/NewChar.charName.png", {origin: new Point(650, 505), size: new Size(241, 269)})),
            ]
        case UICharCreate.Phase.Look:
            return [
                new Sprite(new Texture("UI/CharCreate/NewChar.charSet.png", {origin: new Point(650, 505), size: new Size(241, 384)})),
                new Sprite(new Texture("UI/CharCreate/NewChar.avatarSel.0.normal.png", {origin: new Point(675, 380), size: new Size(192, 20)})),
                new Sprite(new Texture("UI/CharCreate/NewChar.avatarSel.1.normal.png", {origin: new Point(675, 358), size: new Size(192, 20)})),
                new Sprite(new Texture("UI/CharCreate/NewChar.avatarSel.2.normal.png", {origin: new Point(675, 336), size: new Size(192, 20)})),
                new Sprite(new Texture("UI/CharCreate/NewChar.avatarSel.3.normal.png", {origin: new Point(675, 314), size: new Size(192, 20)})),
                new Sprite(new Texture("UI/CharCreate/NewChar.avatarSel.4.normal.png", {origin: new Point(675, 292), size: new Size(192, 20)})),
                new Sprite(new Texture("UI/CharCreate/NewChar.avatarSel.5.normal.png", {origin: new Point(675, 270), size: new Size(192, 20)})),
            ]
        case UICharCreate.Phase.Ability:
            return [
                new Sprite(new Texture("UI/CharCreate/NewChar.charSet.png", {origin: new Point(650, 505), size: new Size(241, 384)})),
            ]
    }
};