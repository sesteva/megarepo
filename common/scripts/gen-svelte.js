const { genSvelte, genE2E, rushUpdate } = require("../../tools/schematics");
let args = process.argv.slice(2);
const appName = args[1];

async function generate() {
  console.log("gen-svelte process: create app with name: ", args[1]);
  await genSvelte(appName);
  console.log("gen-e2e process: create app-e2e with name: ", `${args[1]}-e2e`);
  await genE2E(appName);
  console.log("installing deps");
  // await rushUpdate();

  console.log("Please run `rush update` at the root of the project");
  console.log("Thats it, happy coding!");
}

generate();
