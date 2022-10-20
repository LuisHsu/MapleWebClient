/**
 * @category Character
 * @module CharLook
 */

import { Body } from "./Body";
import { CharEntry } from "./CharEntry";
import canvas, { Drawable, Transform } from "../graphics/Canvas";
import { Expression, Stance } from "./Look";
import Animation, { Frame, FrameItem } from "../graphics/Animation";
import { Hair } from "./Hair";
import { Face } from "./Face";
import { Point } from "../Types";

export class CharLook implements Drawable{
    body: Body;
    hair: Hair;
    face: Face;

    animation: {
        lower?: Animation,
        face?: Animation,
        upper?: Animation,
    } = {};

    face_pos?: Point;

    constructor(entry: CharEntry, callback: () => void = () => {}){
        Body.create(entry.skin_id)
        .then(body => Promise.all(
            [
                Hair.create(entry.hair_id, body),
                Face.create(entry.face_id, body),
            ]).then(([hair, face]) => {
                this.body = body;
                this.hair = hair;
                this.face = face;
            })
        ).then(() => {
            this.make_animations();
            this.make_face();
        }).then(callback)
    }

    start(){
        if(this.animation){
            if(this.animation.lower){
                this.animation.lower.start();
            }
            if(this.animation.face){
                this.animation.face.start();
            }
            if(this.animation.upper){
                this.animation.upper.start();
            }
        }
    }

    stop(){
        if(this.animation){
            if(this.animation.lower){
                this.animation.lower.stop();
            }
            if(this.animation.face){
                this.animation.face.stop();
            }
            if(this.animation.upper){
                this.animation.upper.stop();
            }
        }
    }

    reset(){
        if(this.animation){
            if(this.animation.lower){
                this.animation.lower.reset();
            }
            if(this.animation.face){
                this.animation.face.reset();
            }
            if(this.animation.upper){
                this.animation.upper.reset();
            }
        }
    }

    set_repeat(repeat: boolean){
        if(this.animation){
            if(this.animation.lower){
                this.animation.lower.repeat = repeat;
            }
            if(this.animation.upper){
                this.animation.upper.repeat = repeat;
            }
        }
    }

    draw(): void {
        if(this.animation){
            if(this.animation.lower){
                this.animation.lower.draw();
            }
            if(this.animation.face && this.face_pos){
                canvas.open_scope(() => {
                    canvas.apply_transform(new Transform({translate: this.face_pos}))
                    this.animation.face.draw();
                })
            }
            if(this.animation.upper){
                this.animation.upper.draw();
            }
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

        // Generate animations
        if(Stance.is_climbing(stance_id)){
            this.animation.lower = null;
            this.animation.upper = new Animation(Object.values(stances).map(frame => {
                let item: FrameItem[] = [];
                const {body, hair} = frame.layers;

                if(body[Body.Layer.back_body]){
                    item.push(body[Body.Layer.back_body]);
                }
                if(body[Body.Layer.head]){
                    item.push(body[Body.Layer.head]);
                }
                if(hair[Hair.Layer.back]){
                    item.push(hair[Hair.Layer.back]);
                }
                // TODO: [equip] weapon over hand
                // TODO: [equip] weapon over body
                // if(body[Body.Layer.hand_over_weapon]){
                //     textures.push(body[Body.Layer.hand_over_weapon]);
                // }
                // TODO: [equip] Wrist over hair
                // TODO: [equip] Glove over hair
                return new Frame(item, frame.delay);
            }));
        }else{
            this.animation.lower = new Animation(Object.values(stances).map(frame => {
                let item: FrameItem[] = [];
                const {body, hair} = frame.layers;
                if(hair[Hair.Layer.belowbody]){
                    item.push(hair[Hair.Layer.belowbody]);
                }
                if(body[Body.Layer.body]){
                    item.push(body[Body.Layer.body]);
                }
                if(body[Body.Layer.arm_below_head]){
                    item.push(body[Body.Layer.arm_below_head]);
                }
                if(body[Body.Layer.arm_below_head_over_mail]){
                    item.push(body[Body.Layer.arm_below_head_over_mail]);
                }
                if(body[Body.Layer.head]){
                    item.push(body[Body.Layer.head]);
                }

                if(hair[Hair.Layer.shade]){
                    item.push(hair[Hair.Layer.shade]);
                }
                if(hair[Hair.Layer.default]){
                    item.push(hair[Hair.Layer.default]);
                }
                return new Frame(item, frame.delay, null, null, null, () => {
                    if(frame.has_face){
                        this.face_pos = frame.positions.face;
                    }else{
                        this.face_pos = null;
                    }
                });
            }));
            this.animation.upper = new Animation(Object.values(stances).map(frame => {
                let item: FrameItem[] = [];
                const {body, hair} = frame.layers;
                // TODO: [equip] Eyeacc
                // TODO: [equip] Shield
                // TODO: [equip] captype
                // TODO: [equip] Weapon
                if(body[Body.Layer.arm]){
                    item.push(body[Body.Layer.arm]);
                }
                // TODO: [equip] wrist
                // TODO: [equip] glove
                // TODO: [equip] weapon over glove
                if(body[Body.Layer.hand_below_weapon]){
                    item.push(body[Body.Layer.hand_below_weapon]);
                }
                if(body[Body.Layer.arm_over_hair]){
                    item.push(body[Body.Layer.arm_over_hair]);
                }
                if(body[Body.Layer.arm_over_hair_below_weapon]){
                    item.push(body[Body.Layer.arm_over_hair_below_weapon]);
                }
                // TODO: [equip] weapon over hand
                // TODO: [equip] weapon over body
                if(body[Body.Layer.hand_over_hair]){
                    item.push(body[Body.Layer.hand_over_hair]);
                }
                if(body[Body.Layer.hand_over_weapon]){
                    item.push(body[Body.Layer.hand_over_weapon]);
                }
                // TODO: [equip] Wrist over hair
                // TODO: [equip] Glove over hair
                return new Frame(item, frame.delay);
            }));
        }
    }

    private make_face(expression: Expression = Expression.default){
        this.animation.face = this.face.expressions[expression];
        // TODO: [equip] Face
    }
}