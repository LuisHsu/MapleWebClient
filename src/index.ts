import GL from "./graphics/GL";
import { Texture } from "./graphics/Texture";
import { Cursor } from "./io/Cursor";
import Window from "./io/Window";
import { Point, Size } from "./Types";

//const cursor = new Texture("data/UI/Cursor/Cursor.0.0.png", new Point(12, -25), new Size(24, 28));
const cursor = new Cursor;


function draw(){
    cursor.draw();
}

function main(){
    try{
        if(document.getElementById("play-button")){
            document.getElementById("play-button").remove();
        }
        Window.init();
        GL.init();
        cursor.init();
        GL.start(draw);
    }catch(err){
        console.error(`[ERROR] ${err.name}: ${err.message}`);
    }
}
document.getElementById("play-button").addEventListener("click", main);