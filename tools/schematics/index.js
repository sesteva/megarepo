const genSvelte = require("./gen-svelte");
const genE2E = require("./gen-e2e");
const rush = require("./update-rush");
module.exports = {
  genSvelte,
  genE2E,
  rushUpdate: rush.rushUpdate
};
