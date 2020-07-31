const { genSvelte, genE2E, rushUpdate } = require("../../tools/schematics");
let args = process.argv.slice(2);
const appName = args[1];

async function generate() {
  console.log("gen-svelte process: create app with name: ", args[1]);
  await genSvelte(appName);
  console.log("gen-e2e process: create app-e2e with name: ", `${args[1]}-e2e`);
  await genE2E(appName);
  console.log("installing deps");

  // TODO: make rush update work
  // await rushUpdate();
  // TODO: note or automate start script to add -p 5001 5002 5003
  // TODO: note or automate update rollup config livereload to add new port  !production && livereload({ watch: "public", port: 35730 }),
  console.log("Please run `rush update` at the root of the project");
  console.log(
    "Please update package.json's dev script to add -p 5001 5002 5003"
  );
  console.log(
    'Please update update rollup config livereload to add new port  !production && livereload({ watch: "public", port: 35730 }),'
  );
  console.log("Thats it, happy coding!");
}

generate();
