/**
 * @category Character
 * @module Look
 */

export namespace Stance {
    export enum Id{
        alert = "alert",
        dead = "dead",
        fly = "fly",
        heal = "heal",
        jump = "jump",
        ladder = "ladder",
        prone = "prone",
        proneStab = "proneStab",
        rope = "rope",
        shot = "shot",
        shoot1 = "shoot1",
        shoot2 = "shoot2",
        shootF = "shootF",
        sit = "sit",
        stabO1 = "stabO1",
        stabO2 = "stabO2",
        stabOF = "stabOF",
        stabT1 = "stabT1",
        stabT2 = "stabT2",
        stabTF = "stabTF",
        stand1 = "stand1",
        stand2 = "stand2",
        swingO1 = "swingO1",
        swingO2 = "swingO2",
        swingO3 = "swingO3",
        swingOF = "swingOF",
        swingP1 = "swingP1",
        swingP2 = "swingP2",
        swingPF = "swingPF",
        swingT1 = "swingT1",
        swingT2 = "swingT2",
        swingT3 = "swingT3",
        swingTF = "swingTF",
        walk1 = "walk1",
        walk2 = "walk2",
    }

    export function is_climbing(value: Id){
        return (value == Stance.Id.ladder) || (value == Stance.Id.rope);
    }
}

export enum Expression {
    default = "default",
    blink = "blink",
    hit = "hit",
    smile = "smile",
    troubled = "troubled",
    cry = "cry",
    angry = "angry",
    bewildered = "bewildered",
    stunned = "stunned",
    vomit = "vomit",
    oops = "oops",
    cheers = "cheers",
    chu = "chu",
    wink = "wink",
    pain = "pain",
    glitter = "glitter",
    despair = "despair",
    love = "love",
    shine = "shine",
    blaze = "blaze",
    hum = "hum",
    bowing = "bowing",
    hot = "hot",
    dam = "dam",
}