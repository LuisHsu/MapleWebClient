import { Sound } from "./Audio";
import * as Window from "./io/Window"

// Main function
document.body.onload = () => {
    try{
        Window.init();
    }catch(err){
        console.error(`[ERROR] ${err.name}: ${err.message}`);
    }
}