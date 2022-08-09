/**
 * @category IO
 * @module Window
 */

import Setting from "../Setting";
import UI from "../ui/UI";
import { Color, NeedInit, Point, Size } from "../Types";
import { KeyMap, SkipDefaultKeys } from "./Keyboard";

const display = document.getElementById("display") as HTMLDivElement;

export class Window implements NeedInit {
    size = new Size(Setting.ScreenSize.width, Setting.ScreenSize.height);
    init(): void {
        if(Setting.Fullscreen){
            document.body.requestFullscreen().catch(() => {});
        }
        display.addEventListener("contextmenu", this.handle_right_click.bind(this));
        display.addEventListener("dblclick", this.handle_double_click.bind(this));
        display.addEventListener("mousedown", this.handle_mouse_down.bind(this));
        display.addEventListener("mouseup", this.handle_mouse_up.bind(this));
        display.addEventListener("mousemove", this.handle_mouse_move.bind(this));
        display.addEventListener("click", this.handle_mouse_click.bind(this));
        display.addEventListener("wheel", this.handle_wheel.bind(this));
        document.body.addEventListener("keydown", this.handle_keydown.bind(this));
        document.body.addEventListener("keyup", this.handle_keyup.bind(this));
    }

    fade_out(callback?: () => void): void {
        function onEnd(){
            display.className = "";
            display.removeEventListener("animationend", onEnd);
            if(callback){
                callback();
            }
        }
        display.addEventListener("animationend", onEnd);
        display.className = "fadeOut";
    }

    quit(): void {
        if(Setting.Fullscreen){
            document.exitFullscreen().catch(() => {}).finally(() => {
                window.location.reload();
            });
        }
    }

    set_background(color: Color): void {
        display.style.backgroundColor = color.toString();
    }

    private map_cursor_position = (pos: Point): Point => {
        return new Point(
            Math.max(5, Math.min(
                this.size.width - 5,
                Math.round((pos.x - display.offsetLeft) * this.size.width / display.offsetWidth)
            )),
            Math.max(5, Math.min(
                this.size.height, 
                this.size.height - Math.round((pos.y - display.offsetTop) * this.size.height / display.offsetHeight) - 5
            ))
        );
    }
    private handle_right_click = (event: MouseEvent): void => {
        event.preventDefault();
        // Only care about right click
        if(event.button == 2){
            UI.right_click(this.map_cursor_position(new Point(event.clientX, event.clientY)));
        }
    }
    private handle_double_click = (event: MouseEvent): void => {
        event.preventDefault();
        // Only care about left click
        if(event.button == 0){
            UI.double_click(this.map_cursor_position(new Point(event.clientX, event.clientY)));
        }
    }
    private handle_mouse_down = (event: MouseEvent): void => {
        event.preventDefault();
        event.stopPropagation();
        // Only care about left click
        if(event.button == 0){
            UI.mouse_down(this.map_cursor_position(new Point(event.clientX, event.clientY)));
        }
    }
    private handle_mouse_up = (event: MouseEvent): void => {
        event.preventDefault();
        event.stopPropagation();
        // Only care about left click
        if(event.button == 0){
            UI.mouse_up(this.map_cursor_position(new Point(event.clientX, event.clientY)));
        }
    }
    private handle_mouse_move = (event: MouseEvent): void => {
        event.preventDefault();
        event.stopPropagation();
        UI.mouse_move(this.map_cursor_position(new Point(event.clientX, event.clientY)))
    }
    private handle_mouse_click = (event: MouseEvent): void => {
        event.stopPropagation();
        event.preventDefault();
        // Only care about left click
        if(event.button == 0){
            UI.left_click(this.map_cursor_position(new Point(event.clientX, event.clientY)))
        }
    }
    private handle_wheel = (event: WheelEvent): void => {
        event.preventDefault();
        UI.mouse_wheel(event.deltaY);
    }
    private handle_keydown = (event: KeyboardEvent): void => {
        if(event.key in KeyMap){
            let key = KeyMap[event.key];
            if(SkipDefaultKeys.includes(key)){
                event.preventDefault();
            }
            UI.key_down(key);
        }
    }
    private handle_keyup = (event: KeyboardEvent): void => {
        if(event.key in KeyMap){
            let key = KeyMap[event.key];
            if(SkipDefaultKeys.includes(key)){
                event.preventDefault();
            }
            UI.key_up(key);
        }
    }
}

let instance = new Window;
export default instance;
