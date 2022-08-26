/**
 * @category Net
 * @module LoginSession
 */

import { NeedInit } from "../Types";
import { UILoginState } from "../ui/UILoginState";
import { InPacket } from "./InPacket";
import { LoginPacket } from "./packet/LoginPacket";
import { PacketHandler, PacketSwitch } from "./PacketSwitch";
import { Session } from "./Session";

class LoginSession extends Session implements NeedInit{
    packet_switch: PacketSwitch;
    constructor(){
        super();
        this.packet_switch = new PacketSwitch([
            [InPacket.Type.LOGIN, {decode: LoginPacket.Login.In.decode, handle: this.login_handler.bind(this)}]
        ])
    }

    init(ui: UILoginState): void {
        this.ui = ui;
    }

    open(callback?: () => void): void {
        super.connect(`ws://${location.host}/login`, callback);
    }

    login(account: string, password: string){
        this.send(new LoginPacket.Login.Out(account, password).encode());
    }
    
    private ui: UILoginState;
    private login_handler: PacketHandler = (packet: LoginPacket.Login.In) => {
        // TODO:
    }
}

const _session = new LoginSession;
export default _session;