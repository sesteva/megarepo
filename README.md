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

## Add a depedency to the Svelte App

    cd app/svelte-app
    rush add --package xstate

If any other projects in the repo are using "example-lib", you can update them all to "1.2.3" in bulk:

    cd app/svelte-app
    rush add --package xstate@1.2.3 --make-consistent
