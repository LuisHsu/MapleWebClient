
function Switch(data){
    console.log(data)
}

function Session(ws){
    this.send = ws.send;
    ws.on('message', Switch.bind(this));
}

module.exports = Session