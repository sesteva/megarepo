const { genSvelte } = require("../../tools/schematics");
let args = process.argv.slice(2);
const appName = args[1];
console.log("gen-svelte process: create app with name", args[1]);
genSvelte(appName);
