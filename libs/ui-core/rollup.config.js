import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import sveltePreprocess from "svelte-preprocess";
import typescript from "@rollup/plugin-typescript";
// import injectProcessEnv from "rollup-plugin-inject-process-env";
import pkg from "./package.json";
const preprocessOptions = require("./svelte.config").preprocessOptions;
const production = !process.env.ROLLUP_WATCH;

function typeCheck() {
  return {
    writeBundle() {
      require("child_process").spawn("svelte-check", {
        stdio: ["ignore", "inherit", "inherit"],
        shell: true,
      });
    },
  };
}

const name = pkg.name
  .replace(/^(@\S+\/)?(svelte-)?(\S+)/, "$3")
  .replace(/^\w/, (m) => m.toUpperCase())
  .replace(/-\w/g, (m) => m[1].toUpperCase());

export default {
  input: "src/index.ts",
  output: [
    { file: pkg.module, format: "es" },
    { file: pkg.main, format: "umd", name }, //browser friendly
  ],
  plugins: [
    svelte({
      // enable run-time checks when not in production
      dev: !production,
      // we'll extract any component CSS out into
      // a separate file - better for performance
      css: (css) => {
        css.write("dist/bundle.css");
      },
      preprocess: sveltePreprocess({
        ...preprocessOptions,
        sourceMap: !production,
      }),
    }),
    resolve({
      browser: true,
      dedupe: ["svelte"],
    }),
    typescript({ sourceMap: !production }),
    commonjs(),
    // need to inject for xstate only BUT it creates a problem when lib is imported from global storybook
    // injectProcessEnv({
    //   NODE_ENV: production ? "production" : "development",
    // }),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
  ],
};
