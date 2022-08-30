/**
 * @category UI
 * @module UIWorldSelect
 */

import { UIElement } from "./UIElement";
import { Point, Size } from "../Types";
import Canvas, { Transform } from "../graphics/Canvas";
import { Sprite } from "../graphics/Sprite";
import { Texture } from "../graphics/Texture";
import { Button, MapleButton } from "../components/Button";
import Setting from "../Setting";
import Animation, { Frame } from "../graphics/Animation";
import { UILogin } from "./UILogin";
import { KeyType, TabFocus } from "../io/Keyboard";
import { LoginState, UILoginState } from "./UILoginState";
import { UICharSelect } from "./UICharSelect";
import { UILoginNotice } from "./UILoginNotice";

export class UIWorldSelect extends UIElement implements LoginState {

    constructor(parent: UILoginState){
        super(world_sprites());
        this.parent = parent;
        this.channel_go_button.state = Button.State.DISABLED;
        this.tab_focus = new TabFocus([this.world_button]);
        this.channel_tab_focus = new TabFocus([...this.channel_buttons]);
        this.channel_tab_focus.add(this.channel_go_button);
        this.channel_go_button.focus = () => {
            if(this.selected_channel !== null){
                this.channel_go_button.focused = true;
            }else{
                this.channel_go_button.blur();
                TabFocus.update(KeyType.Tab);
            }
        }
        this.tab_focus.add(this.return_button);
        this.channel_tab_focus.deactivate();
    }

    enter_world(): void {
        if(this.selected_channel !== null){
            this.clean();
            this.parent.change_state(
                new UICharSelect(this.parent, this.selected_channel),
                UILoginState.Direction.Down
            );
        }
    }

    return_login(): void {
        this.parent.set_notice(
            UILoginNotice.Type.notice, UILoginNotice.MessageID.back_to_login,
            () => {
                this.clean();
                this.parent.change_state(
                    new UILogin(this.parent),
                    UILoginState.Direction.Up
                );
            },
            () => {}
        );
    }

    clean(): void {
        this.tab_focus.remove();
        this.channel_tab_focus.remove();
    }

    draw(transform: Transform): void {
        super.draw(transform);
        this.world_button.draw(transform);
        if(this.state == UIWorldSelect.State.SELECT_CHANNEL){
            Canvas.draw_texture(this.channel_back, transform);
            Canvas.draw_texture(this.world_title, transform);
            this.channel_go_button.draw(transform);
            this.channel_buttons.forEach(button => {
                button.draw(transform);
            });
            if(this.selected_channel !== null){
                this.select_animation.draw(new Transform({...transform,
                    offset: transform.offset.concat(new Point(
                        245 + 136 * (this.selected_channel % 4), 374 - 46 * Math.floor(this.selected_channel / 4)
                    ))
                }));
            }
        }
    }

    fg_draw(transform: Transform): void {
        Canvas.draw_texture(this.step_texture, transform);
        this.return_button.draw(transform);
    }

    mouse_move(position: Point): void {
        this.world_button.update_hover(position);
        this.return_button.update_hover(position);
        if(this.state == UIWorldSelect.State.SELECT_CHANNEL){
            this.channel_go_button.update_hover(position);
            this.channel_buttons.forEach(button => {
                button.update_hover(position);
            });
        }
    }

    mouse_down(position: Point): void {
        this.world_button.update_pressed(position);
        this.return_button.update_pressed(position);
        if(this.state == UIWorldSelect.State.SELECT_CHANNEL){
            this.channel_go_button.update_pressed(position);
            this.channel_buttons.forEach(button => {
                button.update_pressed(position);
            });
        }
    }

    mouse_up(position: Point): void {
        this.world_button.update_released(position);
        this.return_button.update_released(position);
        if(this.state == UIWorldSelect.State.SELECT_CHANNEL){
            this.channel_go_button.update_released(position);
            this.channel_buttons.forEach(button => {
                button.update_released(position);
            });
        }
    }

