const { 
    login,
    char_list,
    char_name,
} = require("./login");

function Switch(data){
    let opcode = data.readInt16BE();
    if(opcode in handler_map){
        handler_map[opcode](data.slice(2), this.send);
    }else{
        console.log(`Unknown packet: ${data}`);
    }
}

function Session(ws){
    this.send = ws.send.bind(ws);
    ws.on('message', Switch.bind(this));
}

module.exports = Session

const handler_map = {
    1: login,
    5: char_list,
    21: char_name,
}