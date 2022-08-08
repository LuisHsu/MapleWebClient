/**
 * @category Character
 * @module Hair
 */

import { Fetch } from "../Fetch";
import { Stance } from "./Look";
import Setting from "../Setting";
import { Texture } from "../graphics/Texture";
import { Point, Size } from "../Types";

export class Body {

    stances: {[id in Stance.Id]?: Stance[]} = {};

    constructor(skin_id: number, callback: () => void){
        Fetch.Json(`${Setting.DataPath}Character/skin/${skin_id}.json`)
        .then(skin_json => {
            // Retrieve immediate stance
            return Object.entries(skin_json)
                .filter(([stance, _]) => Object.values(Stance.Id).includes(stance as Stance.Id))
                .reduce((stances: any, [stance, frames]: [string, any]) => {
                    stances[stance as Stance.Id] = Object.entries(frames).reduce(
                        ((entry: any, [frame_key, frame]: [string, any]) => {
                            if(frame.hasOwnProperty("action")){
                                // Action
                                entry[frame_key] = {
                                    ...frame,
                                    type: "action",
                                }
                            }else{
                                // Frame
                                let result = {
                                    delay: 0,
                                    layers: {},
                                    has_face: true,
                                    type: "frame",
                                };
                                if(frame.hasOwnProperty("delay")){
                                    result.delay = frame["delay"] / 1000;
                                    delete frame["delay"];
                                }
                                if(frame.hasOwnProperty("face")){
                                    result.has_face = (frame["face"] == 1);
                                    delete frame["face"];
                                }
                                result.layers = Object.entries(frame).reduce((prev: any, [layer, part]: [string, any]) => {
                                    if(typeof(part) == "string"){
                                        prev[layer as Body.Layer] = part;
                                    }else{
                                        prev[layer as Body.Layer] = generate_texture(
                                            layer as Body.Layer,
                                            skin_id, part, stance, frame_key, frame
                                        );
                                    }
                                    return prev;
                                }, {});
                                entry[frame_key] = result;
                            }
                            return entry;
                        }), {}
                    );
                    return stances;
                }, {})
        }).then(stances => {
            // Resolve reference & action
            Object.values(stances).forEach((frames: any) => {
                Object.values(frames).forEach((frame: any) => {
                    if(frame.type == "action"){
                        // Action
                        frame.layers = stances[frame.action][frame.frame].layers;
                        frame.has_face = stances[frame.action][frame.frame].has_face;
                        delete frame.action;
                        delete frame.frame;
                    }else{
                        // Frame
                        Object.entries(frame.layers).forEach(([name, layer]) => {
                            if(typeof(layer) == "string"){
                                if(layer.startsWith("../../")){
                                    let [stance, index, part] = layer.substring(6).split("/");
                                    frame.layers[name] = stances[stance][index].layers[part];
                                }else if(layer.startsWith("../")){
                                    let [index, part] = layer.substring(3).split("/");
                                    frame.layers[name] = frames[index].layers[part]
                                }
                            }
                        })
                    }
                    delete frame.type;
                });
            });
            // Map to Stance
            Object.entries(stances).forEach(([stance, frames]) => {
                this.stances[stance as Stance.Id] = Object.values(frames).map(elem => {
                    let new_stance = new Stance();
                    new_stance.delay = elem.delay;
                    new_stance.layers = elem.layers;
                    new_stance.has_face = elem.has_face;
                    return new_stance;
                })
            })
        })
        .then(callback);
    }
}

export namespace Body {
    export enum Layer {
        body = "body",
        arm = "arm",
        arm_below_head = "armBelowHead",
        arm_below_head_over_mail = "armBelowHeadOverMail",
        arm_over_hair = "armOverHair",
        arm_over_hair_below_weapon = "armOverHairBelowWeapon",
        hand_below_weapon = "handBelowWeapon",
        hand_over_hair = "handOverHair",
        hand_over_weapon = "handOverWeapon",
        ear = "ear",
        head = "head",
        high_lef_ear = "highLefEar",
        human_ear = "humanEar",
        lef_ear = "lefEar",
    }
}

function generate_texture(
    layer: Body.Layer,
    skin_id: number,
    part: any,
    stance: string,
    frame_key: string,
    frame: any
){
    let url: string;
    if([Body.Layer.head, Body.Layer.ear].includes(layer)){
        url = `Character/skin/${skin_id}/${part.side}.${layer}.png`;
    }else{
        url = `Character/skin/${skin_id}/${stance}.${frame_key}.${layer}.png`;
    }
    let option = {
        size: new Size(part.width, part.height),
        offset: new Point(
            (part.origin.x - (part.width / 2)),
            (part.origin.y - (part.height / 2))
        )
    };
    option.offset = option.offset.concat(new Point(512, 384)) // FIXME:
    switch(layer){
        case Body.Layer.head:
            if(part.map.neck &&
                (frame[Body.Layer.body].map && frame[Body.Layer.body].map.neck)
            ){
                option.offset.x += part.map.neck.x - frame[Body.Layer.body].map.neck.x;
                option.offset.y += part.map.neck.y - frame[Body.Layer.body].map.neck.y;
            }
        break;
        case Body.Layer.arm:
        case Body.Layer.arm_over_hair:
            if(part.map.navel && part.map.hand &&
                (frame[Body.Layer.body].map && frame[Body.Layer.body].map.navel)
            ){
                option.offset.x += part.map.navel.x - part.map.hand.x - frame[Body.Layer.body].map.navel.x;
                option.offset.y += part.map.navel.y - part.map.hand.x - frame[Body.Layer.body].map.navel.y;
            }
        break;
    }
    return new Texture(url, option);
}