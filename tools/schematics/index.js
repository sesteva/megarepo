const genSvelte = require("./gen-svelte");
const genE2E = require("./gen-e2e");
const genSapper = require("./gen-sapper");
const rush = require("./update-rush");
module.exports = {
  genSvelte,
  genE2E,
  genSapper,
  rushUpdate: rush.rushUpdate,
};
