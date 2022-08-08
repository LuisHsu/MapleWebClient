/**
 * @category IO
 * @module Window
 */

import Setting from "../Setting";
import { Point, Size } from "../Types";

const ui_canvas = document.getElementById("ui") as HTMLCanvasElement;
const screen_canvas = document.getElementById("screen") as HTMLCanvasElement;

export class Window {
    static size = new Size(Setting.ScreenSize.width, Setting.ScreenSize.height);
    static init(): void {
        if(Setting.Fullscreen){
            document.body.requestFullscreen().catch(() => {});
        }
        ui_canvas.addEventListener("contextmenu", Window.handle_right_click.bind(this));
        ui_canvas.addEventListener("dblclick", Window.handle_double_click.bind(this));
        ui_canvas.addEventListener("mousedown", Window.handle_mouse_down.bind(this));
        ui_canvas.addEventListener("mouseup", Window.handle_mouse_up.bind(this));
        ui_canvas.addEventListener("mousemove", Window.handle_mouse_move.bind(this));
        ui_canvas.addEventListener("wheel", Window.handle_wheel.bind(this));
        document.body.addEventListener("keydown", Window.handle_keydown.bind(this));
        document.body.addEventListener("keyup", Window.handle_keyup.bind(this));
        screen_canvas.addEventListener("animationend", () => {
            // Reset fade
            document.body.className = ""; 
        })
    }

    static fade_out(): void {
        document.body.className = "fadeOut";
    }

    private static map_cursor_position = (pos: Point): Point => {
        let result = new Point;
        if(ui_canvas.clientHeight > ui_canvas.clientWidth * (Window.size.height / Window.size.width)){
            const window_h = ui_canvas.clientWidth * Window.size.height / Window.size.width;
            const window_y = pos.y - ((ui_canvas.clientHeight - window_h) / 2);
            result.x = Math.round(pos.x * Window.size.width / ui_canvas.clientWidth);
            result.y = Math.round(window_y * Window.size.height / window_h);
        }else{
            const window_w = ui_canvas.clientHeight * Window.size.width / Window.size.height;
            const window_x = pos.x - ((ui_canvas.clientWidth - window_w) / 2);
            result.x = Math.round(window_x * Window.size.width / window_w);
            result.y = Math.round(pos.y * Window.size.height / ui_canvas.clientHeight);
        }
        result.x = Math.max(0, Math.min(Window.size.width, result.x));
        result.y = Math.max(0, Math.min(Window.size.height, result.y));
        return result;
    }
    private static handle_right_click = (event: MouseEvent): void => {
        event.preventDefault();
        // Only care about right click
        if(event.button == 2){
            // TODO:
            console.log(Window.map_cursor_position(new Point(event.clientX, event.clientY)));
        }
    }
    private static handle_double_click = (event: MouseEvent): void => {
        event.preventDefault();
        // Only care about left click
        if(event.button == 0){
            // TODO:
            console.log(Window.map_cursor_position(new Point(event.clientX, event.clientY)));
        }
    }
    private static handle_mouse_down = (event: MouseEvent): void => {
        event.preventDefault();
        // Only care about left click
        if(event.button == 0){
            // TODO:
        }
    }
    private static handle_mouse_up = (event: MouseEvent): void => {
        event.preventDefault();
        // Only care about left click
        if(event.button == 0){
            // TODO:
        }
    }
    private static handle_mouse_move = (event: MouseEvent): void => {
        event.preventDefault();
        // Only care about left click
        if(event.button == 0){
            // TODO:
        }
    }
    private static handle_wheel = (event: WheelEvent): void => {
        event.preventDefault();
        // TODO:
        //console.log(event.deltaY);
    }
    private static handle_keydown = (event: KeyboardEvent): void => {
        // TODO:
    }
    private static handle_keyup = (event: KeyboardEvent): void => {
        // TODO:
    }
}

export default Window;