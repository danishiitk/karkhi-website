import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

const envStr = fs.readFileSync(".env", "utf8");
const env: Record<string, string> = {};
envStr.split('\n').forEach(line => {
  if (line.trim() === "" || line.startsWith("#")) return;
  const idx = line.indexOf('=');
  if (idx > 0) {
    const key = line.substring(0, idx).trim();
    let val = line.substring(idx + 1).trim();
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

// Utility to escape SQL strings
const escapeSql = (str: string | null | undefined) => {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
};

async function main() {
  console.log("Connecting to Supabase to create a backup...");

  const { data: villages, error: vError } = await supabase.from('villages').select('*').order('created_at', { ascending: true });
  if (vError) throw vError;

  const { data: people, error: pError } = await supabase.from('people').select('*').order('created_at', { ascending: true });
  if (pError) throw pError;

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
  const backupDir = path.join(process.cwd(), 'supabase', 'backups');

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  // 1. Generate Seed SQL
  let sql = `-- Full Database Backup\n-- Generated on ${new Date().toISOString()}\n\n`;
  
  sql += `INSERT INTO villages (id, slug, name, urdu_name, hindi_name, alternate_spellings) VALUES\n`;
  const vValues = villages.map((v: any) => {
    const spellings = v.alternate_spellings ? `ARRAY[${v.alternate_spellings.map((s: string) => escapeSql(s)).join(', ')}]::text[]` : `ARRAY[]::text[]`;
    return `  (${escapeSql(v.id)}, ${escapeSql(v.slug)}, ${escapeSql(v.name)}, ${escapeSql(v.urdu_name)}, ${escapeSql(v.hindi_name)}, ${spellings})`;
  });
  sql += vValues.join(",\n") + "\nON CONFLICT (id) DO NOTHING;\n\n";

  sql += `INSERT INTO people (id, name, urdu_name, hindi_name, father_id, village_id, generation, is_placeholder) VALUES\n`;
  const pValues = people.map((p: any) => {
    return `  (${escapeSql(p.id)}, ${escapeSql(p.name)}, ${escapeSql(p.urdu_name)}, ${escapeSql(p.hindi_name)}, ${escapeSql(p.father_id)}, ${escapeSql(p.village_id)}, ${p.generation !== null ? p.generation : 'NULL'}, ${p.is_placeholder ? 'true' : 'false'})`;
  });
  sql += pValues.join(",\n") + "\nON CONFLICT (id) DO NOTHING;\n";

  const sqlPath = path.join(backupDir, `backup_${timestamp}.sql`);
  fs.writeFileSync(sqlPath, sql);
  console.log(`✅ Saved SQL backup to: ${sqlPath}`);

  // 2. Generate TypeScript file
  let ts = `// Full Database Backup\n// Generated on ${new Date().toISOString()}\n\n`;
  ts += `export const villages = ${JSON.stringify(villages, null, 2)};\n\n`;
  ts += `export const people = ${JSON.stringify(people, null, 2)};\n`;

  const tsPath = path.join(backupDir, `backup_${timestamp}.ts`);
  fs.writeFileSync(tsPath, ts);
  console.log(`✅ Saved TypeScript backup to: ${tsPath}`);

  // 3. Generate CSV files (for Excel)
  // Villages CSV
  if (villages.length > 0) {
    const vHeaders = Object.keys(villages[0]).join(",");
    const vRows = villages.map(v => Object.values(v).map(val => {
      if (Array.isArray(val)) return `"${val.join(',')}"`;
      if (val === null || val === undefined) return "";
      return `"${String(val).replace(/"/g, '""')}"`;
    }).join(",")).join("\n");
    const vCsvPath = path.join(backupDir, `villages_${timestamp}.csv`);
    fs.writeFileSync(vCsvPath, vHeaders + "\n" + vRows);
    console.log(`✅ Saved Villages Excel/CSV backup to: ${vCsvPath}`);
  }

  // People CSV
  if (people.length > 0) {
    const pHeaders = Object.keys(people[0]).join(",");
    const pRows = people.map(p => Object.values(p).map(val => {
      if (val === null || val === undefined) return "";
      return `"${String(val).replace(/"/g, '""')}"`;
    }).join(",")).join("\n");
    const pCsvPath = path.join(backupDir, `people_${timestamp}.csv`);
    fs.writeFileSync(pCsvPath, pHeaders + "\n" + pRows);
    console.log(`✅ Saved People Excel/CSV backup to: ${pCsvPath}`);
  }

  console.log("\n🎉 Backup completed successfully!");
}

main().catch(console.error);
