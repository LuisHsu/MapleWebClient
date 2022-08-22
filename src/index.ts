import Canvas from "./graphics/Canvas";
import UI from "./ui/UI";
import Window from "./io/Window";

function main(){
    try{
        if(document.getElementById("play-button")){
            document.getElementById("play-button").remove();
        }
        Window.init();
        UI.init();
        Canvas.init(() => {
            UI.draw();
        });
        Canvas.start();
    }catch(err){
        console.error(`[ERROR] ${err.name}: ${err.message}`);
    }
}
document.getElementById("play-button").addEventListener("click", main);