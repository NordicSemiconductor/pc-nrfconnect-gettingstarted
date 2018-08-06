import buble from "rollup-plugin-buble";
import eslint from "rollup-plugin-eslint";
import pkg from "./package.json";

export default [
  {
    input: "src/index.js",
    output: [{ file: pkg.main, format: "cjs", sourcemap: true }],
    plugins: [buble({ transforms: { generator: false } }), eslint()],
    external: ["sander"]
  }
];
