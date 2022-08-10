/**
 * @category Audio
 * @module Audio
 */
import Setting from "../Setting";
import AudioData from "./AudioData";

export class AudioError extends Error {
    constructor(message: string = ""){
        super(message);
        this.name = "Audio";
    }
}

export class BaseAudio {
    protected playlist: {[key: string]: HTMLAudioElement} = {};
    protected _master_volume: number = 1;
    play = (id: string, volume: number = 1, loop: boolean = false) : void => {
        if(id in AudioData){
            if(!(id in this.playlist)){
                this.playlist[id] = new Audio(`${Setting.DataPath}Sound/${AudioData[id]}`);
            }
            this.playlist[id].volume = volume * this._master_volume;
            this.playlist[id].loop = loop;
            this.playlist[id].play().catch((err: DOMException) => {
                throw new AudioError(err.message);
            })
        }else{
            throw new AudioError(`unknown audio ${id}`);
        }
    }
    pause = (id: string) : void => {
        if(id in this.playlist){
            this.playlist[id].pause();
        }else{
            throw new AudioError(`audio ${id} is not playing`);
        }
    }
    stop = (id: string) : void => {
        if(id in this.playlist){
            this.playlist[id].pause();
            delete this.playlist[id];
        }else{
            throw new AudioError(`audio ${id} is not playing`);
        }
    }
    get volume(): number {
        return this._master_volume;
    }
    set volume(value: number){
        let old_volume = this._master_volume;
        this._master_volume = value;
        for (const [_, entry] of Object.entries(this.playlist)) {
            entry.volume = entry.volume * this._master_volume / (old_volume > 0 ? old_volume : 1.0);
        }
    }
}

/**
 * Singleton for game sound
 */
export let Sound = new BaseAudio;

/**
 * Singleton for game music
 */
export let Music = new BaseAudio;