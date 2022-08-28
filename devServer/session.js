const { 
    login,
} = require("./login");

function Switch(data){
    let opcode = data.readInt16BE();
    if(opcode in handler_map){
        handler_map[opcode](data.slice(2));
    }
}

function Session(ws){
    this.send = ws.send;
    ws.on('message', Switch.bind(this));
}

module.exports = Session

const handler_map = {
    1: login
}