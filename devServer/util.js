module.exports.parse_string = (data) => {
    let length = data.readUInt16BE();
    let str = data.subarray(2, 2 + length).toString();
    return [str, length];
}