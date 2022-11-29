const Path = require("path");
const Crypto = require("crypto");
const { readFileSync, copyFileSync } = require("fs");

function WzObject(parent, json){
    this._parent = parent;

    if(json["_dirName"] !== undefined){
        this._name = json["_dirName"];
        delete json["_dirName"];
    }
    
    function resolve_object(key, val){
        const dir_type = `${val["_dirType"]}`;
        delete val["_dirType"];
        switch(dir_type){
            case "sub":
                this[key] = new WzDir(this, val);
                break;
            case "int":
            case "short":
                this[key] = new WzNumber(this, val);
                break;
            case "vector":
                this[key] = new WzVector(this, val);
                break;
            case "string":
                this[key] = new WzString(this, val);
                break;
            case "canvas":
                this[key] = new WzCanvas(this, val);
                break;
            case "uol":
                this[key] = new WzLink(this, val);
                break;
        }
    }

    Object.entries(json).forEach(([key, val]) => resolve_object.call(this, key, val));
}

function WzJSON(path, out_path, json){
    this._path = path.split(Path.sep);
    this._out = out_path;
    WzObject.call(this, null, json);
}
WzJSON.prototype.toJSON = function(){
    let result = {...this};
    delete result["_parent"];
    delete result["_path"];
    delete result["_out"];
    return result;
}

function WzDir(parent, json){
    WzObject.call(this, parent, json);
}
WzDir.prototype.toJSON = function(){
    let result = {...this};
    delete result["_parent"];
    delete result["_name"];
    return result;
}

function WzNumber(parent, json){
    WzObject.call(this, parent, json);
    this._value = json["_value"];
}
WzNumber.prototype.valueOf = function(){
    return this._value;
}
WzNumber.prototype.toJSON = function(){
    return this.valueOf();
}

function WzVector(parent, json){
    WzObject.call(this, parent, json);
    this._value = [json["_x"], json["_y"]];
}
WzVector.prototype.valueOf = function(){
    return this._value;
}
WzVector.prototype.toJSON = function(){
    return this.valueOf();
}

function WzString(parent, json){
    WzObject.call(this, parent, json);
    this._value = json["_value"];
}
WzString.prototype.valueOf = function(){
    return this._value;
}
WzString.prototype.toJSON = function(){
    return this.valueOf();
}

function WzCanvas(parent, json){
    WzObject.call(this, parent, json);
    this.size = [json["_width"], json["_height"]];
    this.layer = this.z;
    delete this.z;
    this.image = `${this._name}.png`;
    // Get image path
    for(let cursor = this._parent; cursor; cursor = cursor._parent){
        if(cursor instanceof WzDir){
            this.image = `${cursor._name}.${this.image}`;
        }else if(cursor instanceof WzJSON){
            const file_path = cursor._path.reduce(
                (path, elem) => path + (elem + Path.sep).repeat(2), ""
            ) + this.image;
            this.hash = Crypto.createHash("md5").update(readFileSync(file_path)).digest().toString('hex');
            copyFileSync(file_path, Path.join(cursor._out, this.hash + ".png"));
        }
    }
}
WzCanvas.prototype.toJSON = function(){
    let result = {...this};
    delete result["_parent"];
    delete result["_name"];
    return result;
}

function WzLink(parent, json){
    WzObject.call(this, parent, json);
    this._link = json["_value"];
}
WzLink.prototype.toJSON = function(){
    return this._link;
}

module.exports = {
    WzJSON,
}