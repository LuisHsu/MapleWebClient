/**
 * @category Character
 * @module CharEntry
 */

import { Job } from "./Job";

export class CharEntry {
    cid: number = -1;
    name: string = "";
    pet_ids: number[] = [];
    exp: number = 0;
    map_id: number;
    portal: number;
    rank: CharEntry.Rank;
    job_rank: CharEntry.Rank;
    gender: Gender;
    skin_id: number = 0;
    face_id: number = 0;
    hair_id: number = 0;
    equips: {[key in number]?: number} = {};
    masked_equips: {[key in number]?: number} = {};
    level: number = 1;
    job: Job = new Job;
    str: number = 0;
    dex: number = 0;
    int: number = 0;
    luk: number = 0;
    hp: number = 0;
    max_hp: number = 0;
    mp: number = 0;
    max_mp: number = 0;
    ap: number = 0;
    sp: number = 0;
    fame: number = 0;
    meso: number = 0;
}

export namespace CharEntry {
    export enum Trend {
        increase = 1,
        decrease = -1,
        even = 0,
    }
    export class Rank {
        value: number;
        trend: Trend;
    }
}

export enum Gender {
    male, female,
}