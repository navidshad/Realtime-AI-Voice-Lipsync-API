import { terser } from "rollup-plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import dotenv from "dotenv";
import dotenvPlugin from "rollup-plugin-dotenv";
import del from "rollup-plugin-delete";
import typescript from "@rollup/plugin-typescript";
import replace from "@rollup/plugin-replace";
import postcss from "rollup-plugin-postcss";
import tailwindcss from "@tailwindcss/postcss";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import copy from "rollup-plugin-copy";

// Load environment variables from .env file
dotenv.config();

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "development";
}

if (!process.env.NODE_MODE) {
  process.env.NODE_MODE = "dev";
}

const isProductionEnv = process.env.NODE_ENV === "production";
const isDevEnv = !isProductionEnv;

const isBuildMode = process.env.NODE_MODE === "build";
const isDevMode = !isBuildMode;

process.env.ENV_EXAMPLE = isProductionEnv
  ? process.env.ENV_EXAMPLE_PRODUCTION
  : process.env.ENV_EXAMPLE_DEV;

let initialized = false;
const initialize = () => {
  if (!initialized) {
    del({ targets: "dist/*" });
    initialized = true;
  }
};

const commonOutput = {
  format: "iife",
  sourcemap: true,
  strict: false,
};

initialize();

const getVersion = Date.now;

const commonPlugins = [
  {
    name: "clean-dist",
    buildStart() {
      initialize();
    },
  },
  replace({
    preventAssignment: true,
    delimiters: ["", ""],
    values: {
      "'use client';": "",
      "'use strict';": "",
      '"use client";': "",
      '"use strict";': "",
    },
  }),
  replace({
    preventAssignment: true,
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    "process.env.NODE_MODE": JSON.stringify(process.env.NODE_MODE),
    "process.env.OPENAI_API_KEY": JSON.stringify(process.env.OPENAI_API_KEY),
    "process.env.GET_SESSION_DATA_URL": JSON.stringify(
      process.env.GET_SESSION_DATA_URL
    ),

    //In dev mode we have both FE and BE, but in build mode we have just 1 instance app url (based on BE)
    "process.env.APIKA_SERVICE_URL": isDevMode
      ? JSON.stringify(process.env.APIKA_SERVICE_URL)
      : JSON.stringify(process.env.APIKA_APP_URL),
    BUNDLE_VERSION: JSON.stringify(getVersion()),
    //OPENAI_API_KEY: isDevMode ? process.env.OPENAI_API_KEY : "",
  }),
  dotenvPlugin(),
  json(),
  resolve(),
  commonjs(),
  isBuildMode && terser(),
  typescript({
    tsconfig: "./tsconfig.json",
  }),
];

const config = [
  {
    input: "src/bootstrap/_index.tsx",
    output: {
      ...commonOutput,
      file: "dist/apika.js",
      name: "Apika",
    },
    external: ["dotenv"],
    watch: isDevMode
      ? {
          include: "src/**",
          clearScreen: false,
          chokidar: {
            usePolling: true,
          },
        }
      : false,
    plugins: [
      ...commonPlugins,
      copy({
        targets: [{ src: "public/*", dest: "dist" }],
      }),
      isDevMode &&
        serve({
          contentBase: ["dist"],
          port: 3000,
          open: false,
          historyApiFallback: {
            index: "/index.html",
            disableDotRule: true,
          },
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
          proxy: {
            "/api": {
              target: "http://localhost:3030",
              changeOrigin: true,
              secure: false,
              proxyTimeout: 3000,
            },
          },
          verbose: true,
          mimeTypes: {
            "application/javascript": ["js"],
          },
        }),
      isDevMode &&
        livereload({
          watch: "dist",
          verbose: true,
          delay: 1000,
          exts: ["html", "js", "css"],
        }),
      postcss({
        plugins: [tailwindcss()],
        extract: "apika.css",
        modules: false,
        inject: false,
        minimize: isProductionEnv,
      }),
    ].filter(Boolean),
  },
  {
    input: "src/bootstrap/_init.ts",
    output: {
      ...commonOutput,
      file: "dist/init.js",
      name: "ApikaBootstrap",
    },
    external: ["dotenv"],
    plugins: commonPlugins.filter(Boolean),
  },
];

export default config;
