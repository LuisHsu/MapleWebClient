/**
 * @category Net
 * @module PacketSwitch
 */

import { InPacket } from "./InPacket";
import { endian } from "./Type";

export type PacketHandler = (packet:InPacket) => void;

export class PacketSwitch {
    constructor(handlers: [InPacket.Type, PacketSwitch.Entry][]){
        handlers.forEach((handler: [InPacket.Type, PacketSwitch.Entry]) => {
            this.handlers[handler[0]] = handler[1];
        })
    }

    handle(blob: Blob){
        blob.arrayBuffer().then(buffer => {
            let data = new DataView(buffer);
            let opcode = data.getUint16(0, endian);
            if(opcode in this.handlers){
                let entry = this.handlers[opcode as InPacket.Type];
                entry.handle(entry.decode(buffer.slice(2)));
            }
        })
    }

    private handlers: {[type in InPacket.Type]?: PacketSwitch.Entry} = {};
}

export namespace PacketSwitch{
    export type Entry = {
        decode: (data: ArrayBuffer) => InPacket, 
        handle: PacketHandler,
    };
}
