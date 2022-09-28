/**
 * @category Character
 * @module Hair
 */

import { Fetch } from "../Fetch";
import { Stance } from "./Look";
import Setting from "../Setting";
import { Texture } from "../graphics/Texture";
import { Point, Size } from "../Types";
import Animation, { Frame } from "../graphics/Animation";

export class Hair {

    stances: {[id in Stance.Id]?: Hair.Stance[]} = {};

    constructor(hair_id: number, callback: () => void){
        Fetch.Json(`${Setting.DataPath}Character/hair/${hair_id}.json`)
        .then(hair_json => {
            // Retrieve immediate stance
            let defaults = {
                default: hair_json.default,
                backDefault: hair_json.backDefault,
            };
            
            resolve_defaults(defaults, hair_id);
            
            return [defaults, Object.entries(hair_json)
                .filter(([stance, _]) => Object.values(Stance.Id).includes(stance as Stance.Id))
                .reduce((stances: any, [stance, frames]: [string, any]) => {
                    stances[stance as Stance.Id] = Object.entries(frames).reduce(
                        ((entry: any, [frame_key, frame]: [string, any]) => {
                            // Frame
                            entry[frame_key] = Object.entries(frame).reduce((prev: any, [layer, part]: [string, any]) => {
                                if(typeof(part) == "string"){
                                    prev[layer as Hair.Layer] = part;
                                }else{
                                    prev[layer as Hair.Layer] = generate_texture(
                                        `Character/hair/${hair_id}/${stance}.${frame_key}.${layer}.png`,
                                        part
                                    );
                                }
                                return prev;
                            }, {});
                            return entry;
                        }), {}
                    );
                    return stances;
                }, {})]
        }).then(([defaults, stances]) => {
            // Resolve reference & action
            Object.values(stances).forEach((frames: any) => {
                Object.values(frames).forEach((frame: any) => {
                    Object.entries(frame).forEach(([name, layer]) => {
                        if(typeof(layer) == "string"){
                            if(layer.startsWith("../../")){
                                let dest = layer.substring(6).split("/");
                                switch(dest[0]){
                                    case "default":
                                    case "backDefault":
                                        frame[name] = defaults[dest[0]][dest[1]];
                                    break;
                                    default:
                                        frame[name] = stances[dest[0]][dest[1]][dest[2]];
                                    break;
                                }
                            }else if(layer.startsWith("../")){
                                let [index, part] = layer.substring(3).split("/");
                                frame[name] = frames[index][part]
                            }
                        }
                    })
                });
            });
            // Make animation of hairShade
            Object.entries(stances).forEach(([stance, frames]) => {
                Object.values(frames).forEach((frame: any) => {
                    if(frame.hairShade){
                        frame.hairShade = new Animation(
                            Object.values(frame.hairShade).map((shade: Texture) => new Frame([shade], 0.1))
                        , true);
                    }
                })
            })
            // Map to Stance
            Object.entries(stances).forEach(([stance, frames]) => {
                this.stances[stance as Stance.Id] = Object.values(frames);
            })
            return this.stances;
        })
        .then(console.log)
        .then(callback);
    }
}

export namespace Hair {
    export enum Layer {
        default = "hair",
        belowbody = "hairBelowBody",
        overhead = "hairOverHead",
        shade = "hairShade",
        back = "backHair",
        belowcap = "backHairBelowCap",
        belowcapnarrow = "backHairBelowCapNarrow",
        belowcapwide = "backHairBelowCapWide",
    }
    export type Stance = {[layer in Hair.Layer]?: Texture};
}

function resolve_defaults(defaults: any, hair_id: number){
    // Create texture
    Object.entries(defaults).forEach(([key, layer]: [any, any]) => {
        Object.entries(layer).forEach(([name, part]: [any, any]) => {
            if(name == "hairShade"){
                Object.entries(part).forEach(([index, shade]: [any, any]) => {
                    if(typeof(shade) != "string"){
                        part[index] = generate_texture(
                            `Character/hair/${hair_id}/${key}.${shade.layer}.${index}.png`,
                            shade
                        )
                    }
                })
            }else{
                layer[name] = generate_texture(
                    `Character/hair/${hair_id}/${key}.${part.layer}.png`,
                    part
                );
            }
        })
        
    })
    // Resolve reference
    Object.values(defaults).forEach(layer => {
        Object.values(layer).forEach(part => {
            Object.entries(part).forEach(([index, shade]: [any, any]) => {
                if((typeof(shade) == "string") && /^\d+$/.test(shade)){
                    part[index] = part[shade.split("/")[0]];
                }
            })
        })
    })
}

function generate_texture(url: string, part: any){
    let option = {
        size: new Size(part.width, part.height),
        offset: new Point(
            (part.origin.x - (part.width / 2)),
            (part.origin.y - (part.height / 2))
        )
    };
    if(part.map && part.map.brow){
        option.offset.concat(new Point(-part.map.brow.x, -part.map.brow.y));
    }
    return new Texture(url, option);
}