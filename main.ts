import { writeFileSync, mkdirSync, readFileSync } from "node:fs";

const JOKE = "I asked for a raise and got a meeting about asking for a raise.";
const MAX_CHARS = 200;
const OUTPUT_PATH = "/output/entry.txt";

function fail(message: string): never {
  console.error(`entry rejected: ${message}`);
  process.exit(1);
}

function validate(text: string): void {
  const points = Array.from(text);
  if (points.length === 0) {
    fail("entry is empty");
  }
  if (points.length > MAX_CHARS) {
    fail(`entry has ${points.length} characters, over the ${MAX_CHARS} limit`);
  }
  if (text.trim().length === 0) {
    fail("entry is only white space");
  }
  if (/[\r\n]/.test(text)) {
    fail("entry must be a single line");
  }
  if (text !== text.trim()) {
    fail("entry has leading or trailing white space");
  }
}

validate(JOKE);

mkdirSync("/output", { recursive: true });
writeFileSync(OUTPUT_PATH, JOKE, "utf8");

const written = readFileSync(OUTPUT_PATH, "utf8");
if (written !== JOKE) {
  fail("written file does not match the entry text");
}
console.log(`wrote ${Array.from(JOKE).length} characters to ${OUTPUT_PATH}`);
