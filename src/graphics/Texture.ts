import {create_texture} from "./GL";

class Texture {
    origin: [number, number] = [0, 0];
    texture: WebGLTexture = null;
    constructor(url: string, origin: [number, number]){
        this.origin = origin;
        let image = new Image();
        image.onload = () => {
            this.texture = create_texture(image);
        }
        image.src = url;
    }
}

export default Texture;