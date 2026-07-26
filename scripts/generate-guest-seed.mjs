import fs from "node:fs";

const text = fs.readFileSync(
  "C:/Users/João Gomes/Projects/wedding-site/tmp-guests.txt",
  "utf8",
);

const SKIP_NUMBERS = new Set([
  24, // "Perguntar sobre a Júlia" — not a confirmed guest
  106, // "Filha da esposa" — unnamed
  130, // empty
]);

const EXTRA_GUESTS_BY_ANCHOR = {
  // Notes that look like unnumbered adult companions
  90: [{ fullName: "Gustavo", phone: "" }],
};

const FEMALE_HINTS =
  /^(elieth|marília|maria|angelina|aurea|bernadete|dione|pâmela|pamela|aline|emily|neiva|silvia|djanira|ludmila|thais|ivete|giovanna|beatriz|keith|alice|elisete|lívia|livia|letícia|leticia|francisca|luiza|gabriela|sabrina|isabela|anna|dayane|isabel|debora|débora|tania|tânia|stephany|lara|luiza|inacilda|fátima|fatima|fabiana|carla|karla|renata|mayara|bruna|larissa|lucia|lúcia|ines|ines|ingrid|helenice|juliana|geisa|claudia|cláudia|camila|gabi|cleonice|aldine|cora|tereza|bia|maite|conceição|franciele|evelyn|roberta|joelma|aparecida|lucinda|cristina|chaiane|chaiene)$/i;

const MALE_HINTS =
  /^(inácio|inacio|joão|joao|victor|joaquim|pedro|marcos|leonardo|paulo|alcides|renan|rodrigo|luiz|henrique|alaor|simão|simao|gilmar|gustavo|benedito|larielson|weriks|claudinei|lucas|gabriel|munari|carlos|francisco|felipe|zezinho|nivaldo|pablo|adriano|juan|claudio|alex|matheus|enzo|fio|ubirajara|giovanni|rafael|andre|andré|severo|anderson|anderon|jean|ricardo|peterson|fabiano|sebastiao|sebastião|dimas|oliveira)$/i;

function sqlString(value) {
  return `'${String(value).replace(/'/g, "''")}'`;
}

function cleanName(raw) {
  return raw
    .replace(/—/g, "")
    .replace(/\?+/g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*-\s*$/g, "")
    .trim();
}

function extractPhoneAndName(raw) {
  let working = raw.trim();

  // Trailing dash used as "no phone"
  const noPhone = /—\s*$/.test(working) || /—\s*$/.test(working.replace(/\?+/g, ""));
  working = working.replace(/—/g, " ").trim();

  // Phone patterns: (12) 98126-3518 | (12)981263518 | 12 99165-1132 | 12 98879 - 9311
  const phoneMatch = working.match(
    /(?:\(?\s*(\d{2})\s*\)?\s*)([\d][\d\s\-]*\d)\s*$/,
  );

  let phone = "";
  let namePart = working;

  if (phoneMatch) {
    const ddd = phoneMatch[1];
    const rest = phoneMatch[2].replace(/\D/g, "");
    // Only treat as phone if remaining digits look like BR local numbers
    if (rest.length >= 8 && rest.length <= 9) {
      phone = `55${ddd}${rest}`;
      namePart = working.slice(0, phoneMatch.index).trim();
    }
  }

  if (noPhone && !phone) {
    phone = "";
  }

  let fullName = cleanName(namePart)
    .replace(/\(\s*idade\s*\??\s*\)/gi, "")
    .trim();

  // Normalize parenthetical nicknames: "Vantilde (Tico )" -> "Vantilde (Tico)"
  fullName = fullName
    .replace(/\(\s*([^)]+?)\s*\)/g, "($1)")
    .replace(/\s+/g, " ")
    .trim();

  // Fix known uncertain labels
  if (/^namo da lívia$/i.test(fullName)) {
    fullName = "Namorado da Lívia";
  }
  if (/namorado da ludmilla/i.test(namePart)) {
    fullName = "Rodrigo";
  }

  return { fullName, phone };
}

