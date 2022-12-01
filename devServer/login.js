const { parse_string } = require("./util")

function login_handler(data, send){
    let [account, account_len] = parse_string(data);
    let [password] = parse_string(data.subarray(2 + account_len));

    // Send login packet
    let packet = Buffer.alloc(6);
    packet.writeInt16BE(30001); // opcode
    if(account == "test" && password == "test"){
        packet.writeUint8(0, 2); // success
    }else if(account == "test" && password == "logined"){
        packet.writeUint8(7, 2); // already logined
    }else{
        packet.writeUint8(1, 2); // not registered
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

function char_name_handler(data, send){
    let [name] = parse_string(data);
    
    let result = (name == "TestChar") ? 0 : 1;

    // Send character name packet
    let packet = Buffer.alloc(3);
    packet.writeInt16BE(13); // opcode
    packet.writeUint8(result, 2); // channel

    send(packet);
}

module.exports = {
    login: login_handler,
    char_list: char_list_handler,
    char_name: char_name_handler,
}

function create_mock_character(){
    let buffer = Buffer.alloc(91);
    let offset = 0;
    buffer.writeInt32BE(123); // cid: 4 = 123
    buffer.writeUint16BE(8, offset += 4); // name_length: 2 = 8
    buffer.write("TestChar", offset += 2); // name: 8 = TestChar
    buffer.writeUint8(1, offset += 8) // gender: 1 = female
    buffer.writeUint32BE(2000, offset += 1) // skin: 4 = Light
    buffer.writeUint32BE(21000, offset += 4) // face: 4 = Smile
    buffer.writeUint32BE(30100, offset += 4) // hair: 4 = Smile
    buffer.writeUint8(0, offset += 4) // pet_count: 1 = 0
    // pet_id: 2
    buffer.writeUint16BE(20, offset += 1) // level: 2 = 20
    buffer.writeUint16BE(200, offset += 2) // job: 2 = magician
    buffer.writeUint8(1, offset += 2) // grade: 1 = first
    buffer.writeUint16BE(4, offset += 1) // str: 2 = 4
    buffer.writeUint16BE(4, offset += 2) // dex: 2 = 4
    buffer.writeUint16BE(86, offset += 2) // int: 2 = 86
    buffer.writeUint16BE(23, offset += 2) // luk: 2 = 23
    buffer.writeUint32BE(1000, offset += 2) // hp: 4 = 1000
    buffer.writeUint32BE(1200, offset += 4) // max_hp: 4 = 1200
    buffer.writeUint32BE(5000, offset += 4) // mp: 4 = 5000
    buffer.writeUint32BE(5600, offset += 4) // max_mp: 4 = 5600
    buffer.writeUint16BE(5, offset += 4) // ap: 2 = 5
    buffer.writeUint16BE(3, offset += 2) // sp: 2 = 3
    buffer.writeUint32BE(72000, offset += 2) // exp: 4 = 72000
    buffer.writeUint16BE(15, offset += 4) // fame: 2 = 15
    buffer.writeUint32BE(0, offset += 2) // map_id: 4 = 0
    buffer.writeUint8(0, offset += 4) // portal: 1 = 0
    buffer.writeUint32BE(0xFF, offset += 1) // equip_slot: 1 = none
    buffer.writeUint32BE(0xFF, offset += 4) // masked_equip_slot: 1 = none
    buffer.writeUint8(1, offset += 4) // has rankinfo: 1 = true
    buffer.writeUint32BE(345, offset += 1) // rank_value: 4 = 345
    buffer.writeInt8(-1, offset += 4) // rank_trend: 1 = -
    buffer.writeUint32BE(234, offset += 1) // job_rank_value: 4 = 234
    buffer.writeInt8(1, offset += 4) // job_rank_trend: 1 = +
    return buffer;
}