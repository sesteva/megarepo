const { genSapper, rushUpdate } = require("../../tools/schematics");
let args = process.argv.slice(2);
const appName = args[1];

async function generate() {
  console.log("gen-sapper process: create app with name: ", args[1]);
  await genSapper(appName);
  // TODO: make rush update work
  // console.log("installing deps");
  // await rushUpdate();
  // TODO: note or automate start script to add -p 5001 5002 5003
  // TODO: note or automate update rollup config livereload to add new port  !production && livereload({ watch: "public", port: 35730 }),
  console.log("Please run `rush update` at the root of the project");
  console.log(
    "Please update package.json's adding `PORT 5001` right before `sapper dev` , choose a unique port per app"
  );
  console.log(
    'Please update update rollup config livereload to add new port  !production && livereload({ watch: "public", port: 35730 }),'
  );
  console.log("Thats it, happy coding!");
}

generate();
