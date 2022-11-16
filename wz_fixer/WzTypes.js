const Path = require("path");

function WzObject(parent, json){
    this._parent = parent;

    if(json["_dirName"]){
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

function WzJSON(path, json){
    this._path = path;
    WzObject.call(this, null, json);
}
WzJSON.prototype.valueOf = function(){
    let result = {...this};
    delete result["_parent"];
    return result;
}
WzJSON.prototype.toJSON = function(){
    return this.valueOf();
}

function WzDir(parent, json){
    WzObject.call(this, parent, json);
}
WzDir.prototype.valueOf = function(){
    let result = {...this};
    delete result["_parent"];
    delete result["_name"];
    return result;
}
WzDir.prototype.toJSON = function(){
    return this.valueOf();
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
}
WzCanvas.prototype.valueOf = function(){
    let result = {...this};
    delete result["_parent"];
    delete result["_name"];
    return result;
}
WzCanvas.prototype.toJSON = function(){
    return this.valueOf();
}

function WzLink(parent, json){
    WzObject.call(this, parent, json);
    this._link = json["_value"];
}
WzLink.prototype.valueOf = function(){
    return this._link;
}
WzLink.prototype.toJSON = function(){
    return this.valueOf();
}

module.exports = {
    WzJSON,
}