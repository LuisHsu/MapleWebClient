const Fs = require("fs/promises");
const Path = require("path");
const { WzJSON } = require("./WzTypes");

function Fixer(in_path, out_path){
    this.in_path = in_path;
    this.out_path = out_path;
}

Fixer.prototype.start = function() {
    return Fs.rm(this.out_path, {recursive: true, force: true})
    .then(() => Fs.mkdir(Path.join(this.out_path), {recursive: true}))
    .then(() => Fs.readdir(this.in_path))
    .then(paths => paths.filter(path => path.endsWith(".json"))
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
    )
    .then(results => Promise.all(results))
}

Fixer.prototype.fix = function(json) {
    return json;
}

const test_fixer = new Fixer(process.argv[2], process.argv[3])
test_fixer.start()
.then(() => {
    console.log("Finished")
})
