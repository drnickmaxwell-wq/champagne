const path = require("node:path");
const repoRoot = path.resolve(__dirname, "..", "..", "..");
process.env.TS_NODE_PROJECT = path.join(repoRoot, "tsconfig.base.json");
require.extensions[".css"] = () => undefined;

require("ts-node").register({
  transpileOnly: true,
  skipProject: false,
  esm: true,
  extensions: [".ts", ".tsx", ".js"],
  compilerOptions: { module: "node16", moduleResolution: "node16", jsx: "react-jsx" },
});
require("tsconfig-paths/register");
require("./guard-cta-contract.cjs");
