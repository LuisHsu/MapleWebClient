/**
 * @category Character
 * @module CharLook
 */

import { Body } from "./Body";
import { CharEntry } from "./CharEntry";
import { Drawable, Transform } from "../graphics/Canvas";
import { Stance } from "./Look";
import Animation, { Frame, FrameItem } from "../graphics/Animation";
import { Texture } from "../graphics/Texture";
import { Hair } from "./Hair";
import { Point } from "../Types";

export class CharLook implements Drawable{
    body: Body;
    hair: Hair;

    animation: Animation;
    hair_shade: Animation;

    constructor(entry: CharEntry, callback: () => void = () => {}){
        Body.create(entry.skin_id)
        .then(body => Hair.create(entry.hair_id, body)
            .then(hair => {
                this.body = body;
                this.hair = hair;
            })
        ).then(() => {
            this.make_animations();
        }).then(callback)
    }

    start(){
        if(this.animation){
            this.animation.start();
        }
        if(this.hair_shade){
            this.hair_shade.start();
        }
    }

    stop(){
        if(this.animation){
            this.animation.stop();
        }
        if(this.hair_shade){
            this.hair_shade.stop();
        }
    }

    reset(){
        if(this.animation){
            this.animation.reset();
        }
        if(this.hair_shade){
            this.hair_shade.reset();
        }
    }

    set_repeat(repeat: boolean){
        if(this.animation){
            this.animation.repeat = repeat;
        }
        if(this.hair_shade){
            this.hair_shade.repeat = repeat;
        }
    }

    draw(): void {
        if(this.animation){
            this.animation.draw();
        }
    }

    private make_animations(stance_id: Stance.Id = Stance.Id.stand1){
        const body = this.body.stances[stance_id];
        const hair = this.hair.stances[stance_id];
        // Merge stances
        let stances: {[id in number]: any} = {};
        Object.entries(body).forEach(([index_str, frame]: [string, any]) => {
            const index = parseInt(index_str);
            const {delay, has_face, positions, layers} = frame;
            stances[index] = {
                delay,
                has_face,
                positions,
                layers: {
                    body: layers
                },
            };
        })
        if(hair){
            Object.entries(hair).forEach(([index_str, frame]: [string, any]) => {
                const index = parseInt(index_str);
                if(stances[index]){
                    stances[index].layers.hair = {...frame};
                }
            })
        }
        // Generate animation
        this.animation = new Animation(Object.values(stances).map(frame => {
            let textures: FrameItem[] = [];
            const {body, hair} = frame.layers;
            // TODO: climbing
            if(hair[Hair.Layer.belowbody]){
                textures.push(hair[Hair.Layer.belowbody]);
            }
            
            if(body[Body.Layer.body]){
                textures.push(body[Body.Layer.body]);
            }else if(body[Body.Layer.back_body]){
                textures.push(body[Body.Layer.back_body]);
            }
            if(body[Body.Layer.arm_below_head]){
                textures.push(body[Body.Layer.arm_below_head]);
            }
            if(body[Body.Layer.arm_below_head_over_mail]){
                textures.push(body[Body.Layer.arm_below_head_over_mail]);
            }
            if(body[Body.Layer.head]){
                textures.push(body[Body.Layer.head]);
            }
            if(body[Body.Layer.arm]){
                textures.push(body[Body.Layer.arm]);
            }
            // TODO: [equip] wrist
            // TODO: [equip] glove
            // TODO: [equip] weapon over glove
            if(body[Body.Layer.hand_below_weapon]){
                textures.push(body[Body.Layer.hand_below_weapon]);
            }
            if(body[Body.Layer.arm_over_hair]){
                textures.push(body[Body.Layer.arm_over_hair]);
            }
            if(body[Body.Layer.arm_over_hair_below_weapon]){
                textures.push(body[Body.Layer.arm_over_hair_below_weapon]);
            }
            // TODO: [equip] weapon over hand
            // TODO: [equip] weapon over body
            if(body[Body.Layer.hand_over_hair]){
                textures.push(body[Body.Layer.hand_over_hair]);
            }
            // if(body[Body.Layer.hand_over_weapon]){
            //     textures.push(body[Body.Layer.hand_over_weapon]);
            // }
            // TODO: [equip] Wrist over hair
            // TODO: [equip] Glove over hair
            return new Frame(textures, frame.delay);
        }));
    }
}