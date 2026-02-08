import { execSync } from "node:child_process";

const trimLines = (input) =>
  input
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const getChangedReports = () => {
  const output = execSync("git diff --name-only HEAD -- REPORTS", { encoding: "utf8" });
  return trimLines(output);
};

const changedReports = getChangedReports();

if (changedReports.length > 0) {
  console.error("❌ Report outputs changed during this run. Revert REPORTS/* before committing:");
  changedReports.forEach((file) => {
    console.error(` - ${file}`);
  });
  process.exit(1);
}

console.log("✅ Report outputs unchanged.");