    left_click(position: Point): void {
        this.world_button.handle_click(position, this.world_click.bind(this));
        this.channel_go_button.handle_click(position, this.enter_world.bind(this));
        this.return_button.handle_click(position, this.return_login.bind(this));
        if(this.state == UIWorldSelect.State.SELECT_CHANNEL){
            this.channel_buttons.forEach((button, index) => {
                button.handle_click(position, this.channel_click.bind(this, index));
            });
        }
    }

    key_up(key: KeyType): void {
        TabFocus.update(key);
    }

    selected_channel: number = null;

    private tab_focus: TabFocus;
    private channel_tab_focus: TabFocus;

    private channel_click(index: number){
        this.channel_go_button.state = Button.State.NORMAL;
        this.selected_channel = index;
        this.select_animation.reset();
        this.select_animation.start();
    }

    private world_click(){
        switch(this.state){
            case UIWorldSelect.State.SELECT_WORLD:
                this.state = UIWorldSelect.State.SELECT_CHANNEL;
                this.channel_tab_focus.activate();
            break;
            case UIWorldSelect.State.SELECT_CHANNEL:
                this.state = UIWorldSelect.State.SELECT_WORLD;
                this.channel_tab_focus.deactivate();
            break;
        }
        this.sprites[1] = this.scroll_sprite[this.state];
    }

    private world_button: MapleButton = new MapleButton({
        pressed: new Texture("UI/WorldSelect/WorldSelect.BtWorld.pressed.png", {size: new Size(28, 100)}),
        normal: new Texture("UI/WorldSelect/WorldSelect.BtWorld.normal.png", {size: new Size(28, 95)}),
        hovered: new Texture("UI/WorldSelect/WorldSelect.BtWorld.mouseOver.png", {size: new Size(28, 100)}),
        disabled: new Texture("UI/WorldSelect/WorldSelect.BtWorld.disabled.png", {size: new Size(28, 100)}),
        focused: new Texture("UI/WorldSelect/WorldSelect.BtWorld.mouseOver.png", {size: new Size(28, 100)}),
    }, new Point(212, 615), this.world_click.bind(this));

    private channel_go_button: MapleButton = new MapleButton({
        pressed: new Texture("UI/WorldSelect/WorldSelect.BtGoWorld.pressed.png", {size: new Size(199, 54)}),
        normal: new Texture("UI/WorldSelect/WorldSelect.BtGoWorld.normal.png", {size: new Size(199, 54)}),
        hovered: new Texture("UI/WorldSelect/WorldSelect.BtGoWorld.mouseOver.png", {size: new Size(199, 54)}),
        disabled: new Texture("UI/WorldSelect/WorldSelect.BtGoWorld.disabled.png", {size: new Size(199, 54)}),
        focused: new Texture("UI/WorldSelect/WorldSelect.BtGoWorld.mouseOver.png", {size: new Size(199, 54)}),
    }, new Point(725, 449), this.enter_world.bind(this));

    private channel_buttons: MapleButton[] = this.create_channel_buttons();

    private return_button: MapleButton = new MapleButton({
        pressed: new Texture("UI/WorldSelect/Common.BtToLogin.pressed.png", {size: new Size(136, 57)}),
        normal: new Texture("UI/WorldSelect/Common.BtToLogin.normal.png", {size: new Size(136, 57)}),
        hovered: new Texture("UI/WorldSelect/Common.BtToLogin.mouseOver.png", {size: new Size(136, 57)}),
        disabled: new Texture("UI/WorldSelect/Common.BtToLogin.disabled.png", {size: new Size(136, 57)}),
        focused: new Texture("UI/WorldSelect/Common.BtToLogin.mouseOver.png", {size: new Size(136, 57)}),
    }, new Point(73, 125), this.return_login.bind(this));

