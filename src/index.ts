import GL, { Transform } from "./graphics/GL";
import Window from "./io/Window";
import {Point, Size} from "./Types";

import Texture from "./graphics/Texture";
import Animation, { Frame } from "./graphics/Animation";

let testtex = new Texture("Gamania.0.png", new Point(512, 384), new Size(768, 768));
let testanim = new Animation([
    new Frame(testtex, 500, new Transform({rotate: 180, opacity: 0.5})),
    new Frame(testtex, 500, new Transform({scale: new Size(1.5, 1.5)})),
    new Frame(testtex, 500, new Transform({offset: new Point(100, 100)})),
], true);

function draw(){
    GL.draw_texture(testtex, new Transform({opacity: 1}));
    testanim.draw();
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