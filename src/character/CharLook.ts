/**
 * @category Character
 * @module CharLook
 */

import { Body } from "./Body";
import { CharEntry } from "./CharEntry";
import { Drawable, Transform } from "../graphics/Canvas";
import { Stance } from "./Look";
import Animation, { Frame } from "../graphics/Animation";
import { Texture } from "../graphics/Texture";
import { Hair } from "./Hair";

export class CharLook implements Drawable{
    body: Body;
    hair: Hair;
    animation: Animation;

    constructor(entry: CharEntry){
        this.body = new Body(entry.skin_id, () => {
            this.hair = new Hair(entry.hair_id, () => {
                this.make_animation(Stance.Id.stand1);
                this.animation.repeat = true;
                this.animation.start();
            })
        });
    }

    draw(transform: Transform): void {
        if(this.animation){
            this.animation.draw(transform);
        }
    }

    private make_animation(stance_id: Stance.Id){
        const stance = this.body.stances[stance_id];
        this.animation = new Animation(stance.map(frame => {
            let textures: Texture[] = [];
            if(frame.layers.body){
                textures.push(frame.layers.body);
            }
            if(frame.layers.armBelowHead){
                textures.push(frame.layers.armBelowHead);
            }
            if(frame.layers.armBelowHeadOverMail){
                textures.push(frame.layers.armBelowHeadOverMail);
            }
            if(frame.layers.head){
                textures.push(frame.layers.head);
            }
            if(frame.layers.arm){
                textures.push(frame.layers.arm);
            }
            // TODO: [equip] wrist
            // TODO: [equip] glove
            // TODO: [equip] weapon over glove
            if(frame.layers.handBelowWeapon){
                textures.push(frame.layers.handBelowWeapon);
            }
            if(frame.layers.armOverHair){
                textures.push(frame.layers.armOverHair);
            }
            if(frame.layers.armOverHairBelowWeapon){
                textures.push(frame.layers.armOverHairBelowWeapon);
            }
            // TODO: [equip] weapon over hand
            // TODO: [equip] weapon over body
            if(frame.layers.handOverHair){
                textures.push(frame.layers.handOverHair);
            }
            if(frame.layers.handOverWeapon){
                textures.push(frame.layers.handOverWeapon);
            }
            // TODO: [equip] Wrist over hair
            // TODO: [equip] Glove over hair
            return new Frame(textures, frame.delay);
        }));
    }
}