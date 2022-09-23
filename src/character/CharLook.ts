/**
 * @category Character
 * @module CharLook
 */

import { Body } from "./Body";
import { CharEntry } from "./CharEntry";

export class CharLook {
    body: Body;

    constructor(entry: CharEntry){
        this.body = new Body(entry.skin_id);
    }
}