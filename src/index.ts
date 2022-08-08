import GL, { Transform } from "./graphics/GL";
import Window, { window_size } from "./io/Window";
import {Point, Size} from "./Types";

import Texture from "./graphics/Texture";
import Animation, { Frame } from "./graphics/Animation";

let testtex = new Texture("Gamania.0.png",
    new Point(window_size.width / 2, window_size.height / 2),
    new Size(window_size.width, window_size.height)
);
let testanim = new Animation([
    new Frame(testtex, 500, new Transform({rotate: 180, opacity: 0.5})),
    new Frame(testtex, 500, new Transform({rotate: 90, scale: new Size(1.5, 1.5)})),
    new Frame(testtex, 500, new Transform({offset: new Point(100, 100)})),
], true);

function draw(){
    GL.draw_texture(testtex, new Transform({opacity: 1}));
}

function main(){
    try{
        if(document.getElementById("play-button")){
            document.getElementById("play-button").remove();
        }
        Window.init();
        GL.init();
        testanim.start();
        GL.start(draw);
    }catch(err){
        console.error(`[ERROR] ${err.name}: ${err.message}`);
    }
}
document.getElementById("play-button").addEventListener("click", main);