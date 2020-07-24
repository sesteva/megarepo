## Setup

Prerequisites

- Node v 12-14
- NVM (nvm install --lts) https://github.com/nvm-sh/nvm#nvmrc
- Yarn or NPM

Install PNPM and RUSHJS

    nvm use
    yarn global add pnpm @microsfot/rush

Clone the repo

    git clone securonix-rush
    cd securonix-rush

Install deps

    rush update

## Start the Svelte App

    cd app/svelte-app
    rushx dev

## Working on the shared UI core component and Storybook

    cd tools/storybook
    rushx start

    cd libs/ui-core
    rushx build:watch

    TODO: create command to do it automatically

## Working on the Svelte App, live reloading shared components changes and running the E2E continously

    TODO

## Things you should know

1. The project is setup to make sure all projects use the same version of the libraries.
   There is a way to provide exceptions via configuration.

2. Avoid using npm or yarn or pnpm directly. Instead using rush cli.

## Add a depedency to the Svelte App

    cd app/svelte-app
    rush add --package xstate

If any other projects in the repo are using "example-lib", you can update them all to "1.2.3" in bulk:

    cd app/svelte-app
    rush add -p xstate@1.2.3 --make-consistent

Note we have used the the shorthand -p instead of --package

If you need a devDep, add --dev flag

## Common Problems

### Linking of a new pakcage wont work

Make sure you have defined the version number in both package.json files.

    rush update --full

## Additional Info on the Monorepo tooling

https://rushjs.io
https://rushstack.io/pages/contributing/get_started/

## TODO

- e2e project
- jest testing library svelte
- create custom command to build watch and start storybook
- create custom command to run app and e2e
- use TS for everything
- Eslint config https://www.npmjs.com/package/@rushstack/eslint-config
- CI setup https://rushjs.io/pages/maintainer/enabling_ci_builds/
