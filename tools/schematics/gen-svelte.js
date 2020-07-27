const util = require("util");
const exec = util.promisify(require("child_process").exec);
const fs = require("fs");
const path = require("path");
const jsonc = require("jsonc");
let appName = "";

const projectRoot = path.join(__dirname, "../..");

function updateRushJson() {
  return new Promise((resolve, reject) => {
    // get rush.json
    const rushJSON = jsonc.parse(
      fs.readFileSync(path.join(projectRoot, "rush.json"), "utf8")
    );

    // update projects
    rushJSON.projects = [
      ...rushJSON.projects,
      {
        packageName: `${appName}`,
        projectFolder: `apps/${appName}`,
        reviewCategory: "app",
      },
    ];

    // Update rush.json back
    fs.writeFileSync(
      path.join(projectRoot, "rush.json"),
      jsonc.stringify(rushJSON, null, "  ")
    );

    resolve();
  });
}

module.exports = async function genSvelte(name) {
  appName = name;
  const installApp = `cd apps && pnpx degit sveltejs/template ${appName}`;
  const cleanApp = `cd apps/${appName} && rm .gitignore`;
  const setupTS = `cd apps/${appName} && node scripts/setupTypeScript.js`;
  const updateRush = `rush update`;

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
    await updateRushJson();
    console.log("updating the monorepo was a success");
  } catch (updateStderr) {
    console.error({ updateStderr });
  }

  try {
    const { updateRushStdout, updateRushStderr } = await exec(updateRush);
    console.log("rush update was a success");
  } catch (updateRushStderr) {
    console.error({ updateRushStderr });
  }
};
