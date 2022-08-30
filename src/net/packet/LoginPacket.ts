/**
 * @category Net
 * @module LoginPacket
 */

import { InPacket } from "../InPacket";
import { OutPacket } from "../OutPacket";
import { sizeof, String, Type } from "../Type";

export namespace LoginPacket {
    export namespace Login{
        export class In extends InPacket{
            reason: Reason;
            static decode(data: ArrayBuffer): InPacket{
                let packet = new Login.In;
                let view = new DataView(data);
                switch(view.getUint32(0, false)){
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
                view.setUint16(0, OutPacket.Type.LOGIN);
                this.account.encode(buffer, sizeof(Type.UInt16));
                this.password.encode(buffer, sizeof(Type.UInt16) + this.account.size());
                return buffer;
            }
        }
    }
}