import Window from "./io/Window";
import Audio from "./audio/Audio";

function main(){
    try{
        try{document.getElementById("play-button").remove();}catch{};
        Window.init();
        Audio.Sound.play("LevelUp");
    }catch(err){
        console.error(`[ERROR] ${err.name}: ${err.message}`);
    }
}
document.getElementById("play-button").addEventListener("click", main);