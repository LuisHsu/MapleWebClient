/**
 * @category Net
 * @module OutPacket
 */

export abstract class OutPacket {
    abstract encode(): ArrayBuffer;
}

export namespace OutPacket{
    export enum Type {
        LOGIN = 1,
    }
}