/**
 *  @category Graphics
 *  @module Texture
 */

import Setting from "../Setting";
import { Point, Size } from "../Types";

export class Texture {
    constructor(url: string, option: {size?: Size, origin?: Point} = {}){
        let image = new Image();
        image.onload = () => {
            let create_image_promise;
            if(option.size){
                create_image_promise = createImageBitmap(image, {
                    resizeHeight: option.size.height,
                    resizeWidth: option.size.width,
                    resizeQuality: "medium",
                })
            }else{
                create_image_promise = createImageBitmap(image);
            }
            create_image_promise.then(bitmap => {
                this.bitmap = bitmap;
                if(option.origin){
                    this.origin = option.origin;
                }else{
                    this.origin = new Point(-this.bitmap.width / 2, this.bitmap.height / 2);
                }
            });
        }
        image.src = Setting.DataPath + url;
    }
    size(): Size{
        return new Size(this.bitmap.width, this.bitmap.height);
    }
    bitmap: ImageBitmap = null;
    origin: Point;
}