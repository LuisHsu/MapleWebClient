/**
 * @category Net
 * @module Session
 */

import { PacketSwitch } from "./PacketSwitch";

export abstract class Session {
    close(){
        this.socket.close();
        this.socket = null;
    }
    protected connect(url: string, callback?: () => void){
        if(this.socket !== null && this.socket.readyState == WebSocket.OPEN){
            this.socket.close();
        }
        this.socket = new WebSocket(url);
        this.socket.onmessage = this.receive.bind(this);
        if(callback){
            this.socket.onopen = callback;
        }
    }
    protected send(data: string | ArrayBufferLike | ArrayBufferView){
        this.socket.send(data);
    }
    private receive(event: MessageEvent){
        this.packet_switch.handle(event.data);
    }

    abstract packet_switch: PacketSwitch;
    private socket:WebSocket = null;
}