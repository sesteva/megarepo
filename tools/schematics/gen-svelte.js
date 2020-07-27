const util = require("util");
const exec = util.promisify(require("child_process").exec);
const fs = require("fs");
const path = require("path");
const { updateRushJson } = require("./update-rush");
const jsonc = require("jsonc");
const projectRoot = path.join(__dirname, "../..");

function updateAppName(appName) {
  return new Promise((resolve, reject) => {
    try {
      const packageJSON = jsonc.parse(
        fs.readFileSync(
          path.join(projectRoot, `/apps/${appName}/package.json`),
          "utf8"
        )
      );

      const updatedPackageJSON = {
        ...packageJSON,
        name: appName,
      };

      fs.writeFileSync(
        path.join(projectRoot, `/apps/${appName}/package.json`),
        jsonc.stringify(updatedPackageJSON, null, "  ")
      );

      resolve();
    } catch (e) {
      throw new Error(e);
    }
  });
}

module.exports = async function genSvelte(name) {
  const appName = name;
  const installApp = `cd apps && pnpx degit sveltejs/template ${appName}`;
  const cleanApp = `cd apps/${appName} && rm .gitignore`;
  const setupTS = `cd apps/${appName} && node scripts/setupTypeScript.js`;

  try {
    const { installStdout, installStderr } = await exec(installApp);
    console.log("creating the app was a success");
  } catch (installStderr) {
    console.error({ installStderr });
  }

  try {
    const { setupTsStdout, setupTsStderr } = await exec(setupTS);
    console.log("setting TS in the app was a success");
  } catch (setupTsStderr) {
    console.error({ setupTsStderr });
  }

  try {
    const { cleanUpStdout, cleanUpStderr } = await exec(cleanApp);
    console.log("cleaning the app was a success");
  } catch (cleanUpStderr) {
    console.error({ cleanUpStderr });
  }

  try {
    await updateAppName(appName);
    console.log("updating package json was a success");
  } catch (error) {
    console.error({ error });
  }

  try {
    await updateRushJson(appName, "apps");
    console.log("updating the monorepo was a success");
  } catch (updateStderr) {
    console.error({ updateStderr });
  }
};
