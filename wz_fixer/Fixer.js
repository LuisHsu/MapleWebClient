const Fs = require("fs/promises");
const Path = require("path");
const { WzJSON } = require("./WzTypes");

function Fixer(in_path, out_path){
    this.in_path = in_path;
    this.out_path = out_path;
    this.run = fixer_run.bind(this);
}


function fixer_run(){
    return Fs.readdir(this.in_path)
    .then(paths => paths.filter(path => path.endsWith(".json")))
    .then(paths => paths.map(path => Fs.readFile(Path.join(this.in_path, path))
        .then(data => JSON.parse(data))
        .then(json => new WzJSON(
            `${this.in_path}/${Path.parse(this.in_path).name}/${Path.parse(path).name}/${Path.parse(path).name}`,
            json
        ))
    ))
    .then(proms => Promise.all(proms))
}

const test_fixer = new Fixer(process.argv[2], process.argv[3])
test_fixer.run()
.then(stats => {
    return Fs.writeFile("stats.json", JSON.stringify(stats, null, 2))
    .then(() => {
        console.log("Finished")
    })
})