import fs from "node:fs";

const text = fs.readFileSync(
  "C:/Users/João Gomes/Projects/wedding-site/tmp-guests.txt",
  "utf8",
);

const lines = text
  .split(/\r?\n/)
  .map((l) => l.trim())
  .filter((l) => l && !/^Lista de Convidados/i.test(l));

const entries = [];
let current = null;
for (const line of lines) {
  const m = line.match(/^(\d+)\.\s*(.*)$/);
  if (m) {
    if (current) entries.push(current);
    current = { num: Number(m[1]), raw: m[2].trim(), notes: [] };
  } else if (current) {
    current.notes.push(line);
  }
}
if (current) entries.push(current);

// Detect family groups from original blank-line structure
const blocks = text
  .split(/\n\s*\n+/)
  .map((b) => b.trim())
  .filter(Boolean)
  .filter((b) => !/^Lista de Convidados/i.test(b));

const familyBlocks = [];
for (const block of blocks) {
  const nums = [...block.matchAll(/^(\d+)\./gm)].map((m) => Number(m[1]));
  if (nums.length) familyBlocks.push(nums);
}

console.log("entries", entries.length);
console.log("family blocks", familyBlocks.length);
console.log(JSON.stringify(familyBlocks, null, 2));
console.log("--- sample entries ---");
for (const e of entries.slice(0, 8)) {
  console.log(e.num, "|", e.raw, "| notes:", e.notes);
}
console.log("--- problematic ---");
for (const e of entries.filter(
  (e) =>
    /perguntar|\?|filha|—\s*$|^$|neném|menor|não conta/i.test(
      `${e.raw} ${e.notes.join(" ")}`,
    ) || !e.raw,
)) {
  console.log(e.num, "|", e.raw, "|", e.notes);
}
