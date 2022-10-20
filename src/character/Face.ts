/**
 * @category Character
 * @module Face
 */

import { Fetch } from "../Fetch";
import { Expression } from "./Look";
import Setting from "../Setting";
import { Texture } from "../graphics/Texture";
import { Point, Size } from "../Types";
import { Body } from "./Body";
import Animation, { Frame } from "../graphics/Animation";

export class Face {

    expressions: {[id in Expression]?: Animation} = {};

    static create(face_id: number, body: Body){
        return Fetch.Json(`${Setting.DataPath}Character/face/${face_id}.json`)
        .then(face_json => {
            return Object.entries(face_json).reduce((exprs: any, [expr, frames]: [string, any]) => {
                if(expr == "default"){
                    let delay = 0;
                    if(frames.delay){
                        delay = frames.delay;
                        delete frames.delay;
                    }
                    exprs[expr as Expression] = [{
                        ...frames.face,
                        delay,
                        img: "default",
                    }];
                }else{
                    let delay = 0;
                    if(frames.delay){
                        delay = frames.delay;
                        delete frames.delay;
                    }
                    exprs[expr as Expression] = Object.entries(frames).map(([frame_key, frame]: [string, any]) => {
                        let {delay: local_delay, face} = frame;
                        if(local_delay !== undefined){
                            delay = local_delay;
                        }
                        if(typeof(face) == "string"){
                            // Resolve reference
                            if(face.startsWith("../../")){
                                let dest = face.substring(6).split("/");
                                face = face_json[dest[0]].face;
                                face.img = dest[0];
                            }else if(face.startsWith("../")){
                                let dest = face.substring(3).split("/");
                                face = frames[dest[0]].face;
                                face.img = `${expr}.${dest[0]}`;
                            }
                        }else{
                            face.img = `${expr}.${frame_key}`;
                        }
                        face.delay = delay;
                        return face;
                    })
                }
                return exprs;
            }, {});
        }).then(exprs => {
            // Wrap hair
            let face = new Face;
            // Make textures & animations
            face.expressions = Object.entries(exprs).reduce(
                (exprs_wrap: any, [expr, frames]: [string, any]) => {
                    exprs_wrap[expr] = new Animation(frames.map((frame: any) => 
                        new Frame([generate_texture(
                            `Character/face/${face_id}/${frame.img}.face.png`, frame
                        )], frame.delay)
                    ));
                    return exprs_wrap;
                },
            {});
            return face;
        });
    }
}

function generate_texture(url: string, part: any){
    let option = {
        size: new Size(part.width, part.height),
        origin: new Point(
            -part.origin.x,
            part.origin.y
        )
    };
    if(part.map && part.map.brow){
        option.origin = option.origin.concat(new Point(-part.map.brow.x, part.map.brow.y));
    }
    return new Texture(url, option);
}