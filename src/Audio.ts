
class AudioError extends Error{
    constructor(message: string = ""){
        super(message);
        this.name = "Audio";
    }
}

export class Sound {
    static data: {[id: string]: string} = {
        "BtMouseClick": "UI.img/BtMouseClick.mp3",
        "BtMouseOver": "UI.img/BtMouseOver.mp3",
        "CharSelect": "UI.img/CharSelect.mp3",
        "DlgNotice": "UI.img/DlgNotice.mp3",
        "MenuDown": "UI.img/MenuDown.mp3",
        "MenuUp": "UI.img/MenuUp.mp3",
        "RaceSelect": "UI.img/RaceSelect.mp3",
        "ScrollUp": "UI.img/ScrollUp.mp3",
        "SelectMap": "UI.img/SelectMap.mp3",
        "Tab": "UI.img/Tab.mp3",
        "WorldSelect": "UI.img/WorldSelect.mp3",
        "DragStart": "UI.img/DragStart.mp3",
        "DragEnd": "UI.img/DragEnd.mp3",
        "WorldmapOpen": "UI.img/WorldmapOpen.mp3",
        "WorldmapClose": "UI.img/WorldmapClose.mp3",
        "GameIn": "Game.img/GameIn.mp3",
		"Jump": "Game.img/Jump.mp3",
		"DropItem": "Game.img/DropItem.mp3",
		"PickUpItem": "Game.img/PickUpItem.mp3",
		"Portal": "Game.img/Portal.mp3",
		"LevelUp": "Game.img/LevelUp.mp3",
		"Tombstone": "Game.img/Tombstone.mp3",
    }
    playlist: {[key: string]: HTMLAudioElement} = {};
    play = (id: string) => {
        if(id in Sound.data){
            if(!(id in this.playlist)){
                this.playlist[id] = new Audio(`Sound/${Sound.data[id]}`);
            }
            this.playlist[id].play().catch((err: DOMException) => {
                throw new AudioError(err.message);
            })
        }else{
            throw new AudioError(`unknown audio ${id}`);
        }
    }
    pause = (id: string) => {
        if(id in this.playlist){
            this.playlist[id].pause();
        }else{
            throw new AudioError(`audio ${id} is not playing`);
        }
    }
}

const Music = {

}