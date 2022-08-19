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
    private static handlers: TabHandler[] = [];
    private static index: number = null;
    private elements: TabHandler[];

    constructor(elements: TabHandler[] = []){
        TabFocus.handlers.push(...elements);
        this.elements = elements;
    }

    activate(){
        this.elements.forEach(elem => {
            elem.tab_active = true;
        });
    }

    deactivate(){
        this.elements.forEach(elem => {
            elem.tab_active = false;
        });
    }

    add(handler: TabHandler){
        TabFocus.handlers.push(handler);
        this.elements.push(handler);
    }

    remove(){
        // Find next element
        let next_elem: TabHandler = null;
        if(TabFocus.index !== null){
            for(let index = TabFocus.index; index < TabFocus.handlers.length; ++index){
                if(TabFocus.handlers[TabFocus.index].tab_active && !this.elements.includes(TabFocus.handlers[TabFocus.index])){
                    next_elem = TabFocus.handlers[TabFocus.index];
                    break;
                }
            }
        }
        // Remove elements
        TabFocus.handlers = TabFocus.handlers.filter(handler => {
            return !this.elements.includes(handler);
        });
        if(next_elem !== null){
            TabFocus.handlers.every((handler, index) => {
                if(Object.is(handler, next_elem)){
                    TabFocus.index = index;
                    return false;
                }
                return true;
            })
        }else{
            TabFocus.index = null;
        }
    }

    static update(key: KeyType): void {
        if(TabFocus.handlers.length == 0){
            return;
        }
        if(key == KeyType.Tab){
            if(TabFocus.index === null){
                TabFocus.handlers.every((handler, index) => {
                    if(handler.tab_active === true){
                        TabFocus.index = index;
                        return false;
                    }
                    return true;
                });
            }else{
                if(TabFocus.handlers[TabFocus.index].blur){
                    TabFocus.handlers[TabFocus.index].blur();
                }
                for(TabFocus.index += 1; TabFocus.index < TabFocus.handlers.length; ++TabFocus.index){
                    if(TabFocus.handlers[TabFocus.index].tab_active){
                        break;
                    }
                }
                if(TabFocus.index >= TabFocus.handlers.length){
                    TabFocus.index = null;
                    return;
                }
            }
            if(TabFocus.index !== null && TabFocus.handlers[TabFocus.index].focus){
                TabFocus.handlers[TabFocus.index].focus();
            }
        }else if(key == KeyType.Enter && TabFocus.index !== null){
            if(TabFocus.handlers[TabFocus.index].focus_enter){
                TabFocus.handlers[TabFocus.index].focus_enter();
            }
        }
    }
}

export interface KeyboardHandler {
    key_down?(key: KeyType): void;
    key_up?(key: KeyType): void;
}

export interface TabHandler {
    tab_active: boolean;
    focus?(): void;
    blur?(): void;
    focus_enter?(): void;
}