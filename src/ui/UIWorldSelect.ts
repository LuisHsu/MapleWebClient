/**
 * @category UI
 * @module UIWorldSelect
 */

import { UIElement } from "./UIElement";
import { Point, Size } from "../Types";
import GL, { Transform } from "../graphics/GL";
import { Sprite } from "../graphics/Sprite";
import { Texture } from "../graphics/Texture";
import UI, { UIState } from "./UI";
import { Button, MapleButton } from "../components/Button";
import Setting from "../Setting";
import Animation, { Frame } from "../graphics/Animation";
import { UILogin } from "./UILogin";
import Window from "../io/Window";

export class UIWorldSelect extends UIElement implements UIState{

    constructor(){
        super(world_sprites());
        this.channel_go_button.state = Button.State.DISABLED;
    }

    enter_world(): void {
        // TODO: channel select api
        console.log(this.selected_channel);
    }

    return_login(): void {
        Window.fade_out(() => {
            UI.change_state(new UILogin);
        })
    }

    draw(transform: Transform): void {
        super.draw(transform);
        this.world_button.draw(transform);
        this.return_button.draw(transform);
        if(this.state == UIWorldSelect.State.SELECT_CHANNEL){
            GL.draw_texture(this.channel_back, transform);
            GL.draw_texture(this.world_title, transform);
            this.channel_go_button.draw(transform);
            this.channel_buttons.forEach(button => {
                button.draw(transform);
            });
            if(this.selected_channel !== null){
                this.select_animation.draw({...transform,
                    offset: transform.offset.concat(new Point(
                        245 + 136 * (this.selected_channel % 4), 374 - 46 * Math.floor(this.selected_channel / 4)
                    ))
                });
            }
        }
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
        this.world_button.handle_click(position, new Point, this.world_click.bind(this));
        this.channel_go_button.handle_click(position, new Point, this.enter_world.bind(this));
        this.return_button.handle_click(position, new Point, this.return_login.bind(this));
        if(this.state == UIWorldSelect.State.SELECT_CHANNEL){
            this.channel_buttons.forEach((button, index) => {
                button.handle_click(position, new Point, this.channel_click.bind(this, index));
            });
        }
    }

    selected_channel: number = null;

    private channel_click(index: number){
        this.channel_go_button.state = Button.State.NORMAL;
        this.selected_channel = index;
        this.select_animation.reset();
        this.select_animation.start();
    }

    private world_click(){
        this.state = (this.state == UIWorldSelect.State.SELECT_WORLD) ? UIWorldSelect.State.SELECT_CHANNEL : UIWorldSelect.State.SELECT_WORLD;
        this.sprites[1] = this.scroll_sprite[this.state];
    }

    private world_button: MapleButton = new MapleButton({
        pressed: new Texture("UI/WorldSelect/WorldSelect.BtWorld.pressed.png", new Point, new Size(28, 100)),
        normal: new Texture("UI/WorldSelect/WorldSelect.BtWorld.normal.png", new Point, new Size(28, 95)),
        hovered: new Texture("UI/WorldSelect/WorldSelect.BtWorld.mouseOver.png", new Point, new Size(28, 100)),
        disabled: new Texture("UI/WorldSelect/WorldSelect.BtWorld.disabled.png", new Point, new Size(28, 100)),
    }, new Point(212, 615));

    private channel_go_button: MapleButton = new MapleButton({
        pressed: new Texture("UI/WorldSelect/WorldSelect.BtGoWorld.pressed.png", new Point, new Size(199, 54)),
        normal: new Texture("UI/WorldSelect/WorldSelect.BtGoWorld.normal.png", new Point, new Size(199, 54)),
        hovered: new Texture("UI/WorldSelect/WorldSelect.BtGoWorld.mouseOver.png", new Point, new Size(199, 54)),
        disabled: new Texture("UI/WorldSelect/WorldSelect.BtGoWorld.disabled.png", new Point, new Size(199, 54)),
    }, new Point(725, 449));

    private channel_buttons: MapleButton[] = create_channel_buttons();

