const fs = require("fs");
const path = require("path");
const jsonc = require("jsonc");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

const projectRoot = path.join(__dirname, "../..");

function updateRushJson(appName, type) {
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
        projectFolder: `${type}/${appName}`,
        reviewCategory: `${type}`,
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

async function rushUpdate(){
  const updateRush = `rush update`;
  try {
    await exec(updateRush);
    console.log("rush update was a success");
  } catch (updateRushStderr) {
    console.error({ updateRushStderr });
  }
}

module.exports = {
  updateRushJson,
  rushUpdate
};