function splitName(fullName) {
  // Keep nickname with first name, never as last_name
  const nicknameMatch = fullName.match(/\(([^)]+)\)/);
  const nickname = nicknameMatch?.[1]?.trim() ?? "";
  const base = fullName.replace(/\([^)]+\)/g, "").replace(/\s+/g, " ").trim();

  const parts = base.split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return { first_name: nickname || "Convidado", last_name: "" };
  }

  let first_name;
  let last_name = "";

  if (parts.length === 1) {
    first_name = parts[0];
  } else {
    let splitAt = parts.length - 1;
    while (splitAt > 0 && /^(da|de|do|das|dos|e)$/i.test(parts[splitAt - 1])) {
      splitAt -= 1;
    }
    first_name = parts.slice(0, splitAt).join(" ");
    last_name = parts.slice(splitAt).join(" ");
  }

  if (nickname) {
    first_name = `${first_name} (${nickname})`;
  }

  return { first_name, last_name };
}

function guessGender(fullName) {
  const firstToken = fullName
    .replace(/\(.*?\)/g, "")
    .trim()
    .split(/\s+/)[0];
  if (!firstToken) return "other";
  if (FEMALE_HINTS.test(firstToken)) return "female";
  if (MALE_HINTS.test(firstToken)) return "male";
  // Common endings
  if (/a$/i.test(firstToken) && !/^(costa|silva|frança|franca)$/i.test(firstToken)) {
    return "female";
  }
  return "other";
}

// Parse numbered entries
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

const byNum = new Map(entries.map((e) => [e.num, e]));

// Family blocks from blank-line grouping in the PDF text
const blocks = text
  .split(/\n\s*\n+/)
  .map((b) => b.trim())
  .filter(Boolean)
  .filter((b) => !/^Lista de Convidados/i.test(b));

const familyNumberGroups = [];
for (const block of blocks) {
  const nums = [...block.matchAll(/^(\d+)\./gm)].map((m) => Number(m[1]));
  if (nums.length) familyNumberGroups.push(nums);
}

function familyDisplayName(guests) {
  const names = guests.map((g) => g.first_name.split(/\s+/)[0]);
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} & ${names[1]}`;
  return `${names[0]} & família`;
}

const families = [];
const warnings = [];

for (const nums of familyNumberGroups) {
  const guests = [];

  for (const num of nums) {
    if (SKIP_NUMBERS.has(num)) {
      warnings.push(`Skipped #${num}: ${byNum.get(num)?.raw ?? "(empty)"}`);
      continue;
    }

    const entry = byNum.get(num);
    if (!entry) {
      warnings.push(`Missing entry #${num}`);
      continue;
    }

    const { fullName, phone } = extractPhoneAndName(entry.raw);
    if (!fullName) {
      warnings.push(`Skipped empty name #${num}`);
      continue;
    }

    // Skip if the "name" is clearly a note
    if (/^perguntar\b/i.test(fullName)) {
      warnings.push(`Skipped note #${num}: ${fullName}`);
      continue;
    }

    const { first_name, last_name } = splitName(fullName);
    const gender = guessGender(fullName);

    const childNotes = entry.notes.filter((n) =>
      /menor|neném|nenem|não conta|nao conta/i.test(n),
    );
    if (childNotes.length) {
      warnings.push(
        `Family note under #${num} (not inserted as guest): ${childNotes.join("; ")}`,
      );
    }

    guests.push({
      source_num: num,
      first_name,
      last_name,
      phone,
      gender,
      fullName,
    });

    const extras = EXTRA_GUESTS_BY_ANCHOR[num] ?? [];
    for (const extra of extras) {
      const split = splitName(extra.fullName);
      guests.push({
        source_num: num,
        first_name: split.first_name,
        last_name: split.last_name,
        phone: extra.phone,
        gender: guessGender(extra.fullName),
        fullName: extra.fullName,
        extra: true,
      });
      warnings.push(`Added companion from note under #${num}: ${extra.fullName}`);
    }
  }

  if (guests.length) {
    families.push({
      display_name: familyDisplayName(guests),
      guests,
    });
  }
}

