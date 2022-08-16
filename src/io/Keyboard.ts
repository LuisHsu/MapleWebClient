export enum KeyType {
    Alt,
    Caps,
    Ctrl,
    Meta,
    ScrollLock,
    Shift,
    Enter,
    Tab,
    Space,
    Down,
    Left,
    Right,
    Up,
    End,
    Home,
    PageDown,
    PageUp,
    Backspace,
    Delete,
    Escape,
    F1,
    F2,
    F3,
    F4,
    F5,
    F6,
    F7,
    F8,
    F9,
    F10,
    F11,
    F12,
    Num0,
    Num1,
    Num2,
    Num3,
    Num4,
    Num5,
    Num6,
    Num7,
    Num8,
    Num9,
    Grave,
    Slash,
    Decimal,
    BracketL,
    BracketR,
    SemiColon,
    Quote,
    Comma,
    Dash,
    Equal,
    BackSlash,
}

export const KeyMap: {[key in string]: KeyType} = {
    "Alt": KeyType.Alt,
    "CapsLock": KeyType.Caps,
    "Control": KeyType.Ctrl,
    "Meta": KeyType.Meta,
    "ScrollLock": KeyType.ScrollLock,
    "Shift": KeyType.Shift,
    "Enter": KeyType.Enter,
    "Tab": KeyType.Tab,
    " ": KeyType.Space,
    "ArrowDown": KeyType.Down,
    "ArrowLeft": KeyType.Left,
    "ArrowRight": KeyType.Right,
    "ArrowUp": KeyType.Up,
    "End": KeyType.End,
    "Home": KeyType.Home,
    "PageDown": KeyType.PageDown,
    "PageUp": KeyType.PageUp,
    "Backspace": KeyType.Backspace,
    "Delete": KeyType.Delete,
    "Escape": KeyType.Escape,
    "F1": KeyType.F1,
    "F2": KeyType.F2,
    "F3": KeyType.F3,
    "F4": KeyType.F4,
    "F5": KeyType.F5,
    "F6": KeyType.F6,
    "F7": KeyType.F7,
    "F8": KeyType.F8,
    "F9": KeyType.F9,
    "F10": KeyType.F10,
    "F11": KeyType.F11,
    "F12": KeyType.F12,
    "0": KeyType.Num0,
    "1": KeyType.Num1,
    "2": KeyType.Num2,
    "3": KeyType.Num3,
    "4": KeyType.Num4,
    "5": KeyType.Num5,
    "6": KeyType.Num6,
    "7": KeyType.Num7,
    "8": KeyType.Num8,
    "9": KeyType.Num9,
    "`": KeyType.Grave,
    "/": KeyType.Slash,
    ".": KeyType.Decimal,
    "[": KeyType.BracketL,
    "]": KeyType.BracketR,
    ";": KeyType.SemiColon,
    "'": KeyType.Quote,
    ",": KeyType.Comma,
    "-": KeyType.Dash,
    "=": KeyType.Equal,
    "\\": KeyType.BackSlash,
}

export const SkipDefaultKeys: KeyType[] = [
    KeyType.Tab,
];

export class TabFocus {
    handlers: TabHandler[];
    index: number = null;

    constructor(handlers: TabHandler[] = []){
        this.handlers = handlers;
    }

    update(key: KeyType){
        if(this.handlers.length > 0){
            if(key == KeyType.Tab){
                if(this.index === null){
                    this.index = 0;
                }else{
                    if(this.handlers[this.index].blur){
                        this.handlers[this.index].blur();
                    }
                    this.index += 1;
                    if(this.index == this.handlers.length){
                        this.index = null;
                        return;
                    }
                }
                if(this.handlers[this.index].focus){
                    this.handlers[this.index].focus();
                }
            }else if(key == KeyType.Enter && this.index !== null){
                if(this.handlers[this.index].focus_enter){
                    this.handlers[this.index].focus_enter();
                }
            }
        }
    }
}

export interface KeyboardHandler {
    key_down?(key: KeyType): void;
    key_up?(key: KeyType): void;
}

export interface TabHandler {
    focus?(): void;
    blur?(): void;
    focus_enter?(): void;
}