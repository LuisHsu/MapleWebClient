import Setting from "../Setting";
import { Point, Size } from "../Types";

export const window_size = new Size(Setting.ScreenSize.width, Setting.ScreenSize.height);
const ui_canvas = document.getElementById("ui") as HTMLCanvasElement;
const screen_canvas = document.getElementById("screen") as HTMLCanvasElement;

export default {init, fade_out}

function init(): void {
    if(Setting.Fullscreen){
        document.body.requestFullscreen().catch(() => {});
    }
    ui_canvas.addEventListener("contextmenu", handle_right_click.bind(this));
    ui_canvas.addEventListener("dblclick", handle_double_click.bind(this));
    ui_canvas.addEventListener("mousedown", handle_mouse_down.bind(this));
    ui_canvas.addEventListener("mouseup", handle_mouse_up.bind(this));
    ui_canvas.addEventListener("mousemove", handle_mouse_move.bind(this));
    ui_canvas.addEventListener("wheel", handle_wheel.bind(this));
    document.body.addEventListener("keydown", handle_keydown.bind(this));
    document.body.addEventListener("keyup", handle_keyup.bind(this));
    screen_canvas.addEventListener("animationend", () => {
        // Reset fade
        document.body.className = ""; 
    })
}

function fade_out(): void{
    document.body.className = "fadeOut";
}

const map_cursor_position = (pos: Point): Point => {
    let result = new Point;
    if(ui_canvas.clientHeight > ui_canvas.clientWidth * (window_size.height / window_size.width)){
        const window_h = ui_canvas.clientWidth * window_size.height / window_size.width;
        const window_y = pos.y - ((ui_canvas.clientHeight - window_h) / 2);
        result.x = Math.round(pos.x * window_size.width / ui_canvas.clientWidth);
        result.y = Math.round(window_y * window_size.height / window_h);
    }else{
        const window_w = ui_canvas.clientHeight * window_size.width / window_size.height;
        const window_x = pos.x - ((ui_canvas.clientWidth - window_w) / 2);
        result.x = Math.round(window_x * window_size.width / window_w);
        result.y = Math.round(pos.y * window_size.height / ui_canvas.clientHeight);
    }
    result.x = Math.max(0, Math.min(window_size.width, result.x));
    result.y = Math.max(0, Math.min(window_size.height, result.y));
    return result;
}
const handle_right_click = (event: MouseEvent): void => {
    event.preventDefault();
    // Only care about right click
    if(event.button == 2){
        // TODO:
        console.log(map_cursor_position(new Point(event.clientX, event.clientY)));
    }
}
const handle_double_click = (event: MouseEvent): void => {
    event.preventDefault();
    // Only care about left click
    if(event.button == 0){
        // TODO:
        console.log(map_cursor_position(new Point(event.clientX, event.clientY)));
    }
}
const handle_mouse_down = (event: MouseEvent): void => {
    event.preventDefault();
    // Only care about left click
    if(event.button == 0){
        // TODO:
    }
}
const handle_mouse_up = (event: MouseEvent): void => {
    event.preventDefault();
    // Only care about left click
    if(event.button == 0){
        // TODO:
    }
}
const handle_mouse_move = (event: MouseEvent): void => {
    event.preventDefault();
    // Only care about left click
    if(event.button == 0){
        // TODO:
    }
}
const handle_wheel = (event: WheelEvent): void => {
    event.preventDefault();
    // TODO:
    //console.log(event.deltaY);
}
const handle_keydown = (event: KeyboardEvent): void => {
    // TODO:
}
const handle_keyup = (event: KeyboardEvent): void => {
    // TODO:
}
