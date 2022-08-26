/**
 * @category Net
 * @module InPacket
 */

export abstract class InPacket{
    static decode = (data: ArrayBuffer): InPacket => null;
}

export namespace InPacket{
    export enum Type {
        LOGIN = 0,
    }
}