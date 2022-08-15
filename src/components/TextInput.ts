import Window from "../io/Window";
import { MouseHandler, Point, Rect, Size } from "../Types";

const display = document.getElementById("display") as HTMLCanvasElement;

export class TextInput {
    active: boolean = true;
    element: HTMLInputElement;
    position: Point;
    size: Size;

    constructor(position: Point, size: Size, option?: {
        color?: string,
        type?: string,
        value?: string,
    }) {
        this.position = position;
        this.size = size;
        this.element = document.createElement("input");
        this.element.className = "input";
        this.element.style.width = `${size.width / Window.size.width * 100}%`;
        this.element.style.height = `${size.height / Window.size.height * 100}%`;
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
        this.update_position();
    }

    update_position(base_pos?: Point): void {
        let position = this.position;
        if(base_pos){
            position = base_pos.concat(position);
        }
        this.element.style.bottom = `${(position.y + this.size.height / 2) / Window.size.height * 100}%`;
        this.element.style.left = `${(position.x - this.size.width / 2) / Window.size.width * 100}%`;
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
    
    private set_focus(event: MouseEvent): void{
        if(this.active){
            event.stopPropagation();
            event.preventDefault();
            this.element.focus();
        }
    }
}