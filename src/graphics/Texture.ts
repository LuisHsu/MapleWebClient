/**
 *  @category Graphics
 *  @module Texture
 */

import Setting from "../Setting";
import { Point, Size } from "../Types";
import {create_texture} from "./GL";

export class Texture {
    offset: Point;
    size: Size;
    texture: WebGLTexture = null;
    constructor(url: string, offset?: Point, size?: Size){
        this.offset = offset ? offset : new Point(0, 0);
        let image = new Image();
        image.onload = () => {
            this.texture = create_texture(image);
            this.size = size ? size : new Size(image.width, image.height);
        }
        image.src = Setting.DataPath + url;
    }
}