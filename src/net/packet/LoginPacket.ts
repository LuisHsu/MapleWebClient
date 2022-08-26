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
            static decode(data: ArrayBuffer): InPacket{
                // TODO:
                return this;
            }
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