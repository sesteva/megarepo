## Setup

Prerequisites

- Node v 12-14
- Yarn or NPM

Install PNPM and RUSHJS

    yarn global add pnpm @microsfot/rush

Clone the repo

    git clone securonix-rush
    cd securonix-rush

Install deps

    rush update

## Start the Svelte App

    cd app/svelte-app
    rushx dev

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
