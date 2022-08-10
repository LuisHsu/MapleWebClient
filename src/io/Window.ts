/**
 * @category IO
 * @module Window
 */

import Setting from "../Setting";
import UI from "./UI";
import { NeedInit, Point, Size } from "../Types";

const canvas = document.getElementById("screen") as HTMLCanvasElement;

export class Window implements NeedInit {
    size = new Size(Setting.ScreenSize.width, Setting.ScreenSize.height);
    init(): void {
        if(Setting.Fullscreen){
            document.body.requestFullscreen().catch(() => {});
        }
        canvas.addEventListener("contextmenu", this.handle_right_click.bind(this));
        canvas.addEventListener("dblclick", this.handle_double_click.bind(this));
        canvas.addEventListener("mousedown", this.handle_mouse_down.bind(this));
        canvas.addEventListener("mouseup", this.handle_mouse_up.bind(this));
        canvas.addEventListener("mousemove", this.handle_mouse_move.bind(this));
        canvas.addEventListener("wheel", this.handle_wheel.bind(this));
        document.body.addEventListener("keydown", this.handle_keydown.bind(this));
        document.body.addEventListener("keyup", this.handle_keyup.bind(this));
        canvas.addEventListener("animationend", () => {
            // Reset fade
            document.body.className = ""; 
        })
    }

    fade_out(): void {
        document.body.className = "fadeOut";
    }

    private map_cursor_position = (pos: Point): Point => {
        let result = new Point;
        if(canvas.clientHeight > canvas.clientWidth * (this.size.height / this.size.width)){
            const window_h = canvas.clientWidth * this.size.height / this.size.width;
            const window_y = pos.y - ((canvas.clientHeight - window_h) / 2);
            result.x = Math.round(pos.x * this.size.width / canvas.clientWidth);
            result.y = Math.round(window_y * this.size.height / window_h);
        }else{
            const window_w = canvas.clientHeight * this.size.width / this.size.height;
            const window_x = pos.x - ((canvas.clientWidth - window_w) / 2);
            result.x = Math.round(window_x * this.size.width / window_w);
            result.y = Math.round(pos.y * this.size.height / canvas.clientHeight);
        }
        result.x = Math.max(5, Math.min(this.size.width - 5, result.x));
        result.y = Math.max(5, Math.min(this.size.height, this.size.height - result.y - 5));
        return result;
    }
    private handle_right_click = (event: MouseEvent): void => {
        event.preventDefault();
        // Only care about right click
        if(event.button == 2){
            // TODO:
            console.log(this.map_cursor_position(new Point(event.clientX, event.clientY)));
        }
    }
    private handle_double_click = (event: MouseEvent): void => {
        event.preventDefault();
        // Only care about left click
        if(event.button == 0){
            // TODO:
            console.log(this.map_cursor_position(new Point(event.clientX, event.clientY)));
        }
    }
    private handle_mouse_down = (event: MouseEvent): void => {
        event.preventDefault();
        // Only care about left click
        if(event.button == 0){
            UI.mouse_down(this.map_cursor_position(new Point(event.clientX, event.clientY)));
        }
    }
    private handle_mouse_up = (event: MouseEvent): void => {
        event.preventDefault();
        // Only care about left click
        if(event.button == 0){
            UI.mouse_up(this.map_cursor_position(new Point(event.clientX, event.clientY)));
        }
    }
    private handle_mouse_move = (event: MouseEvent): void => {
        event.preventDefault();
        UI.mouse_move(this.map_cursor_position(new Point(event.clientX, event.clientY)))
    }
    private handle_wheel = (event: WheelEvent): void => {
        event.preventDefault();
        UI.mouse_wheel(event.deltaY);
    }
    private handle_keydown = (event: KeyboardEvent): void => {
        // TODO:
    }
    private handle_keyup = (event: KeyboardEvent): void => {
        // TODO:
    }
}

let _Window = new Window;
export default _Window;