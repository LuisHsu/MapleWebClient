const Fs = require("fs/promises");
const Path = require("path");
const { WzJSON } = require("./WzTypes");

function Fixer(in_path, out_path){
    this.in_path = in_path;
    this.out_path = out_path;
}

Fixer.prototype.prepare = function() {
    return Fs.rm(this.out_path, {recursive: true, force: true})
    .then(() => Fs.mkdir(Path.join(this.out_path), {recursive: true}))
    .then(() => Fs.readdir(this.in_path))
}

Fixer.prototype.start = function(paths){
    return paths.filter(path => path.endsWith(".json"))
        .map(path => Fs.readFile(Path.join(this.in_path, path))
            .then(data => JSON.parse(data))
            .then(json => new WzJSON(
                `${Path.parse(this.in_path).name}/${Path.parse(path).name}`,
                this.out_path,
                json
            ))
            .then(json => Fs.writeFile(
                Path.join(this.out_path, Path.basename(path, ".img.json") + ".json"),
                JSON.stringify(json, null, 2)
            ))
        )
}

module.exports = { Fixer }

if(require.main === module){
    const fixer = new Fixer(process.argv[2], process.argv[3])
    fixer.prepare()
    .then(paths => fixer.start(paths))
    .then(proms => Promise.all(proms))
    .then(() => {
        console.log("Finished")
    })
}
