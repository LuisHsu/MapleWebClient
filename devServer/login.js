const { parse_string } = require("./util")

function login_handler(data){
    let [account, account_len] = parse_string(data);
    let [password] = parse_string(data.subarray(2 + account_len));
    console.log(account)
    console.log(password)
}

module.exports = {
    login: login_handler
}