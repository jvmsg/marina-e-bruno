import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");

function loadEnvLocal() {
  const envPath = join(projectRoot, ".env.local");
  if (!existsSync(envPath)) {
    throw new Error(".env.local not found at project root");
  }
  const content = readFileSync(envPath, "utf8");
  const env = {};
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

function jwtRole(key) {
  try {
    const payload = JSON.parse(
      Buffer.from(key.split(".")[1], "base64url").toString("utf8"),
    );
    return payload.role ?? null;
  } catch {
    return null;
  }
}

function pass(label) {
  console.log(`PASS: ${label}`);
}

function fail(label, message) {
  console.log(`FAIL: ${label}`);
  if (message) console.log(`  ${message}`);
}

function warn(label, message) {
  console.log(`WARN: ${label}`);
  if (message) console.log(`  ${message}`);
}

const REQUIRED_KEYS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
];

const TABLES = ["families", "guests", "gift_items", "gift_orders"];

async function main() {
  console.log("Supabase connectivity test\n");

  let env;
  try {
    env = loadEnvLocal();
    pass("Read .env.local");
  } catch (err) {
    fail("Read .env.local", err.message);
    process.exitCode = 1;
    return;
  }

  for (const key of REQUIRED_KEYS) {
    const value = env[key];
    if (value && value.length > 0) {
      pass(`Env var set: ${key}`);
    } else {
      fail(`Env var set: ${key}`, "Missing or empty");
    }
  }

  const anonRole = jwtRole(env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "");
  const serviceRole = jwtRole(env.SUPABASE_SERVICE_ROLE_KEY ?? "");

  if (anonRole === "anon") {
    pass("Anon key role is 'anon'");
  } else {
    warn("Anon key role", `Expected 'anon', got '${serviceRole ?? "unknown"}'`);
  }

  if (serviceRole === "service_role") {
    pass("Service role key role is 'service_role'");
  } else {
    fail(
      "Service role key role is 'service_role'",
      `Got '${serviceRole ?? "unknown"}'. In Supabase: Settings → API → copy the service_role key (not anon).`,
    );
  }

  if (
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    env.SUPABASE_SERVICE_ROLE_KEY &&
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY === env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    fail(
      "Service role key differs from anon key",
      "Both values are identical — use the separate service_role secret from the dashboard.",
    );
  }

  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.log("\nSkipping Supabase API checks (missing URL or service role key).");
    process.exitCode = 1;
    return;
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  for (const table of TABLES) {
    const { error, count } = await supabase
      .from(table)
      .select("*", { count: "exact", head: true });

    if (error) {
      fail(`Table '${table}'`, error.message);
    } else {
      pass(`Table '${table}' (${count ?? 0} rows)`);
    }
  }

  {
    const { data, error } = await supabase.storage.listBuckets();
    if (error) {
      fail("Storage buckets", error.message);
    } else {
      const bucket = data?.find((b) => b.name === "wedding-photos");
      if (bucket) {
        pass("Storage bucket 'wedding-photos'");
      } else {
        const names = (data ?? []).map((b) => b.name).join(", ") || "(none)";
        fail(
          "Storage bucket 'wedding-photos'",
          `Not found. Available: ${names}`,
        );
      }
    }
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
