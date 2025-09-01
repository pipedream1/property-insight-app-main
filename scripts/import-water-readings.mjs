#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

// Usage:
// set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in env
// npm run import:water -- "C:\\Users\\Lee Normand\\Downloads\\water_readings_rows (1)(in).csv"

function parseArgs() {
  const args = process.argv.slice(2);
  const fileArg = args.find(a => !a.startsWith('--'));
  const dryRun = args.includes('--dry-run') || args.includes('-n');
  if (!fileArg) {
    console.error('CSV path required. Example: npm run import:water -- "C:\\path\\to\\file.csv" [--dry-run]');
    process.exit(1);
  }
  return { filePath: path.resolve(fileArg), dryRun };
}

function parseDateFlexible(s) {
  if (!s) return null;
  // ISO or ISO-like
  if (/^\d{4}-\d{2}-\d{2}T/.test(s)) {
    const d = new Date(s);
    return isNaN(d) ? null : d.toISOString();
  }
  // YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    return new Date(s + 'T00:00:00Z').toISOString();
  }
  // DD/MM/YYYY
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(s)) {
    const [dd, mm, yyyy] = s.split('/');
    const d = new Date(`${yyyy}-${mm}-${dd}T00:00:00Z`);
    return isNaN(d) ? null : d.toISOString();
  }
  // MM/DD/YYYY
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(s)) {
    const [mm, dd, yyyy] = s.split('/');
    const m = String(mm).padStart(2, '0');
    const d = String(dd).padStart(2, '0');
    const dt = new Date(`${yyyy}-${m}-${d}T00:00:00Z`);
    return isNaN(dt) ? null : dt.toISOString();
  }
  // YYYY/MM/DD
  if (/^\d{4}\/\d{2}\/\d{2}$/.test(s)) {
    const [yyyy, mm, dd] = s.split('/');
    const d = new Date(`${yyyy}-${mm}-${dd}T00:00:00Z`);
    return isNaN(d) ? null : d.toISOString();
  }
  // Fallback
  const d = new Date(s);
  return isNaN(d) ? null : d.toISOString();
}

function detectDelimiter(line) {
  if (line.includes(',')) return ',';
  if (line.includes(';')) return ';';
  if (line.includes('\t')) return '\t';
  return ',';
}

function parseCsv(content) {
  const lines = content.split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return { headers: [], rows: [] };
  const delimiter = detectDelimiter(lines[0]);
  const headers = lines[0].split(delimiter).map(h => h.trim());
  const rows = lines.slice(1).map(line => {
    const cols = line.split(delimiter);
    const obj = {};
    headers.forEach((h, i) => { obj[h] = (cols[i] ?? '').trim(); });
    return obj;
  });
  return { headers, rows };
}

async function main() {
  const { filePath, dryRun } = parseArgs();
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars');
    process.exit(1);
  }
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

  const content = fs.readFileSync(filePath, 'utf8');
  const { headers, rows } = parseCsv(content);
  if (headers.length === 0 || rows.length === 0) {
    console.error('CSV appears empty.');
    process.exit(1);
  }

  // Expect CSV headers to match the water_readings table columns.
  // Required minimum: component_type, reading, date
  const required = ['component_type','reading','date'];
  for (const r of required) {
    if (!headers.includes(r)) {
      console.error(`CSV missing required column: ${r}`);
      process.exit(1);
    }
  }

  // Prepare rows and stats
  const prepared = rows.map((r, idx) => {
    const readingNum = r.reading === '' ? null : Number(r.reading);
    const ts = parseDateFlexible(r.date || r.reading_date || r.created_at);
    return {
      _row: idx + 1,
      component_type: r.component_type?.trim() || null,
      component_name: (r.component_name || r.component_type || null)?.trim() || null,
      reading: readingNum,
      date: ts,
      comment: r.comment?.trim() || null,
    };
  });

  const invalidNoType = prepared.filter(x => !x.component_type);
  const invalidNoReading = prepared.filter(x => x.reading == null || Number.isNaN(x.reading));
  const invalidBadDate = prepared.filter(x => !x.date);
  const valid = prepared.filter(x => x.component_type && x.reading != null && !Number.isNaN(x.reading) && x.date);

  if (dryRun) {
    console.log('--- Dry Run Summary ---');
    console.log(`Total CSV rows: ${rows.length}`);
    console.log(`Valid rows to insert: ${valid.length}`);
    console.log(`Skipped (no component_type): ${invalidNoType.length}`);
    console.log(`Skipped (missing/NaN reading): ${invalidNoReading.length}`);
    console.log(`Skipped (unparseable date): ${invalidBadDate.length}`);
    const sample = valid.slice(0, 3);
    if (sample.length) {
      console.log('Sample rows to insert (first 3):');
      console.dir(sample, { depth: null });
    }
    const sampleBad = [...invalidNoType.slice(0,1), ...invalidNoReading.slice(0,1), ...invalidBadDate.slice(0,1)];
    if (sampleBad.length) {
      console.log('Sample skipped rows:');
      console.dir(sampleBad, { depth: null });
    }
    console.log('No data inserted (dry run). Use without --dry-run to perform the import.');
    return;
  }

  // Batch insert in chunks to avoid payload limits
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < valid.length; i += chunkSize) {
    const chunk = valid.slice(i, i + chunkSize).map(({ _row, ...rest }) => rest);
    if (chunk.length === 0) continue;
    const { error, count } = await supabase
      .from('water_readings')
      .insert(chunk, { count: 'exact' });
    if (error) {
      console.error('Insert error:', error.message);
      process.exit(1);
    }
    total += count ?? chunk.length;
    console.log(`Inserted ${count ?? chunk.length} rows (total ${total})...`);
  }

  console.log(`Done. Inserted approximately ${total} rows.`);
}

main().catch(e => { console.error(e); process.exit(1); });
