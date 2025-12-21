const Module = require("module");
const path = require("path");

const originalResolveFilename = Module._resolveFilename;
Module._resolveFilename = function patchedResolve(request, parent, ...rest) {
  if (request === "@champagne/cta/CTARegistry") {
    return path.join(__dirname, "../packages/champagne-cta/src/CTARegistry.ts");
  }
  if (request === "../champagne-cta/src/CTARegistry") {
    return path.join(__dirname, "../packages/champagne-cta/src/CTARegistry.ts");
  }
  if (request === "../champagne-manifests/src/helpers") {
    return path.join(__dirname, "../packages/champagne-manifests/src/helpers.ts");
  }
  if (request === "../champagne-manifests/src/core") {
    return path.join(__dirname, "../packages/champagne-manifests/src/core.ts");
  }
  return originalResolveFilename.call(this, request, parent, ...rest);
};

const tsConfig = require("../tsconfig.base.json");

require("ts-node").register({
  project: "tsconfig.base.json",
  transpileOnly: true,
  preferTsExts: true,
  compilerOptions: {
    module: "CommonJS",
    moduleResolution: "node",
    jsx: "react-jsx",
  },
});

require("tsconfig-paths").register({
  baseUrl: __dirname + "/..",
  paths: tsConfig.compilerOptions.paths,
  extensions: [".ts", ".tsx", ".js"],
});


require("./generate-mid-cta-hygiene-report.ts");
