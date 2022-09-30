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
                                    positions: {},
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
                                result.positions = retrieve_positions(frame);
                                result.layers = Object.entries(frame).reduce((prev: any, [layer, part]: [string, any]) => {
                                    if(typeof(part) == "string"){
                                        prev[layer] = part;
                                    }else{
                                        prev[part.layer? part.layer: layer] = generate_texture(
                                            layer,
                                            skin_id, part, stance, frame_key, result.positions
                                        );
                                    }
                                    return prev;
                                }, {});
                                entry[frame_key] = result;
                            }
                            return entry;
                        }), {});
                    return stances;
                }, {});
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
            let body = new Body;
            Object.entries(stances).forEach(([stance, frames]) => {
                body.stances[stance as Stance.Id] = Object.entries(frames).reduce(
                    (result: any, entry) => {
                        let [index, elem] = entry;
                        result[index] = new Body.Stance();
                        result[index].delay = elem.delay;
                        result[index].layers = elem.layers;
                        result[index].has_face = elem.has_face;
                        result[index].positions = elem.positions;
                        return result;
                    },
                {});
            })
            body.stances[Stance.Id.default] = body.stances[Stance.Id.stand1];
            return body;
        })
    }
}

export namespace Body {
    export enum Layer {
        body = "body",
        back_body = "backBody",
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
    export class Stance {
        delay: number = 0;
        layers: {[layer in Body.Layer]?: Texture} = {};
        has_face: boolean = true;
        positions: {
            body?: Point,
            arm?: Point,
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
        offset: new Point(
            (part.origin.x - (part.width / 2)),
            (part.origin.y - (part.height / 2))
        )
    };
    switch(part.layer? part.layer: layer){
        case Body.Layer.head:
            if(positions.head){
                option.offset = option.offset.concat(positions.head);
            }
        break;
        case Body.Layer.arm:
        case Body.Layer.arm_over_hair:
        case Body.Layer.arm_below_head:
            if(positions.arm){
                option.offset = option.offset.concat(positions.arm);
            }
        break;
        case Body.Layer.hand_over_hair:
            if(positions.arm && part.map && part.map.navel){
                option.offset = option.offset.concat(new Point(
                    part.map.navel.x * 2,
                    positions.arm.y
                ));
            }
        break;
    }
    return new Texture(url, option);
}

function retrieve_positions(frame_json: any){
    let positions = {
        body: new Point,
        arm: new Point,
        hand: new Point,
        head: new Point,
        face: new Point,
    };
    const frame = {...frame_json};
    Object.entries(frame).forEach(([name, part]: [string, any]) => {
        if(typeof(part) != "string" && part.layer != name){
            frame[part.layer] = frame[name];
            delete frame[name];
        }
    })
    let body_layer = [
        Body.Layer.body,
        Body.Layer.back_body,
    ].find(layer => (frame.hasOwnProperty(layer) && frame[layer].map));
    if(body_layer && frame[body_layer].map){
        const body_map = frame[body_layer].map;
        // Body
        if(body_map.navel){
            positions.body = new Point(
                body_map.navel.x,
                body_map.navel.y
            );
            let arm_layer = [
                Body.Layer.arm,
                Body.Layer.arm_over_hair,
                Body.Layer.arm_below_head,
            ].find(layer => (frame.hasOwnProperty(layer) && frame[layer].map));
            if(arm_layer && frame[arm_layer].map &&frame[arm_layer].map.navel){
                // Arm
                positions.arm = new Point(
                    frame[arm_layer].map.navel.x - body_map.navel.x,
                    frame[arm_layer].map.navel.y - body_map.navel.y,
                );
            }
        }
        if(frame.hasOwnProperty(Body.Layer.head) && frame[Body.Layer.head].map){
            const head_map = frame[Body.Layer.head].map;
            if(head_map.neck && body_map.neck){
                // Head
                positions.head = new Point(
                    -body_map.neck.x + head_map.neck.x,
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
    }
    if(frame.hasOwnProperty(Body.Layer.hand_below_weapon) && frame[Body.Layer.hand_below_weapon].map){
        const hand_map = frame[Body.Layer.hand_below_weapon].map;
        // hand
        if(hand_map.handMove){
            positions.hand = new Point(hand_map.handMove.x, -hand_map.handMove.y);
        }
    }
    return positions;
}