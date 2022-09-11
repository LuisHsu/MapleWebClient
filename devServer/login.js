const { parse_string } = require("./util")

function login_handler(data, send){
    let [account, account_len] = parse_string(data);
    let [password] = parse_string(data.subarray(2 + account_len));

    // Send login packet
    let packet = Buffer.alloc(6);
    packet.writeInt16BE(0); // opcode
    if(account == "test" && password == "test"){
        packet.writeInt32BE(0, 2); // success
    }else if(account == "test" && password == "logined"){
        packet.writeInt32BE(7, 2); // already logined
    }else{
        packet.writeInt32BE(5, 2); // not registered
    }
    send(packet);
}

function char_list_handler(data, send){
    let world = data.readUint8(0);
    let channel = data.readUint8(1);

    // Send character list packet
    let mock_char = create_mock_character();
    let packet = Buffer.alloc(4 + mock_char.length);
    packet.writeInt16BE(11); // opcode
    packet.writeUint8(channel, 2); // channel
    packet.writeUint8(1, 3); // char_list length
    mock_char.copy(packet, 4);

    send(packet);
}

module.exports = {
    login: login_handler,
    char_list: char_list_handler,
}

function create_mock_character(){
    let buffer = Buffer.alloc(77);

    buffer.writeInt32BE(123); // cid: 4 = 123
    buffer.writeUint16BE(8, 4); // name_length: 2 = 8
    buffer.write("TestChar", 6); // name: 8 = TestChar
    buffer.writeUint8(1, 14) // gender: 1 = female
    buffer.writeUint8(0, 15) // skin: 1 = Light
    buffer.writeUint16BE(3, 16) // face: 2 = Smile
    buffer.writeUint16BE(3, 18) // hair: 2 = Smile
    buffer.writeUint8(0, 20) // pet_count: 1 = 0
    // pet_id: 2
    buffer.writeUint16BE(20, 21) // level: 2 = 20
    buffer.writeUint16BE(200, 23) // job: 2 = magician
    buffer.writeUint16BE(4, 25) // str: 2 = 4
    buffer.writeUint16BE(4, 27) // dex: 2 = 4
    buffer.writeUint16BE(86, 29) // inte: 2 = 86
    buffer.writeUint16BE(23, 31) // luk: 2 = 23
    buffer.writeUint32BE(1000, 33) // hp: 4 = 1000
    buffer.writeUint32BE(1200, 37) // max_hp: 4 = 1200
    buffer.writeUint32BE(5000, 41) // mp: 4 = 5000
    buffer.writeUint32BE(5600, 45) // max_mp: 4 = 5600
    buffer.writeUint16BE(5, 49) // ap: 2 = 5
    buffer.writeUint16BE(3, 51) // sp: 2 = 3
    buffer.writeUint32BE(72000, 53) // exp: 4 = 72000
    buffer.writeUint16BE(15, 57) // fame: 2 = 15
    buffer.writeUint32BE(0, 59) // map_id: 4 = 0
    buffer.writeUint8(0, 63) // portal: 1 = 0
    buffer.writeUint8(0xFF, 64) // equip_slot: 1 = none
    buffer.writeUint8(0xFF, 65) // masked_equip_slot: 1 = none
    buffer.writeUint8(1, 66) // has rankinfo: 1 = true
    buffer.writeUint32BE(345, 67) // rank_value: 4 = 345
    buffer.writeInt8(-1, 71) // rank_trend: 1 = -
    buffer.writeUint32BE(234, 72) // job_rank_value: 4 = 234
    buffer.writeInt8(1, 76) // job_rank_trend: 1 = +
    return buffer;
}