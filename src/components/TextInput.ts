import { Drawable, Transform } from "../graphics/Canvas";
import { TabHandler } from "../io/Keyboard";
import Window from "../io/Window";
import { Point, Size } from "../Types";

const display = document.getElementById("display") as HTMLCanvasElement;

export class TextInput implements TabHandler, Drawable {
    tab_active: boolean = true;
    active: boolean = true;
    element: HTMLInputElement;
    position: Point;
    size: Size;

    constructor(position: Point, size: Size, option?: {
        color?: string,
        type?: string,
        value?: string,
        focus_enter?: () => void;
    }){
        this.position = position;
        this.size = size;
        this.focus_enter = option.focus_enter;
        this.element = document.createElement("input");
        this.element.className = "input";
        if(option){
            this.element.type = option.type ? option.type : "text";
            if(option.color){
                this.element.style.color = option.color;
            }
            if(option.value){
                this.element.value = option.value;
            }
        }else{
            this.element.type = "text";
        }
        this.element.addEventListener("click", this.set_focus.bind(this));
        display.appendChild(this.element);
    }

    focus(): void {
        this.element.focus();
    }

    blur(): void {
        this.element.blur();
    }

    focus_enter?(): void;

    draw(transform: Transform = new Transform): void {
        if(this.active){
            let position = this.position.concat(transform.translate);
            let size = this.size.concat(transform.scale);
            this.element.style.display = "inline";
            this.element.style.opacity = `${transform.opacity}`;
            this.element.style.width = `${size.width / Window.size.width * 100}%`;
            this.element.style.height = `${size.height / Window.size.height * 100}%`;
            this.element.style.bottom = `${(position.y + size.height / 2) / Window.size.height * 100}%`;
            this.element.style.left = `${(position.x - size.width / 2) / Window.size.width * 100}%`;
        }else{
            this.element.style.display = "none";
        }
    }

    set_active(active: boolean): void{
        this.active = active;
        this.element.disabled = !active;
    }

    value(): string{
        return this.element.value;
    }

    handle_click(): void {
        this.element.blur();
    }

    clean(): void {
        display.removeChild(this.element);
    }
    
    private set_focus(event: MouseEvent): void{
        if(this.active){
            event.stopPropagation();
            event.preventDefault();
            this.element.focus();
        }
    }
}