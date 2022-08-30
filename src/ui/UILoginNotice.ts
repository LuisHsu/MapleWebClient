/**
 * @category UI
 * @module UILoginNotice
 */

import { Button, MapleButton } from "../components/Button";
import Canvas, { Drawable, Transform } from "../graphics/Canvas";
import { Texture } from "../graphics/Texture";
import { MouseHandler } from "../io/Cursor";
import { KeyboardHandler, KeyType, TabFocus } from "../io/Keyboard";
import { Point } from "../Types";

export class UILoginNotice implements Drawable, MouseHandler{

    constructor(
        type: UILoginNotice.Type, message: UILoginNotice.MessageID,
        onConfirm: () => void, onCancel?: () => void
    ){
        this.background = new Texture(background_map[type], {offset: new Point(512, 384)});
        this.message = new Texture(message_map[message], {offset: new Point(552, 415)});
        this.on_confirm = onConfirm;
        this.on_cancel = onCancel;
        if(this.on_cancel){
            this.tab_focus.add(this.cancel_button);
        }else{
            this.confirm_button.position = new Point(517, 328);
        }
    }

    confirm(): void{
        this.on_confirm();
    }
    cancel(): void{
        if(this.on_cancel){
            this.on_cancel();
        }
    }

    draw(transform: Transform): void {
        Canvas.draw_texture(this.background, transform);
        Canvas.draw_texture(this.message, transform);
        this.confirm_button.draw(transform);
        if(this.on_cancel){
            this.cancel_button.draw(transform);
        }
    }

    mouse_move(position: Point): void {
        this.confirm_button.update_hover(position);
        if(this.on_cancel){
            this.cancel_button.update_hover(position);
        }
    }

    mouse_down(position: Point): void {
        this.confirm_button.update_pressed(position);
        if(this.on_cancel){
            this.cancel_button.update_pressed(position);
        }
    }

    mouse_up(position: Point): void {
        this.confirm_button.update_released(position);
        if(this.on_cancel){
            this.cancel_button.update_released(position);
        }
    }

    left_click(position: Point): void {
        this.confirm_button.handle_click(position, this.confirm.bind(this));
        if(this.on_cancel){
            this.cancel_button.handle_click(position, this.cancel.bind(this));
        }
    }

    private confirm_button: MapleButton = new MapleButton({
        pressed: new Texture("UI/Login/Notice.BtYes.pressed.0.png"),
        hovered: new Texture("UI/Login/Notice.BtYes.mouseOver.0.png"),
        normal: new Texture("UI/Login/Notice.BtYes.normal.0.png"),
        disabled: new Texture("UI/Login/Notice.BtYes.disabled.0.png"),
        focused: new Texture("UI/Login/Notice.BtYes.mouseOver.0.png"),
    }, new Point(475, 328), this.confirm.bind(this));

    private cancel_button: MapleButton = new MapleButton({
        pressed: new Texture("UI/Login/Notice.BtNo.pressed.0.png"),
        hovered: new Texture("UI/Login/Notice.BtNo.mouseOver.0.png"),
        normal: new Texture("UI/Login/Notice.BtNo.normal.0.png"),
        disabled: new Texture("UI/Login/Notice.BtNo.disabled.0.png"),
        focused: new Texture("UI/Login/Notice.BtNo.mouseOver.0.png"),
    }, new Point(560, 328), this.cancel.bind(this));

    tab_focus: TabFocus = new TabFocus([
        this.confirm_button,
    ]);
    private on_confirm: () => void;
    private on_cancel: () => void;
    private background: Texture;
    private message: Texture;
}

export namespace UILoginNotice {
    export enum Type {
        notice, error
    }
    export enum MessageID {
        account_not_match
    }
}

const background_map: {[type in UILoginNotice.Type]: string} = {
    [UILoginNotice.Type.notice]: "UI/Login/Notice.backgrnd.0.png",
    [UILoginNotice.Type.error]: "UI/Login/Notice.backgrnd.1.png",
}

const message_map: {[type in UILoginNotice.MessageID]: string} = {
    [UILoginNotice.MessageID.account_not_match]: "UI/Login/Notice.text.2.png",
}