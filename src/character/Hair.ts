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
import { Body } from "./Body";

export class Hair {

    stances: {[id in Stance.Id]?: {[index in number]: Hair.Stance}} = {};

    static create(hair_id: number, body: Body){
        return Fetch.Json(`${Setting.DataPath}Character/hair/${hair_id}.json`)
        .then(hair_json => {
            return Object.entries(body.stances).reduce((stances: any, [stance, frames]: [string, any]) => {
                stances[stance as Stance.Id] = Object.keys(frames).reduce(
                    ((entry: any, frame_key: string) => {
                        if(hair_json[stance] && hair_json[stance][frame_key]){
                            entry[frame_key] = Object.entries(hair_json[stance][frame_key]).reduce((hair: any, [layer, part]: [string, any]) => {
                                if(typeof(part) == "string"){
                                    if(part.startsWith("../../")){
                                        let dest = part.substring(6).split("/");
                                        switch(dest[0]){
                                            case "default":
                                            case "backDefault":
                                                hair[layer] = hair_json[dest[0]][dest[1]];
                                                hair[layer].key = `${dest[0]}`;
                                            break;
                                            default:
                                                hair[layer] = hair_json[dest[0]][dest[1]][dest[2]];
                                                hair[layer].key = `${dest[0]}.${dest[1]}`;
                                            break;
                                        }
                                    }else if(part.startsWith("../")){
                                        let [index, ref] = part.substring(3).split("/");
                                        hair[layer] = hair_json[stance][index][ref]
                                    }
                                }
                                if(layer == Hair.Layer.shade){
                                    Object.entries(hair[layer]).forEach(
                                        (([shade_key, shade_frame]: [string, any]) => {
                                            if(typeof(shade_frame) == "string"){
                                                hair[layer][shade_key] = hair[layer][shade_frame];
                                            }
                                        })
                                    )
                                }
                                return hair;
                            }, {});
                        }else{
                            entry[frame_key] = {...hair_json["default"]};
                        }
                        entry[frame_key].positions = frames[frame_key].positions;
                        return entry;
                    }), {});
                return stances;
            }, {});
        }).then(stances => {
            // Wrap hair
            let hair = new Hair;
            // Make textures & animations
            hair.stances = Object.entries(stances).reduce(
                (stances_wrap: any, [stance, frames]: [string, any]) => {
                    stances_wrap[stance] = Object.entries(frames).reduce(
                        (frames_wrap: any, [frame_key, frame]: [string, any]) => {
                            const {positions} = frame;
                            delete frame.positions;
                            frames_wrap[frame_key] = Object.entries(frame).reduce((layer_wrap: any, [layer, part]: [string, any]) => {
                                if(layer == "hairShade"){
                                    // TODO: Make animation of hairShade
                                }else{
                                    layer_wrap[layer] = generate_texture(
                                        `Character/hair/${hair_id}/${part.key}.${part.layer}.png`,
                                        part, positions.face
                                    );
                                }
                                return layer_wrap;
                            }, {});
                            return frames_wrap;
                    }, {});
                    return stances_wrap;
            },{});
            return hair;
        });
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

function generate_texture(url: string, part: any, position: Point){
    let option = {
        size: new Size(part.width, part.height),
        origin: new Point(
            -part.origin.x,
            part.origin.y
        ).concat(position)
    };
    if(part.map && part.map.brow){
        option.origin.concat(new Point(-part.map.brow.x, part.map.brow.y));
    }
    return new Texture(url, option);
}