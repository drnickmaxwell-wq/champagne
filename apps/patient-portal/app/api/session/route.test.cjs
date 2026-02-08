const assert = require("node:assert/strict");
const path = require("node:path");
const { afterEach, test } = require("node:test");

process.env.TS_NODE_PROJECT = path.resolve(
  __dirname,
  "../../../tsconfig.json"
);
process.env.TS_NODE_TRANSPILE_ONLY = "true";

require("ts-node/register/transpile-only");

const {
  getStubCookieOptions,
  isStubAuthEnabled,
  STUB_AUTH_DISABLED_MESSAGE,
  STUB_AUTH_DISABLED_STATUS,
} = require("./stub-auth");

const ORIGINAL_NODE_ENV = process.env.NODE_ENV;

afterEach(() => {
  process.env.NODE_ENV = ORIGINAL_NODE_ENV;
});

test("stub auth is disabled in production", async () => {
  process.env.NODE_ENV = "production";

  assert.equal(isStubAuthEnabled(), false);
  assert.equal(STUB_AUTH_DISABLED_STATUS, 403);
  assert.equal(
    STUB_AUTH_DISABLED_MESSAGE,
    "Stub auth is disabled in production."
  );
  assert.equal(getStubCookieOptions().secure, true);
});

test("stub auth is enabled in development", async () => {
  process.env.NODE_ENV = "development";

  assert.equal(isStubAuthEnabled(), true);
  assert.equal(getStubCookieOptions().secure, false);
});
