import fs from "fs";
import { createClient } from "@supabase/supabase-js";

// Read environment variables directly from .env since we run this as a standalone script
const envStr = fs.readFileSync(".env", "utf8");
const env: Record<string, string> = {};
envStr.split('\n').forEach(line => {
  if (line.trim() === "" || line.startsWith("#")) return;
  const idx = line.indexOf('=');
  if (idx > 0) {
    const key = line.substring(0, idx).trim();
    let val = line.substring(idx + 1).trim();
    // remove quotes if present
    if (val.startsWith('"') && val.endsWith('"')) val = val.substring(1, val.length - 1);
    else if (val.startsWith("'") && val.endsWith("'")) val = val.substring(1, val.length - 1);
    env[key] = val;
  }
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Could not find VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function transliterate(text: string, targetLang: string) {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    const json = await res.json();
    return json[0][0][0];
  } catch (e) {
    return text;
  }
}

async function main() {
  console.log("Connecting to Supabase to fetch villages and people...");

  const { data: villages, error: vError } = await supabase.from('villages').select('*');
  if (vError) throw vError;

  const { data: people, error: pError } = await supabase.from('people').select('*');
  if (pError) throw pError;

  let sql = `-- Missing Translations Update Script\n-- Generated on ${new Date().toISOString()}\n-- Run this in your Supabase SQL Editor to update any missing Urdu or Hindi translations.\n\n`;
  let updatesCount = 0;

  console.log(`Checking ${villages.length} villages for missing translations...`);
  for (const v of villages) {
    let urdu = v.urdu_name;
    let hindi = v.hindi_name;
    let updated = false;

    if (!urdu || urdu.trim() === "") {
      urdu = await transliterate(v.name, 'ur');
      updated = true;
    }
    if (!hindi || hindi.trim() === "") {
      hindi = await transliterate(v.name, 'hi');
      updated = true;
    }

    if (updated) {
      sql += `UPDATE villages SET urdu_name = '${urdu.replace(/'/g, "''")}', hindi_name = '${hindi.replace(/'/g, "''")}' WHERE id = '${v.id}';\n`;
      updatesCount++;
      await new Promise(r => setTimeout(r, 100)); // prevent rate limiting
    }
  }

  console.log(`Checking ${people.length} people for missing translations...`);
  for (const p of people) {
    // Skip placeholder logic/people if they don't strictly need it, but let's just do it for all missing.
    let urdu = p.urdu_name;
    let hindi = p.hindi_name;
    let updated = false;

    if (!urdu || urdu.trim() === "") {
      urdu = await transliterate(p.name, 'ur');
      updated = true;
    }
    if (!hindi || hindi.trim() === "") {
      hindi = await transliterate(p.name, 'hi');
      updated = true;
    }

    if (updated) {
      sql += `UPDATE people SET urdu_name = '${urdu.replace(/'/g, "''")}', hindi_name = '${hindi.replace(/'/g, "''")}' WHERE id = '${p.id}';\n`;
      updatesCount++;
      await new Promise(r => setTimeout(r, 100)); // prevent rate limiting
    }
  }

  if (updatesCount === 0) {
    console.log("No missing translations found! Your database is fully translated.");
  } else {
    fs.writeFileSync("supabase/missing_translations.sql", sql);
    console.log(`Generated supabase/missing_translations.sql with ${updatesCount} UPDATE statements.`);
    console.log("You can now run this SQL file in your Supabase SQL Editor.");
  }
}

main().catch(console.error);
