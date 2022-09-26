import Canvas from "./graphics/Canvas";
import UI from "./ui/UI";
import Window from "./io/Window";
import { Color } from "./Types";

const DEV = true;

function main(){
    try{
        if(document.getElementById("play-button")){
            document.getElementById("play-button").remove();
        }
        Window.init();
        UI.init();
        Canvas.init(() => {
            UI.draw();
            if(DEV){
                Canvas.draw_axis(new Color(255, 0, 0));
            }
        });
        Canvas.start();
    }catch(err){
        console.error(`[ERROR] ${err.name}: ${err.message}`);
    }
}
document.getElementById("play-button").addEventListener("click", main);