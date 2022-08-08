import GL from "./graphics/GL";
import Window from "./io/Window";
import {Point, Size} from "./Types";

import Texture from "./graphics/Texture";

const test_texture1 = new Texture("Gamania.0.png", new Point(512, 0), new Size(1024, 768));

let deg = 0;

function draw(){
    GL.draw_texture(test_texture1, deg);
    GL.draw_texture(test_texture1, 0.0);
}

function main(){
    try{
        if(document.getElementById("play-button")){
            document.getElementById("play-button").remove();
        }
        Window.init();
        GL.init();
        GL.start(draw);
    }catch(err){
        console.error(`[ERROR] ${err.name}: ${err.message}`);
    }
}
document.getElementById("play-button").addEventListener("click", main);