const out = [];
out.push(`-- Seed guests from "Lista de Convidados-.pdf"`);
out.push(`-- Generated ${new Date().toISOString().slice(0, 10)}`);
out.push(`-- Families: ${families.length}`);
out.push(
  `-- Guests: ${families.reduce((n, f) => n + f.guests.length, 0)}`,
);
out.push(`--`);
out.push(`-- Phone format: 55 + DDD + number (digits only), empty string when unknown.`);
out.push(`-- Lookup works when a family member with a phone confirms presence.`);
out.push(`--`);
out.push(`-- Review warnings before running:`);
for (const w of warnings) out.push(`-- - ${w}`);
out.push(`-- - #5 Maria da Conceição phone from PDF looks short (8 digits after DDD 89): verify 558999256205`);
out.push(`-- - Last family group (#124–129) may need manual split if they are not one household`);
out.push(``);
out.push(`begin;`);
out.push(``);
out.push(`-- Optional: clear existing invite list first (uncomment if re-seeding)`);
out.push(`-- delete from public.guests;`);
out.push(`-- delete from public.families;`);
out.push(``);

for (const family of families) {
  out.push(`-- Family: ${family.display_name}`);
  out.push(`with inserted as (`);
  out.push(
    `  insert into public.families (display_name)`,
  );
  out.push(
    `  values (${sqlString(family.display_name)})`,
  );
  out.push(`  returning id`);
  out.push(`)`);
  out.push(`insert into public.guests (family_id, first_name, last_name, phone, gender, rsvp_status)`);
  out.push(`select inserted.id, g.first_name, g.last_name, g.phone, g.gender::guest_gender, 'pending'::rsvp_status`);
  out.push(`from inserted`);
  out.push(`cross join (`);
  out.push(`  values`);

  const valueLines = family.guests.map((g, i) => {
    const comma = i < family.guests.length - 1 ? "," : "";
    return `    (${sqlString(g.first_name)}, ${sqlString(g.last_name)}, ${sqlString(g.phone)}, ${sqlString(g.gender)})${comma} -- #${g.source_num}${g.extra ? " (+note)" : ""} ${g.fullName}`;
  });
  out.push(valueLines.join("\n"));
  out.push(`) as g(first_name, last_name, phone, gender);`);
  out.push(``);
}

out.push(`commit;`);
out.push(``);
out.push(`-- Quick checks`);
out.push(`-- select count(*) as families from public.families;`);
out.push(`-- select count(*) as guests from public.guests;`);
out.push(`-- select count(*) as with_phone from public.guests where phone <> '';`);
out.push(`-- select f.display_name, g.first_name, g.last_name, g.phone`);
out.push(`-- from public.guests g join public.families f on f.id = g.family_id`);
out.push(`-- order by f.display_name, g.first_name;`);

const sqlPath = "C:/Users/João Gomes/Projects/wedding-site/supabase/seed_guests.sql";
fs.writeFileSync(sqlPath, out.join("\n"), "utf8");

console.log(`Wrote ${sqlPath}`);
console.log(`Families: ${families.length}`);
console.log(
  `Guests: ${families.reduce((n, f) => n + f.guests.length, 0)}`,
);
console.log(
  `With phone: ${families.reduce((n, f) => n + f.guests.filter((g) => g.phone).length, 0)}`,
);
console.log("Warnings:");
for (const w of warnings) console.log(" -", w);

// Spot-check a few phones
const sample = families.flatMap((f) => f.guests).filter((g) => g.phone).slice(0, 8);
console.log("Sample phones:", sample.map((g) => `${g.fullName}=${g.phone}`));
