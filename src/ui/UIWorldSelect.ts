/**
 * @category UI
 * @module UIWorldSelect
 */

import { UIElement } from "./UIElement";
import { Point, Size } from "../Types";
import canvas, { Transform } from "../graphics/Canvas";
import { Sprite } from "../graphics/Sprite";
import { Texture } from "../graphics/Texture";
import { Button, MapleButton } from "../components/Button";
import Setting from "../Setting";
import Animation, { Frame } from "../graphics/Animation";
import { UILogin } from "./UILogin";
import { KeyType, TabFocus } from "../io/Keyboard";
import { LoginState, UILoginState } from "./UILoginState";
import { UILoginNotice } from "./UILoginNotice";
import LoginSession from "../net/LoginSession";

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
            LoginSession.character_list(this.selected_channel);
            this.state = UIWorldSelect.State.LOADING;
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
        this.world_button.draw();
        if(this.state == UIWorldSelect.State.SELECT_CHANNEL || this.state == UIWorldSelect.State.LOADING){
            canvas.draw_texture(this.channel_back);
            canvas.draw_texture(this.world_title);
            this.channel_go_button.draw();
            this.channel_buttons.forEach(button => {
                button.draw();
            });
            if(this.selected_channel !== null){
                canvas.open_scope(() => {
                    canvas.apply_transform(new Transform({
                        translate: new Point(
                            215 + 136 * (this.selected_channel % 4),
                            384 - 46 * Math.floor(this.selected_channel / 4)
                        )
                    }))
                    this.select_animation.draw();
                })
            }
            if(this.state == UIWorldSelect.State.LOADING){
                this.loading_notice.draw();
            }
        }
    }

    draw_foreground(): void {
        canvas.draw_texture(this.step_texture);
        this.return_button.draw();
    }

    mouse_move(position: Point): void {
        if(this.state != UIWorldSelect.State.LOADING){
            this.world_button.update_hover(position);
            this.return_button.update_hover(position);
            if(this.state == UIWorldSelect.State.SELECT_CHANNEL){
                this.channel_go_button.update_hover(position);
                this.channel_buttons.forEach(button => {
                    button.update_hover(position);
                });
            }
        }
    }

    mouse_down(position: Point): void {
        if(this.state != UIWorldSelect.State.LOADING){
            this.world_button.update_pressed(position);
            this.return_button.update_pressed(position);
            if(this.state == UIWorldSelect.State.SELECT_CHANNEL){
                this.channel_go_button.update_pressed(position);
                this.channel_buttons.forEach(button => {
                    button.update_pressed(position);
                });
            }
        }
    }

    mouse_up(position: Point): void {
        if(this.state != UIWorldSelect.State.LOADING){
            this.world_button.update_released(position);
            this.return_button.update_released(position);
            if(this.state == UIWorldSelect.State.SELECT_CHANNEL){
                this.channel_go_button.update_released(position);
                this.channel_buttons.forEach(button => {
                    button.update_released(position);
                });
            }
        }
    }

    left_click(position: Point): void {
        if(this.state != UIWorldSelect.State.LOADING){
            this.world_button.handle_click(position, this.world_click.bind(this));
            this.channel_go_button.handle_click(position, this.enter_world.bind(this));
            this.return_button.handle_click(position, this.return_login.bind(this));
            if(this.state == UIWorldSelect.State.SELECT_CHANNEL){
                this.channel_buttons.forEach((button, index) => {
                    button.handle_click(position, this.channel_click.bind(this, index));
                });
            }
        }
    }

    key_up(key: KeyType): void {
        if(this.state != UIWorldSelect.State.LOADING){
            TabFocus.update(key);
        }
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
    }, new Point(225, 588), this.world_click.bind(this));

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
        new Frame([new Texture("UI/WorldSelect/WorldSelect.channel.chSelect.0.png",
            {origin: new Point(29, 5.5), size: new Size(27, 13)})], 0.1),
        new Frame([new Texture("UI/WorldSelect/WorldSelect.channel.chSelect.1.png",
            {origin: new Point(20, 11), size: new Size(44, 24)})], 0.05),
        new Frame([new Texture("UI/WorldSelect/WorldSelect.channel.chSelect.2.png",
            {origin: new Point(20, 18), size: new Size(49, 38)})], 0.05),
        new Frame([new Texture("UI/WorldSelect/WorldSelect.channel.chSelect.3.png",
            {origin: new Point(30, 18), size: new Size(68, 38)})]),
    ]);

    private state: UIWorldSelect.State = UIWorldSelect.State.SELECT_WORLD;
    private scroll_sprite: {[state in UIWorldSelect.State]?: Sprite} = {
        [UIWorldSelect.State.SELECT_WORLD]: new Sprite(new Texture("UI/WorldSelect/WorldSelect.scroll.0.png", {origin: new Point(135, 680), size: new Size(780, 210)})),
        [UIWorldSelect.State.SELECT_CHANNEL]: new Sprite(new Texture("UI/WorldSelect/WorldSelect.scroll.1.png", {origin: new Point(135, 680), size: new Size(780, 560)})),
    }

    private world_title: Texture = new Texture("UI/WorldSelect/WorldSelect.world.t0.png", {origin: new Point(265, 482), size: new Size(169, 70)});
    private channel_back: Texture = new Texture("UI/WorldSelect/WorldSelect.chBackgrn.png", {origin: new Point(193, 480), size: new Size(682, 330)});
    private step_texture: Texture = new Texture("UI/WorldSelect/Common.step.1.png", {origin: new Point(0, 700), size: new Size(165, 63)});

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
                new Point(320 + 136 * (i % 4), 376 - 46 * Math.floor(i / 4)),
                this.channel_click.bind(this, i)
            ));
        }
        return results;
    };

    private loading_notice = new UIElement([
        new Sprite(new Texture("UI/WorldSelect/Notice.Loading.backgrnd.png", {origin: new Point(336, 474), size: new Size(353, 180)})),
        new Sprite(new Animation([
            new Frame([new Texture("UI/WorldSelect/Notice.Loading.bar.0.png", {origin: new Point(500, 352), size: new Size(136, 10)})], 200),
            new Frame([new Texture("UI/WorldSelect/Notice.Loading.bar.1.png", {origin: new Point(500, 352), size: new Size(136, 10)})], 200),
            new Frame([new Texture("UI/WorldSelect/Notice.Loading.bar.2.png", {origin: new Point(500, 352), size: new Size(136, 10)})], 200),
            new Frame([new Texture("UI/WorldSelect/Notice.Loading.bar.3.png", {origin: new Point(500, 352), size: new Size(136, 10)})], 200),
            new Frame([new Texture("UI/WorldSelect/Notice.Loading.bar.4.png", {origin: new Point(500, 352), size: new Size(136, 10)})], 200),
            new Frame([new Texture("UI/WorldSelect/Notice.Loading.bar.5.png", {origin: new Point(500, 352), size: new Size(136, 10)})], 200),
            new Frame([new Texture("UI/WorldSelect/Notice.Loading.bar.6.png", {origin: new Point(500, 352), size: new Size(136, 10)})], 200),
            new Frame([new Texture("UI/WorldSelect/Notice.Loading.bar.7.png", {origin: new Point(500, 352), size: new Size(136, 10)})], 200),
            new Frame([new Texture("UI/WorldSelect/Notice.Loading.bar.8.png", {origin: new Point(500, 352), size: new Size(136, 10)})], 200),
            new Frame([new Texture("UI/WorldSelect/Notice.Loading.bar.9.png", {origin: new Point(500, 352), size: new Size(136, 10)})], 200),
            new Frame([new Texture("UI/WorldSelect/Notice.Loading.bar.10.png", {origin: new Point(500, 352), size: new Size(136, 10)})], 200),
        ], true, true)),
    ])

    parent: UILoginState;
}

export namespace UIWorldSelect{
    export enum State{
        SELECT_WORLD,
        SELECT_CHANNEL,
        LOADING,
    }
}

const world_sprites = (): Sprite[] => {
    let results = [
        new Sprite(new Texture("Map/Back/WorldSelect.back.png", {origin: new Point(60, 768), size: new Size(880, 660)})),
        new Sprite(new Texture("UI/WorldSelect/WorldSelect.scroll.0.png", {origin: new Point(135, 660), size: new Size(780, 210)})),
        new Sprite(new Texture("UI/WorldSelect/WorldSelect.signboard.png", {origin: new Point(130, 830), size: new Size(800, 203)})),
    ]
    for(let i = 0; i < 19; ++i){
        results.push(new Sprite(new Texture("UI/WorldSelect/WorldSelect.BtWorld.empty.png", {origin: new Point(242 + (32 * i), 635), size: new Size(28, 95)})));
    }
    return results;
};