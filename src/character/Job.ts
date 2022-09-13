/**
 * @category Character
 * @module Job
 */

export class Job {
    id: Job.ID;
    grade: Job.Grade;
}

export namespace Job {
    export enum Grade {
        Beginner = 0,
        First = 1,
        Second = 2,
        Third = 3,
        Fourth = 4,
    }
    export enum ID {
        beginner = 0,
        swordsman = 100,
        fighter = 110,
        crusader = 111,
        hero = 112,
        page = 120,
        white_knight = 121,
        paladin = 122,
        spearman = 130,
        dragon_knight = 131,
        dark_knight = 132,
        magician = 200,
        wizard_FP = 210,
        mage_FP = 211,
        archmage_FP = 212,
        wizard_IL = 220,
        mage_IL = 221,
        archmage_IL = 222,
        cleric = 230,
        priest = 231,
        bishop = 232,
        archer = 300,
        hunter = 310,
        ranger = 311,
        bowmaster = 312,
        crossbowman = 320,
        sniper = 321,
        marksman = 322,
        rogue = 400,
        assassin = 410,
        hermit = 411,
        nightlord = 412,
        bandit = 420,
        chief_bandit = 421,
        shadower = 422,
        pirate = 500,
        brawler = 510,
        marauder = 511,
        buccaneer = 512,
        gunslinger = 520,
        outlaw = 521,
        corsair = 522,
        Noblesse = 1000,
        dawn_warrior = 1100,
        blaze_wizard = 1200,
        wind_archer = 1300,
        night_walker = 1400,
        thunder_breaker = 1500,
        aran = 2000,
    }
}