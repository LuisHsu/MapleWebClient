/**
 * @category Character
 * @module Body
 */

import { Fetch } from "../Fetch";
import { Stance } from "./Look";
import Setting from "../Setting";
import { Texture } from "../graphics/Texture";

export class Body {

    stances: {[id in Stance.Id]?: Stance[]}

    constructor(skin_id: number){
        Promise.all([
            Fetch.Json(`${Setting.DataPath}Character/body/${skin_id}.json`)]
        ).then(([body_json]) => {
            let body_frames = Body.map_stances(body_json, skin_id);
            console.log(body_frames); // FIXME:
        })
    }

    private static map_stances(json: Object, skin_id: number){
        // Retrieve immediate stance
        let stances = Object.entries(json)
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
                                result.delay = frame["delay"];
                                delete frame["delay"];
                            }
                            if(frame.hasOwnProperty("face")){
                                result.has_face = frame["face"];
                                delete frame["face"];
                            }
                            result.layers = Object.entries(frame).reduce((prev: any, [layer, part]) => {
                                if(typeof(part) == "string"){
                                    prev[layer as Body.Layer] = part;
                                }else{
                                    prev[layer as Body.Layer] = new Texture(
                                        `Character/body/${skin_id}/${stance}.${frame_key}.${layer}.png`
                                    );
                                    // TODO: origin
                                    // TODO: map
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

        // Resolve reference & action
        Object.values(stances).forEach((frames: any) => {
            Object.values(frames).forEach((frame: any) => {
                if(frame.type == "action"){
                    // Action TODO:
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
            });
        });
        return stances;
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