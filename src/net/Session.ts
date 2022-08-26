/**
 * @category Net
 * @module Session
 */

import { PacketSwitch } from "./PacketSwitch";

export abstract class Session {

    connect(url: string){
        if(this.socket !== null && this.socket.readyState == WebSocket.OPEN){
            this.socket.close();
        }
        this.socket = new WebSocket(url);
        this.socket.onmessage = this.receive.bind(this);
    }
    send(data: string | ArrayBufferLike | ArrayBufferView){
        this.socket.send(data);
    }
    close(){
        this.socket.close();
        this.socket = null;
    }
    private receive(event: MessageEvent){
        this.packet_switch.handle(event.data);
    }

    abstract packet_switch: PacketSwitch;
    private socket:WebSocket = null;
}