const util = require("util");
const exec = util.promisify(require("child_process").exec);
const { updateRushJson } = require("./update-rush");
const fs = require("fs");
const path = require("path");
const jsonc = require("jsonc");

const projectRoot = path.join(__dirname, "../..");

const defaultPackageJson = {
  name: "",
  version: "1.0.0",
  description: "",
  main: "index.js",
  scripts: {
    dev: "cypress open",
    "cy:run": "cypress run",
  },
  author: "",
  license: "ISC",
  devDependencies: {
    cypress: "~4.11.0",
  },
};

function initRepo(appName) {
  return new Promise((resolve, reject) => {
    const packageJSON = {
      ...defaultPackageJson,
      name: appName,
    };

    fs.writeFileSync(
      path.join(projectRoot, `/e2e/${appName}/package.json`),
      jsonc.stringify(packageJSON, null, "  ")
    );

    resolve();
  });
}

module.exports = async function genSvelte(name) {
  appName = name + "-e2e";
  const createApp = `cd e2e && mkdir ${appName}`;  

  try {
    await exec(createApp);
    console.log("creating the app e2e was a success");
    await initRepo(appName);
    console.log("creating the app e2e was a success");
    await updateRushJson(appName, "e2e");
    console.log("updating the monorepo was a success");
  } catch (error) {
    console.error({ error });
  }
};
