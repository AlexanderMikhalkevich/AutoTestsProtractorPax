const { spawn } = require("child_process");
const { createWriteStream } = require("fs");
const { K6Parser } = require("k6-to-junit");
const parser = new K6Parser();
const profile = require('./profiles/performance')[process.argv.slice(2)[0]]

const file = profile.file;
const envToSetup = profile.env;

let envStr = "";
for (let key in envToSetup) {
    envStr += ` -e ${key}=${envToSetup[key]}`;
    console.log(`ENV: ${key}=${envToSetup[key]}`);
}

let child  = spawn("k6",["run", envStr, file], { shell: true});
child.stdout.on('data', function(data) {
    console.log(data.toString());
});

parser.pipeFrom(child.stdout).then(() => {
    const writer = createWriteStream("../junit.xml");
    parser.toXml(writer);
    writer.end();
    writer.once('finish', () => {
        process.exit(parser.allPassed() ? 0 : 99);
    });
});
