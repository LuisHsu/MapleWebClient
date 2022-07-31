import { Point, Size } from "../common";


const window_size = new Size(1024, 768);

class Window {
    static #canvas = document.getElementById("screen") as HTMLCanvasElement;

    static #map_cursor_position(pos: Point): Point{
        let result = new Point;
        if(this.#canvas.clientHeight > this.#canvas.clientWidth * 0.75){
            const window_h = this.#canvas.clientWidth * window_size.height / window_size.width;
            const window_y = pos.y - ((this.#canvas.clientHeight - window_h) / 2);
            result.x = Math.round(pos.x * window_size.width / this.#canvas.clientWidth);
            result.y = Math.round(window_y * window_size.height / window_h);
        }else{
            const window_w = this.#canvas.clientHeight * window_size.width / window_size.height;
            const window_x = pos.x - ((this.#canvas.clientWidth - window_w) / 2);
            result.x = Math.round(window_x * window_size.width / window_w);
            result.y = Math.round(pos.y * window_size.height / this.#canvas.clientHeight);
        }
        result.x = Math.max(0, Math.min(window_size.width, result.x));
        result.y = Math.max(0, Math.min(window_size.height, result.y));
        return result;
    }

    static setup(): void {
        const init_screen = () => {
            this.#canvas.requestFullscreen().catch(() => {});
            this.#canvas.removeEventListener("click", init_screen);
        }
        this.#canvas.addEventListener("click", init_screen);
        this.#canvas.addEventListener("contextmenu", this.#handle_right_click.bind(this));
        this.#canvas.addEventListener("dblclick", this.#handle_double_click.bind(this));
        this.#canvas.addEventListener("mousedown", this.#handle_mouse_down.bind(this));
        this.#canvas.addEventListener("mouseup", this.#handle_mouse_up.bind(this));
        this.#canvas.addEventListener("mousemove", this.#handle_mouse_move.bind(this));
        this.#canvas.addEventListener("wheel", this.#handle_wheel.bind(this));
        this.#canvas.addEventListener("animationend", () => {
            // Reset fade
            Window.#canvas.className = "";
        })
    }

    static #handle_right_click(event: MouseEvent): void{
        event.preventDefault();
        // Only care about right click
        if(event.button == 2){
            // TODO:
            console.log(this.#map_cursor_position(new Point(event.clientX, event.clientY)));
        }
    }
    static #handle_double_click(event: MouseEvent): void{
        event.preventDefault();
        // Only care about left click
        if(event.button == 0){
            // TODO:
            console.log(this.#map_cursor_position(new Point(event.clientX, event.clientY)));
        }
    }
    static #handle_mouse_down(event: MouseEvent): void{
        event.preventDefault();
        // Only care about left click
        if(event.button == 0){
            // TODO:
        }
    }
    static #handle_mouse_up(event: MouseEvent): void{
        event.preventDefault();
        // Only care about left click
        if(event.button == 0){
            // TODO:
        }
    }
    static #handle_mouse_move(event: MouseEvent): void{
        event.preventDefault();
        // Only care about left click
        if(event.button == 0){
            // TODO:
        }
    }
    static #handle_wheel(event: WheelEvent): void{
        event.preventDefault();
        // TODO:
        //console.log(event.deltaY);
    }

    // WebGL
    static #gl?: WebGLRenderingContext = Window.#canvas.getContext("webgl");

    fade_out(): void{
        Window.#canvas.className = "fadeOut";
    }
}

export default Window;