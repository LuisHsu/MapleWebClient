/**
 * @category Net
 * @module LoginPacket
 */

import { CharEntry, Gender } from "../../character/CharEntry";
import { Job } from "../../character/Job";
import { InPacket } from "../InPacket";
import { OutPacket } from "../OutPacket";
import { sizeof, String, Type, endian } from "../Type";

export namespace LoginPacket {
    export namespace Login{
        export class In extends InPacket{
            reason: Reason;
            static decode(data: ArrayBuffer): InPacket{
                let packet = new Login.In;
                let view = new DataView(data);
                switch(view.getUint32(0, endian)){
                    case Reason.success:
                        packet.reason = Reason.success;
                    break;
                    case Reason.not_regstered:
                        packet.reason = Reason.not_regstered;
                    break;
                    case Reason.already_logged_in:
                        packet.reason = Reason.already_logged_in;
                    break;
                    default:
                        packet.reason = Reason.unknown;
                }
                return packet;
            }
        }

        export enum Reason {
            success = 0,
            not_regstered = 5,
            already_logged_in = 7,
            unknown = 23,
        }

        export class Out extends OutPacket{
            account: String;
            password: String;
            constructor(account: string, password: string){
                super();
                this.account = new String(account);
                this.password = new String(password);
            }
            encode(): ArrayBuffer {
                let buffer = new ArrayBuffer(
                    sizeof(Type.UInt16) + 
                    this.account.size() + 
                    this.password.size()
                );
                let view = new DataView(buffer);
                view.setUint16(0, OutPacket.Type.Login);
                this.account.encode(buffer, sizeof(Type.UInt16));
                this.password.encode(buffer, sizeof(Type.UInt16) + this.account.size());
                return buffer;
            }
        }
    }

    export namespace CharList {
        export class In extends InPacket{
            characters: CharEntry[] = [];
            channel: number;

            static decode(data: ArrayBuffer): InPacket{
                let packet = new CharList.In;
                let view = new DataView(data);
                let offset = 0;
                packet.channel = view.getUint8(offset);
                for(let char_len = view.getUint8(offset += 1); char_len > 0; --char_len){
                    let character = new CharEntry;
                    character.cid = view.getInt32(offset += 1, );
                    let name_length = view.getUint16(offset += 4, endian);
                    character.name = String.decode(data, name_length, offset += 2).data;
                    character.gender = view.getUint8(offset += name_length);
                    character.skin_id = view.getUint8(offset += 1);
                    character.face_id = view.getUint16(offset += 1, endian);
                    character.hair_id = view.getUint16(offset += 2, endian);
                    let pet_count = view.getUint8(offset += 2);
                    for(let i = 0; i < pet_count; ++i){
                        character.pet_ids.push(view.getUint8(offset += 1));
                    }
                    character.level = view.getUint16(offset += 1, endian);
                    character.job = new Job;
                    character.job.id = view.getUint16(offset += 2, endian);
                    character.job.grade = view.getUint8(offset += 2);
                    character.str = view.getUint16(offset += 1, endian);
                    character.dex = view.getUint16(offset += 2, endian);
                    character.int = view.getUint16(offset += 2, endian);
                    character.luk = view.getUint16(offset += 2, endian);
                    character.hp = view.getUint32(offset += 2, endian);
                    character.max_hp = view.getUint32(offset += 4, endian);
                    character.mp = view.getUint32(offset += 4, endian);
                    character.max_mp = view.getUint32(offset += 4, endian);
                    character.ap = view.getUint16(offset += 4, endian);
                    character.sp = view.getUint16(offset += 2, endian);
                    character.exp = view.getUint32(offset += 2, endian);
                    character.fame = view.getUint16(offset += 4, endian);
                    character.map_id = view.getUint32(offset += 2, endian);
                    character.portal = view.getUint8(offset += 4);
                    for(let slot = view.getUint8(offset += 1); slot != 0xFF; slot = view.getUint8(offset += 4)){
                        character.equips[slot] = view.getUint32(offset += 1, endian);
                    }
                    for(let slot = view.getUint8(offset += 1); slot != 0xFF; slot = view.getUint8(offset += 4)){
                        character.masked_equips[slot] = view.getUint32(offset += 1, endian);
                    }
                    let has_rankinfo = view.getUint8(offset += 1);
                    if(has_rankinfo){
                        character.rank = new CharEntry.Rank;
                        character.rank.value = view.getUint32(offset += 1, endian);
                        character.rank.trend = view.getInt8(offset += 4);
                        character.job_rank = new CharEntry.Rank;
                        character.job_rank.value = view.getUint32(offset += 1, endian);
                        character.job_rank.trend = view.getInt8(offset += 4);
                    }
                    packet.characters.push(character);
                }
                return packet;
            }
        }

        export class Out extends OutPacket{
            world: number;
            channel: number;
            constructor(channel: number, world: number = 0){
                super();
                this.world = world;
                this.channel = channel;
            }
            encode(): ArrayBuffer {
                let buffer = new ArrayBuffer(
                    sizeof(Type.UInt16) +
                    sizeof(Type.UInt8) * 2
                );
                let view = new DataView(buffer);
                view.setUint16(0, OutPacket.Type.Character_list);
                view.setUint8(2, this.world);
                view.setUint8(3, this.channel);
                return buffer;
            }
        }
    }
}