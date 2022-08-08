import GL, { Transform } from "./graphics/GL";
import Window from "./io/Window";
import {Point, Size} from "./Types";

import {Texture} from "./graphics/Texture";
import Animation, { Frame } from "./graphics/Animation";

let testtex = new Texture("Gamania.0.png",
    new Point(Window.size.width / 2, Window.size.height / 2),
    new Size(Window.size.width, Window.size.height)
);
let testanim = new Animation([
    new Frame(testtex, 4,
        new Transform({opacity: 1, rotate: 180}),
        new Transform({opacity: 0, scale: new Size(2, 2)})
    ),
], false);

function draw(){
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