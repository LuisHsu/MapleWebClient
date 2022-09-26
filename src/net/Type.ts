/**
 * @category Net
 * @module Type
 */

export const endian = false; // true: little, false: big

export enum Type {
    UInt8,
    Int8,
    UInt16,
    Int16,
    UInt32,
    Int32,
    Float32,
    Float64,
}

export function sizeof(t: Type): number{
    switch(t){
        case Type.UInt8:
            return 1;
        case Type.Int8:
            return 1;
        case Type.UInt16:
            return 2;
        case Type.Int16:
            return 2;
        case Type.UInt32:
            return 4;
        case Type.Int32:
            return 4;
        case Type.Float32:
            return 4;
        case Type.Float64:
            return 8;
        default:
            return null;
    }
}

export class String {
    data: string;
    constructor(data: string){
        this.data = data;
    }
    size(): number {
        return sizeof(Type.UInt16) + this.data.length;
    }
    encode(buffer: ArrayBuffer, byteOffset: number = 0){
        let view = new DataView(buffer, byteOffset);
        view.setUint16(0, this.data.length);
        let string_view = new Uint8Array(buffer, byteOffset + sizeof(Type.UInt16));
        let encoder = new TextEncoder();
        string_view.set(encoder.encode(this.data));
    }

    static decode(buffer: ArrayBuffer, length: number, byteOffset: number = 0): String{
        let sliced = buffer.slice(byteOffset, byteOffset + length);
        let decoder = new TextDecoder();
        return new String(decoder.decode(sliced));
    }
}