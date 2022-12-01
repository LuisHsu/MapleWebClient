const Fs = require("fs/promises");
const Path = require("path");
const { WzJSON } = require("./WzTypes");
const { Fixer } = require("./Fixer");

function SkinFixer(in_path, out_path){
    Fixer.call(this, in_path, out_path);
}

SkinFixer.prototype = Object.create(Fixer.prototype);
SkinFixer.prototype.constructor = SkinFixer;

SkinFixer.prototype.start = function(paths){
    return paths.filter(path => path.endsWith(".json") && path.startsWith("0000"))
        .map(path => Promise.all([
                Fs.readFile(Path.join(this.in_path, path)),
                Fs.readFile(Path.join(this.in_path, path.replace(/^0000/, "0001")))
            ])
            .then(data => data.map(d => JSON.parse(d)))
            .then(([body_json, head_json]) => [
                new WzJSON(
                    `${Path.parse(this.in_path).name}/${Path.parse(path).name}`,
                    this.out_path,
                    body_json
                ),
                new WzJSON(
                    `${Path.parse(this.in_path).name}/${Path.parse(path.replace(/^0000/, "0001")).name}`,
                    this.out_path,
                    head_json
                )
            ])
            .then(([body_json, head_json]) => {
                body_json["info"]["islot"] += head_json["info"]["islot"];
                body_json["info"]["vslot"] += head_json["info"]["vslot"];
                body_json["info"]["cash"] |= head_json["info"]["cash"];
                delete head_json["info"];
                Object.entries(head_json).filter(([key, _]) => !key.startsWith("_")).forEach(([key, val]) => {
                    if(body_json[key]){
                        Object.entries(val).filter(([key, _]) => !key.startsWith("_"))
                            .forEach(([idx, frame]) => {
                                Object.entries(frame).filter(([key, _]) => !key.startsWith("_"))
                                    .forEach(([part, elem]) => {
                                        body_json[key][idx][part] = elem;
                                    })
                            })
                    }else{
                        body_json[key] = val;
                    }
                })
                return Fs.writeFile(
                    Path.join(this.out_path, Path.basename(path, ".img.json") + ".json"),
                    JSON.stringify(body_json, null, 2)
                )
            })
            // .then(json => Fs.writeFile(
            //     Path.join(this.out_path, Path.basename(path, ".img.json") + ".json"),
            //     JSON.stringify(json, null, 2)
            // ))
        )
}

if(require.main === module){
    const fixer = new SkinFixer(process.argv[2], process.argv[3])
    fixer.prepare()
    .then(paths => fixer.start(paths))
    .then(proms => Promise.all(proms))
    .then(() => {
        console.log("Finished")
    })
}