/**
 * @category Character
 * @module Body
 */

import { Fetch } from "../Fetch";
import { Stance } from "./Look";
import Setting from "../Setting";
import { Texture } from "../graphics/Texture";
import { Point, Size } from "../Types";

export class Body {

    stances: {[id in Stance.Id]?: {[index in number]: Body.Stance}} = {};

    static create(skin_id: number){
        return Fetch.Json(`${Setting.DataPath}Character/skin/${skin_id}.json`)
        .then(skin_json => {
            // Retrieve immediate stance
            return Object.entries(skin_json)
                .filter(([stance, _]) => Object.values(Stance.Id).includes(stance as Stance.Id))
                .reduce((stances: any, [stance, frames]: [string, any]) => {
                    stances[stance as Stance.Id] = frames;
                    return stances;
                }, {});
        }).then(stances => {
            // Resolve reference & action
            Object.values(stances).forEach((frames: any) => {
                Object.entries(frames).forEach(([frame_key, frame]: [string, any]) => {
                    if(frame.hasOwnProperty("action")){
                        // Action
                        let new_frame = {
                            ...stances[frame.action][frame.frame],
                            refer: {
                                stance: frame.action,
                                index: frame.frame,
                            },
                        }
                        if(frame.delay){
                            new_frame.delay += frame.delay;
                            if(new_frame.delay <= 0){
                                new_frame.delay = 100;
                            }
                        }
                        delete new_frame.action;
                        delete new_frame.frame;
                        frames[frame_key] = new_frame;
                    }else{
                        // Frame
                        Object.entries(frame).forEach(([name, layer]) => {
                            if(typeof(layer) == "string"){
                                if(layer.startsWith("../../")){
                                    let [stance, index, part] = layer.substring(6).split("/");
                                    frame[name] = stances[stance][index][part];
                                }else if(layer.startsWith("../")){
                                    let [index, part] = layer.substring(3).split("/");
                                    frame[name] = frames[index][part]
                                }
                            }
                        })
                    }
                });
            });
            return stances;
        })
        .then(stances => {
            let body = new Body;
            // Generate Stances
            Object.entries(stances).forEach(([stance, frames]: [string, any]) => {
                Object.entries(frames).forEach(([index, frame]: [string, any]) => {
                    if(!frame.hasOwnProperty("delay")){
                        frame.delay = 0;
                    }
                    if(frame.hasOwnProperty("face")){
                        frame.has_face = (frame["face"] == 1);
                        delete frame["face"];
                    }
                    frame.positions = retrieve_positions(frame);
                    let stance_name = stance;
                    if(frame.refer){
                        stance_name = frame.refer.stance;
                        index = frame.refer.index;
                        delete frame.refer;
                    }
                    frame.layers = Object.entries(frame)
                        .filter(([key, _]) => !["delay", "has_face", "positions"].includes(key))
                        .reduce((prev: any, [layer, part]: [string, any]) => {
                            prev[(part.layer? part.layer: layer)] = generate_texture(
                                layer,
                                skin_id, part, stance_name, index, frame.positions
                            );
                            return prev;
                        }, {});
                });
                body.stances[stance as Stance.Id] = frames;
            });
            return body;
        });
    }
}

