const { parse_string } = require("./util")

function login_handler(data, send){
    let [account, account_len] = parse_string(data);
    let [password] = parse_string(data.subarray(2 + account_len));
    let packet = Buffer.alloc(6);
    packet.writeInt16BE(0);
    if(account == "test" && password == "test"){
        packet.writeInt32BE(0, 2);
    }else if(account == "test" && password == "logined"){
        packet.writeInt32BE(7, 2);
    }else{
        packet.writeInt32BE(5, 2);
    }
    send(packet);
}

function char_list_handler(data, send){
    let world = data.readUint8(0);
    let channel = data.readUint8(1);
    console.log(world)
    console.log(channel)
}

module.exports = {
    login: login_handler,
    char_list: char_list_handler,
}