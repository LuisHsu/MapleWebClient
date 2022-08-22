/**
 *  @category Graphics
 *  @module Texture
 */

import Setting from "../Setting";
import { Point, Size } from "../Types";

export class Texture {
    offset: Point;
    constructor(url: string, option: {size?: Size, offset?: Point} = {}){
        this.offset = (option.offset) ? option.offset : new Point(0, 0);
        let image = new Image();
        image.onload = () => {
            if(option.size){
                createImageBitmap(image, {
                    resizeHeight: option.size.height,
                    resizeWidth: option.size.width,
                    resizeQuality: "medium",
                }).then(bitmap => {
                    this.bitmap = bitmap;
                });
            }else{
                createImageBitmap(image).then(bitmap => {
                    this.bitmap = bitmap;
                });
            }
        }
        image.src = Setting.DataPath + url;
    }
    size(): Size{
        return new Size(this.bitmap.width, this.bitmap.height);
    }
    bitmap: ImageBitmap = null;
}