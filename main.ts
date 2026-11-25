import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const ENTRY_TEXT =
  "To: Dad, in the hospital bed by the window\n" +
  "I told you the test results were fine because your hand was shaking, and I have carried that lie ever since.";

function resolveOutputPath(): string {
  const dir = process.env.MAKEFUN_OUTPUT_DIR;
  if (dir && dir.trim() !== "") {
    return join(dir, "entry.txt");
  }
  return join(process.cwd(), "output", "entry.txt");
}

function main(): void {
  const outputPath = resolveOutputPath();
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, ENTRY_TEXT, "utf8");
  const written = readFileSync(outputPath, "utf8");
  if (written !== ENTRY_TEXT) {
    console.error("FAIL: entry.txt is not byte-identical to the intended text");
    process.exit(1);
  }
  const chars = [...ENTRY_TEXT].length;
  const bytes = Buffer.byteLength(ENTRY_TEXT, "utf8");
  const lines = ENTRY_TEXT.split("\n");
  if (chars < 1 || chars > 260) {
    console.error(`FAIL: total ${chars} chars outside 1-260`);
    process.exit(1);
  }
  if (lines.length !== 2 || !lines[0].startsWith("To: ") || lines[1].length > 200) {
    console.error("FAIL: entry must be a To: line plus one message line of at most 200 chars");
    process.exit(1);
  }
  if (ENTRY_TEXT.trim() === "") {
    console.error("FAIL: entry is only whitespace");
    process.exit(1);
  }
  console.log(written);
  console.log(`chars=${chars} bytes=${bytes} toLine=${lines[0].length} messageLine=${lines[1].length}`);
}

main();
