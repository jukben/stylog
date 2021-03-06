import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import path from "path";
import pkg from "./package.json";

process.env.NODE_ENV = "production";

const createConfig = ({ umd = false, output } = {}) => ({
  input: "src/index.js",
  output,
  plugins: [resolve(), commonjs(), babel(), umd && terser()].filter(Boolean)
});

export default [
  createConfig({
    output: [
      { file: pkg.main, format: "cjs" },
      { file: pkg.module, format: "es" }
    ]
  }),
  createConfig({
    umd: true,
    output: {
      file: pkg.unpkg,
      format: "umd",
      name: "stylog"
    }
  })
];
