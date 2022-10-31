/**
 * @category Net
 * @module OutPacket
 */

export abstract class OutPacket {
    abstract encode(): ArrayBuffer;
}

export namespace OutPacket{
    export enum Type {
        Login = 1,
        Character_list = 5,
        Character_name = 21,
    }
}