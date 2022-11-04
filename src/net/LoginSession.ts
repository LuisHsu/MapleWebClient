/**
 * @category Net
 * @module LoginSession
 */

import { NeedInit } from "../Types";
import { UICharCreate } from "../ui/UICharCreate";
import { UICharSelect } from "../ui/UICharSelect";
import { UILoginNotice } from "../ui/UILoginNotice";
import { UILoginState } from "../ui/UILoginState";
import { UIWorldSelect } from "../ui/UIWorldSelect";
import { InPacket } from "./InPacket";
import { LoginPacket } from "./packet/LoginPacket";
import { PacketHandler, PacketSwitch } from "./PacketSwitch";
import { Session } from "./Session";

class LoginSession extends Session implements NeedInit{
    packet_switch: PacketSwitch;
    constructor(){
        super();
        this.packet_switch = new PacketSwitch([
            [InPacket.Type.Login, {decode: LoginPacket.Login.In.decode, handle: this.login_handler.bind(this)}],
            [InPacket.Type.Character_list, {decode: LoginPacket.CharList.In.decode, handle: this.char_list_handler.bind(this)}],
            [InPacket.Type.Character_name, {decode: LoginPacket.CharName.In.decode, handle: this.char_name_handler.bind(this)}],
        ]);
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

    character_list(channel: number, world: number = 0){
        this.send(new LoginPacket.CharList.Out(channel, world).encode());
    }

    character_name(name: string){
        this.send(new LoginPacket.CharName.Out(name).encode());
    }
    
    private ui: UILoginState;

    private login_handler: PacketHandler = (packet: LoginPacket.Login.In) => {
        switch(packet.reason){
            case LoginPacket.Login.Reason.success:
                this.ui.change_state(new UIWorldSelect(this.ui), UILoginState.Direction.Down);
            break;
            case LoginPacket.Login.Reason.not_regstered:
                this.ui.set_notice(UILoginNotice.Type.error, UILoginNotice.MessageID.account_not_match);
            break;
            case LoginPacket.Login.Reason.already_logged_in:
                this.ui.set_notice(UILoginNotice.Type.error, UILoginNotice.MessageID.already_logged_in);
            break;
            default:
        }
    }

    private char_list_handler: PacketHandler = (packet: LoginPacket.CharList.In) => {
        this.ui.change_state(
            new UICharSelect(this.ui, packet.channel, packet.characters),
            (this.ui.state instanceof UICharCreate) ? UILoginState.Direction.Up : UILoginState.Direction.Down
        )
    }

    private char_name_handler: PacketHandler = (packet: LoginPacket.CharName.In) => {
        if(packet.is_valid){
            const ui = this.ui.state as UICharCreate;
            ui.change_phase(UICharCreate.Phase.Look);
        }else{
            this.ui.set_notice(UILoginNotice.Type.error, UILoginNotice.MessageID.name_exists);
        }
    }
}

const _session = new LoginSession;
export default _session;