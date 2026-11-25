// Entry for: Make the AI Judge Laugh (office one-liner, blind rounds).
// Contract from RULES.txt: this program writes one UTF-8 text of
// 1..200 characters to /output/entry.txt; a sealed scorer gates it,
// then a judge model compares entries head to head.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// The single line this entry submits. Kept as one constant so the
// artifact bytes are obvious at a glance and never assembled at runtime.
const OFFICE_LINE =
  "I put 'per my last email' in my signature to save typing the threat.";

const ARTIFACT_PATH = "/output/entry.txt";
const MIN_CHARS = 1;
const MAX_CHARS = 200;

// Count Unicode code points, which is how the gate measures length.
function measureLine(text: string): number {
  return [...text].length;
}

// Mirror the sealed scorer's gate locally so a bad line fails here,
// loudly, instead of silently scoring Valid=0 on the server.
// Returns every problem found; an empty list means the line passes.
function collectGateProblems(text: string): string[] {
  const problems: string[] = [];
  const n = measureLine(text);
  if (n < MIN_CHARS) problems.push(`too short: ${n} chars (min ${MIN_CHARS})`);
  if (n > MAX_CHARS) problems.push(`too long: ${n} chars (max ${MAX_CHARS})`);
  if (text.trim().length === 0) problems.push("line is only white space");
  if (/[\r\n]/.test(text)) problems.push("line contains a line break");
  // Round-trip through UTF-8 bytes: a lone surrogate would not survive.
  const roundTripped = Buffer.from(text, "utf8").toString("utf8");
  if (roundTripped !== text) problems.push("line is not clean UTF-8 text");
  return problems;
}

function writeArtifact(text: string): void {
  mkdirSync(dirname(ARTIFACT_PATH), { recursive: true });
  writeFileSync(ARTIFACT_PATH, text, "utf8");
}

function main(): void {
  const problems = collectGateProblems(OFFICE_LINE);
  if (problems.length > 0) {
    throw new Error(`entry line fails the gate: ${problems.join("; ")}`);
  }
  writeArtifact(OFFICE_LINE);
  console.log(`wrote ${measureLine(OFFICE_LINE)} chars to ${ARTIFACT_PATH}`);
}

main();
