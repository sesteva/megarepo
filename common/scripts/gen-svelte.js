const util = require("util");
const exec = util.promisify(require("child_process").exec);

let args = process.argv.slice(2);

const installApp = `cd apps && pnpx degit sveltejs/template ${args[1]}`;
const cleanApp = `cd apps/${args[1]} && rm .gitignore`;
const setupTS = `cd apps/${args[1]} && node scripts/setupTypeScript.js`;

async function main() {
  const { installStdout, installStderr } = await exec(installApp);
  const { setupTsStdout, setupTsStderr } = await exec(setupTS);
  const { cleanUpStdout, cleanUpStderr } = await exec(cleanApp);

  if (installStderr || setupTsStderr || cleanUpStderr) {
    const error = "" || installStderr || setupTsStderr || cleanUpStderr;
    console.error(`error: ${error}`);
  } else {
    console.log("It was a success");
    console.log(
      "Now please add the app to the 'rush.json' file under the projects array."
    );
    console.log("Finally, run 'rush update'");
  }
}

main();
