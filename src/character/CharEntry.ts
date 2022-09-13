/**
 * @category Character
 * @module CharEntry
 */

import { Job } from "./Job";

export class CharEntry {
    cid: number;
    name: string;
    pet_ids: number[] = [];
    exp: number;
    map_id: number;
    portal: number;
    rank: CharEntry.Rank;
    job_rank: CharEntry.Rank;
    gender: Gender;
    skin_id: number;
    face_id: number;
    hair_id: number;
    equips: {[key in number]?: number} = {};
    masked_equips: {[key in number]?: number} = {};
    level: number;
    job: Job;
    str: number;
    dex: number;
    int: number;
    luk: number;
    hp: number;
    max_hp: number;
    mp: number;
    max_mp: number;
    ap: number;
    sp: number;
    fame: number;
    meso: number;
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