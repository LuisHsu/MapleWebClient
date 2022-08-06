
enum CursorState {
    Idle = 0,
    CanClick,
    Game,
    House,
    CanGrab,
    Gift,
    VScroll,
    HScroll,
    VScrollIdle,
    HScrollIdle,
    Grabbing,
    Clicking,
    RClick,
}

const CursorImage = [
    [
        "Cursor/Cursor.0.0.png"
    ],
    [
        "Cursor/Cursor.1.0.png",
        "Cursor/Cursor.1.1.png",
    ],
    [
        "Cursor/Cursor.1.0.png",
        "Cursor/Cursor.1.1.png",
    ],
    [
        "Cursor/Cursor.2.0.png",
        "Cursor/Cursor.2.1.png",
        "Cursor/Cursor.2.2.png",
        "Cursor/Cursor.2.3.png",
        "Cursor/Cursor.2.4.png",
        "Cursor/Cursor.2.5.png",
        "Cursor/Cursor.2.6.png",
    ],
    [
        "Cursor/Cursor.3.0.png",
        "Cursor/Cursor.3.1.png",
        "Cursor/Cursor.3.2.png",
        "Cursor/Cursor.3.3.png",
        "Cursor/Cursor.3.4.png",
        "Cursor/Cursor.3.5.png",
    ],
    [
        "Cursor/Cursor.4.0.png",
        "Cursor/Cursor.4.1.png",
    ],
    [
        "Cursor/Cursor.5.0.png",
        "Cursor/Cursor.5.1.png",
        "Cursor/Cursor.5.2.png",
    ],
    [
        "Cursor/Cursor.6.0.png",
        "Cursor/Cursor.6.1.png",
        "Cursor/Cursor.6.2.png",
        "Cursor/Cursor.6.3.png",
        "Cursor/Cursor.6.4.png",
        "Cursor/Cursor.6.5.png",
        "Cursor/Cursor.6.6.png",
    ],
    [
        "Cursor/Cursor.7.0.png",
        "Cursor/Cursor.7.1.png",
        "Cursor/Cursor.7.2.png",
        "Cursor/Cursor.7.4.png",
    ],
    [
        "Cursor/Cursor.8.0.png",
        "Cursor/Cursor.8.1.png",
        "Cursor/Cursor.8.2.png",
        "Cursor/Cursor.8.4.png",
    ],
    ["Cursor/Cursor.9.0.png"],
    ["Cursor/Cursor.10.0.png"],
    ["Cursor/Cursor.11.0.png"],
    ["Cursor/Cursor.12.0.png"],
    [
        "Cursor/Cursor.13.0.png",
        "Cursor/Cursor.13.1.png",
    ],
]

class Cursor {
    position: [number, number] = [0, 0];
    state: CursorState;
};