export namespace Body {
    export enum Layer {
        body = "body",
        back_body = "backBody",
        arm = "arm",
        arm_below_head = "armBelowHead",
        arm_below_head_over_mail = "armBelowHeadOverMailChest",
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
    export class Stance {
        delay: number = 0;
        layers: {[layer in Body.Layer]?: Texture} = {};
        has_face: boolean = true;
        positions: {
            body?: Point,
            arm?: Point,
            armOverHair?: Point,
            hand?: Point,
            head?: Point,
            face?: Point,
        };
    };
}

function generate_texture(
    layer: string,
    skin_id: number,
    part: any,
    stance: string,
    frame_key: string,
    positions: any,
){
    let url: string;
    if([Body.Layer.head as string, Body.Layer.ear as string].includes(layer)){
        url = `Character/skin/${skin_id}/${part.side}.${layer}.png`;
    }else{
        url = `Character/skin/${skin_id}/${stance}.${frame_key}.${layer}.png`;
    }
    let option = {
        size: new Size(part.width, part.height),
        origin: new Point(
            -part.origin.x,
            part.origin.y
        )
    };
    const layer_name = (part.layer? part.layer: layer);
    if(positions.body){
        option.origin = option.origin.concat(positions.body);
    }
    switch(layer_name){
        case Body.Layer.head:
            if(positions.head){
                option.origin = option.origin.concat(positions.head);
            }
        break;
        case Body.Layer.arm:
        case Body.Layer.arm_below_head:
        case Body.Layer.arm_below_head_over_mail:
        case Body.Layer.arm_over_hair:
        case Body.Layer.arm_over_hair_below_weapon:
            if(positions[layer]){
                option.origin = option.origin.concat(positions[layer]);
            }
        break;
        case Body.Layer.hand_below_weapon:
        case Body.Layer.hand_over_hair:
            if(positions.body && part.map && part.map.navel){
                option.origin.x -= positions.body.x + part.map.navel.x;
                option.origin.y -= positions.body.y - part.map.navel.y;
            }
        break;
    }
    return new Texture(url, option);
}

function retrieve_positions(frame_json: any){
    let positions = {
        body: new Point,
        arm: new Point,
        armOverHair: new Point,
        hand: new Point,
        head: new Point,
        face: new Point,
    };
    const frame = {...frame_json};
    let body_layer = [
        Body.Layer.body,
        Body.Layer.back_body,
    ].find(layer => (frame.hasOwnProperty(layer) && frame[layer].map));
    if(body_layer && frame[body_layer].map){
        const body_map = frame[body_layer].map;
        // Body
        if(body_map.navel){
            positions.body = new Point(-body_map.navel.x, body_map.navel.y);
            // Arm
            if(frame.hasOwnProperty(Body.Layer.arm) && frame[Body.Layer.arm].map && frame[Body.Layer.arm].map.navel){
                const arm_map = frame[Body.Layer.arm].map;
                positions.arm = new Point(
                    -arm_map.navel.x + body_map.navel.x,
                    arm_map.navel.y - body_map.navel.y,
                );
            }
            // Arm over hair
            if(frame.hasOwnProperty(Body.Layer.arm_over_hair) && frame[Body.Layer.arm_over_hair].map && frame[Body.Layer.arm_over_hair].map.navel){
                const arm_map = frame[Body.Layer.arm_over_hair].map;
                positions.armOverHair = new Point(
                    -arm_map.navel.x + body_map.navel.x,
                    arm_map.navel.y - body_map.navel.y,
                );
            }
        }
        if(frame.hasOwnProperty(Body.Layer.head) && frame[Body.Layer.head].map){
            const head_map = frame[Body.Layer.head].map;
            if(head_map.neck && body_map.neck){
                // Head
                positions.head = new Point(
                    body_map.neck.x + head_map.neck.x,
                    -body_map.neck.y + head_map.neck.y
                );
                if(head_map.brow){
                    // Face
                    positions.face = positions.head.concat(new Point(
                        head_map.brow.x,
                        head_map.brow.y
                    ));
                }
            }
        }
        positions.hand = new Point;
        if(frame.hasOwnProperty(Body.Layer.hand_below_weapon) && frame[Body.Layer.hand_below_weapon].map){
            const hand_map = frame[Body.Layer.hand_below_weapon].map;
            // hand
            if(hand_map.handMove){
                positions.hand = new Point(-hand_map.handMove.x, -hand_map.handMove.y);
            }
        }
        const arm_layer = [
            Body.Layer.arm,
            Body.Layer.arm_over_hair
        ].find(layer => frame.hasOwnProperty(layer) && frame[layer].map)
        if(arm_layer && frame[arm_layer].map && frame[arm_layer].map.hand){
            const arm_map = frame[arm_layer].map;
            positions.hand = positions.hand.concat(new Point(
                -arm_map.hand.x,
                arm_map.hand.y
            ))
        }
    }
    return positions;
}