    private return_button: MapleButton = new MapleButton({
        pressed: new Texture("UI/WorldSelect/Common.BtToLogin.pressed.png", new Point, new Size(136, 57)),
        normal: new Texture("UI/WorldSelect/Common.BtToLogin.normal.png", new Point, new Size(136, 57)),
        hovered: new Texture("UI/WorldSelect/Common.BtToLogin.mouseOver.png", new Point, new Size(136, 57)),
        disabled: new Texture("UI/WorldSelect/Common.BtToLogin.disabled.png", new Point, new Size(136, 57)),
    }, new Point(73, 125));

    private select_animation: Animation = new Animation([
        new Frame(new Texture("UI/WorldSelect/WorldSelect.channel.chSelect.0.png",
            new Point(29, 5.5), new Size(27, 13)), 0.1),
        new Frame(new Texture("UI/WorldSelect/WorldSelect.channel.chSelect.1.png",
            new Point(20, 11), new Size(44, 24)), 0.05),
        new Frame(new Texture("UI/WorldSelect/WorldSelect.channel.chSelect.2.png",
            new Point(20, 18), new Size(49, 38)), 0.05),
        new Frame(new Texture("UI/WorldSelect/WorldSelect.channel.chSelect.3.png",
            new Point(30, 18), new Size(68, 38))),
    ])

    private state: UIWorldSelect.State = UIWorldSelect.State.SELECT_WORLD;
    private scroll_sprite: {[state in UIWorldSelect.State]: Sprite} = {
        [UIWorldSelect.State.SELECT_WORLD]: new Sprite(new Texture("UI/WorldSelect/WorldSelect.scroll.0.png", new Point(520, 580), new Size(780, 210))),
        [UIWorldSelect.State.SELECT_CHANNEL]: new Sprite(new Texture("UI/WorldSelect/WorldSelect.scroll.1.png", new Point(520, 405), new Size(780, 560))),
    }

    private world_title: Texture = new Texture("UI/WorldSelect/WorldSelect.world.t0.png", new Point(325, 452), new Size(169, 70));
    private channel_back: Texture = new Texture("UI/WorldSelect/WorldSelect.chBackgrn.png", new Point(529, 320), new Size(682, 330));
}

export namespace UIWorldSelect{
    export enum State{
        SELECT_WORLD,
        SELECT_CHANNEL,
    }
}

const world_sprites = (): Sprite[] => {
    let results = [
        new Sprite(new Texture("Map/Back/WorldSelect.back.png", new Point(525, 420), new Size(880, 660))),
        new Sprite(new Texture("UI/WorldSelect/WorldSelect.scroll.0.png", new Point(520, 580), new Size(780, 210))),
        new Sprite(new Texture("UI/WorldSelect/WorldSelect.signboard.png", new Point(520, 750), new Size(800, 203))),
    ]
    for(let i = 0; i < 19; ++i){
        results.push(new Sprite(new Texture("UI/WorldSelect/WorldSelect.BtWorld.empty.png", new Point(246 + (32 * i), 615), new Size(28, 95))));
    }
    results.push(new Sprite(new Texture("UI/Login/1024frame.png", new Point(512, 384), new Size(1024, 768))));
    results.push(new Sprite(new Texture("UI/WorldSelect/Common.step.1.png", new Point(75, 700), new Size(165, 63))));
    return results;
};

const create_channel_buttons = (): MapleButton[] => {
    let results = []
    for(let i = 0; i < Setting.ServerChannels; ++i){
        results.push(new MapleButton({
            pressed: new Texture(`UI/WorldSelect/WorldSelect.channel.${i}.normal.png`, new Point, new Size(134, 44)),
            hovered: new Texture(`UI/WorldSelect/WorldSelect.channel.${i}.normal.png`, new Point, new Size(134, 44)),
            disabled: new Texture(`UI/WorldSelect/WorldSelect.channel.${i}.disabled.png`, new Point, new Size(134, 44)),
            normal: new Texture(`UI/WorldSelect/WorldSelect.channel.${i}.disabled.png`, new Point, new Size(134, 44)),
        }, new Point(320 + 136 * (i % 4), 384 - 46 * Math.floor(i / 4))));
    }
    return results;
};