    private select_animation: Animation = new Animation([
        new Frame(new Texture("UI/WorldSelect/WorldSelect.channel.chSelect.0.png",
            {offset: new Point(29, 5.5), size: new Size(27, 13)}), 0.1),
        new Frame(new Texture("UI/WorldSelect/WorldSelect.channel.chSelect.1.png",
            {offset: new Point(20, 11), size: new Size(44, 24)}), 0.05),
        new Frame(new Texture("UI/WorldSelect/WorldSelect.channel.chSelect.2.png",
            {offset: new Point(20, 18), size: new Size(49, 38)}), 0.05),
        new Frame(new Texture("UI/WorldSelect/WorldSelect.channel.chSelect.3.png",
            {offset: new Point(30, 18), size: new Size(68, 38)})),
    ]);

    private state: UIWorldSelect.State = UIWorldSelect.State.SELECT_WORLD;
    private scroll_sprite: {[state in UIWorldSelect.State]: Sprite} = {
        [UIWorldSelect.State.SELECT_WORLD]: new Sprite(new Texture("UI/WorldSelect/WorldSelect.scroll.0.png", {offset: new Point(520, 580), size: new Size(780, 210)})),
        [UIWorldSelect.State.SELECT_CHANNEL]: new Sprite(new Texture("UI/WorldSelect/WorldSelect.scroll.1.png", {offset: new Point(520, 405), size: new Size(780, 560)})),
    }

    private world_title: Texture = new Texture("UI/WorldSelect/WorldSelect.world.t0.png", {offset: new Point(325, 452), size: new Size(169, 70)});
    private channel_back: Texture = new Texture("UI/WorldSelect/WorldSelect.chBackgrn.png", {offset: new Point(529, 320), size: new Size(682, 330)});
    private step_texture: Texture = new Texture("UI/WorldSelect/Common.step.1.png", {offset: new Point(75, 700), size: new Size(165, 63)});

    private create_channel_buttons(): MapleButton[] {
        let results = []
        for(let i = 0; i < Setting.ServerChannels; ++i){
            results.push(new MapleButton(
                {
                    pressed: new Texture(`UI/WorldSelect/WorldSelect.channel.${i}.normal.png`, {size: new Size(134, 44)}),
                    hovered: new Texture(`UI/WorldSelect/WorldSelect.channel.${i}.normal.png`, {size: new Size(134, 44)}),
                    disabled: new Texture(`UI/WorldSelect/WorldSelect.channel.${i}.disabled.png`, {size: new Size(134, 44)}),
                    normal: new Texture(`UI/WorldSelect/WorldSelect.channel.${i}.disabled.png`, {size: new Size(134, 44)}),
                    focused: new Texture(`UI/WorldSelect/WorldSelect.channel.${i}.normal.png`, {size: new Size(134, 44)}),
                },
                new Point(320 + 136 * (i % 4), 384 - 46 * Math.floor(i / 4)),
                this.channel_click.bind(this, i)
            ));
        }
        return results;
    };

    parent: UILoginState;
}

export namespace UIWorldSelect{
    export enum State{
        SELECT_WORLD,
        SELECT_CHANNEL,
    }
}

const world_sprites = (): Sprite[] => {
    let results = [
        new Sprite(new Texture("Map/Back/WorldSelect.back.png", {offset: new Point(525, 420), size: new Size(880, 660)})),
        new Sprite(new Texture("UI/WorldSelect/WorldSelect.scroll.0.png", {offset: new Point(520, 580), size: new Size(780, 210)})),
        new Sprite(new Texture("UI/WorldSelect/WorldSelect.signboard.png", {offset: new Point(520, 750), size: new Size(800, 203)})),
    ]
    for(let i = 0; i < 19; ++i){
        results.push(new Sprite(new Texture("UI/WorldSelect/WorldSelect.BtWorld.empty.png", {offset: new Point(246 + (32 * i), 615), size: new Size(28, 95)})));
    }
    return results;
};