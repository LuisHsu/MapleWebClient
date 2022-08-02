import { Sound } from "./Audio";
import * as Window from "./io/Window"

// Main function
document.body.onload = () => {
    try{
        alert("點擊任何地方進入全螢幕模式");
        Window.init();
        let testSound = new Sound();
        testSound.play("GameIn");
    }catch(err){
        console.error(`[ERROR] ${err.name}: ${err.message}`);
    }
}