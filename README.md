## Setup

Prerequisites

- Node v 12-14
- NVM (nvm install --lts) https://github.com/nvm-sh/nvm#nvmrc
- Yarn or NPM or Pnpm

## Setup - Step 1

If you are using this project as your boilerplate, either clone the repo

    git clone sesteva/megarepo company
    cd company

OR

    pnpx degit sesteva/megarepo company

If this is your company's repo, simply clone it.

## Setup - Step 2

Setup the correct version of Node inside the project's folder

    nvm use

or for example

    nvm alias default 12.8

Install PNPM and RUSHJS

    yarn global add pnpm @microsfot/rush

Install deps

    rush update

## Tips

VS Code highlights JSON comments as errors by default, but it provides an optional “JSON with comments” mode. To enable this, add this line to your settings.json in VS Code:

        "files.associations": { "*.json": "jsonc" }

Install Svelte VSCode extension and code snippets

## Things you should know

1. The project is setup to make sure all projects use the same version of the libraries.
   There is a way to provide exceptions via configuration.

2. Avoid using npm or yarn or pnpm directly. Instead using rush cli.

## Dev Workflows

## Working with shared UI, Storybook, Svelte App and Svelte App E2E

The practice of TDD requires as to run our unit tests continuosly.
What if we would like to take the same approach on different tools?

Having our shared component rebuild automatically is a must have. This removes friction if we want to create a reusable component as there is not additional repo or cognitive change cost.

If we change or create a reusable component, we might want to have Storybook with live reload so we can visualize variations.

It would be fantastic if we know we have not broken any of the essentials flows of the app.
Having E2E tests continously running with Cypress console might come useful.

In order to do it, a single command at the root of the project is all we need:

        rush dev

if you would like to create additional flows, checkout the 'common/config/rush/command-line.json' and the documentation https://rushjs.io/pages/configs/command-line_json/

## Start only the Svelte App

    cd app/svelte-app
    rushx dev

## Working on the shared UI core component and Storybook

Terminal 1:

    cd tools/storybook
    rushx dev

Terminal 2:

    cd libs/ui-core
    rushx dev

if you would like to create a flow, checkout the 'common/config/rush/command-line.json' and the documentation https://rushjs.io/pages/configs/command-line_json/

## Add a depedency to the Svelte App

    cd app/svelte-app
    rush add --package xstate

If any other projects in the repo are using "example-lib", you can update them all to "1.2.3" in bulk:

    cd app/svelte-app
    rush add -p xstate@1.2.3 --make-consistent

Note we have used the the shorthand -p instead of --package

If you need a devDep, add --dev flag

## Update a dependency

Same process as adding a dependency

## Create a new svelte app

    rush gen-svelte --name myapp

Behind the scenres:

- This will create a new app inside the app's folder using the svelte/template boilerplate.
- Then it will clean up unncessary files such as .gitignore.
- Transform the project to support Typescript.
- It will also generate an E2E project using Cypress
- It will update rush.json to include the new app and the E2E project.

Once it is done, please run `rush update` to install all deps.

Until we automate this, you need to make two small changes on your apps

In package.json

- update dev script adding `-p 5001` , choose a unique port per app
- update rollup config livereload to add new port per app `!production && livereload({ watch: "public", port: 35730 }),`

## Create a new sapper app

    rush gen-sapper --name myapp

This project already supports Typescript and Tailwind. It also has cypress already installed.

Behind the scenres:

- This will create a new app inside the app's folder using the sesteva/sapper-app boilerplate.
- Then it will clean up unncessary files such as .gitignore.
- It will update rush.json to include the new app and the E2E project.

Once it is done, please run `rush update` to install all deps.

Until we automate this, you need to make two small changes on your apps

In package.json

- update dev script adding `-p 5001` , choose a unique port per app
- update rollup config livereload to add new port per app `!production && livereload({ watch: "public", port: 35730 }),`

TODO: remove cypress from template and add it like other apps via gen-e2e in the custom commands.
This gives more flexibility on how to create these apps.

## Create a new angular app

[TODO]

## Create a new nextjs app

[TODO]

## Create a new svelte lib

[TODO]

## Common Problems

### Linking of a new package doesnt work

Make sure you have defined the version number in both package.json files.

    rush update --full

### Weird unkown situation

    rush purge
    rush update --full

## Additional Info on the Monorepo tooling

https://rushjs.io
https://rushstack.io/pages/contributing/get_started/

## Suggestions ? Conventions ?

Use HSL insted of HEX to define colors

## TODO

- choose versions when generating projects
- jest testing library svelte
- use TS for everything (example I should be able to see options values for Flex component )
- form validation with Yup
- add angular app - add to commands as proxy to angular cli?
- Eslint config https://www.npmjs.com/package/@rushstack/eslint-config
- CI setup https://rushjs.io/pages/maintainer/enabling_ci_builds/
- folder tools/templates with command to generate new component, new app
