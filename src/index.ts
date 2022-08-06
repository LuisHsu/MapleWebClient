import GL from "./graphics/GL";
import Window from "./io/Window";

import Texture from "./graphics/Texture";

const test_texture = new Texture("Gamania.0.png", [0, 0]);

function draw(){
    GL.draw_texture(test_texture);
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