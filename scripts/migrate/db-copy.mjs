#!/usr/bin/env node
// Copies rows from selected tables from one Supabase project to another using service role keys.
// Configure tables in scripts/migrate/tables.json (or pass a path via TABLES_CONFIG env).
// PowerShell usage example:
//   $env:OLD_SUPABASE_URL="https://old.supabase.co"; $env:OLD_SUPABASE_SERVICE_ROLE_KEY="...";
//   $env:NEW_SUPABASE_URL="https://new.supabase.co"; $env:NEW_SUPABASE_SERVICE_ROLE_KEY="...";
//   node scripts/migrate/db-copy.mjs

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const configPath = process.env.TABLES_CONFIG || path.join(__dirname, 'tables.json')

const required = [
  'OLD_SUPABASE_URL',
  'OLD_SUPABASE_SERVICE_ROLE_KEY',
  'NEW_SUPABASE_URL',
  'NEW_SUPABASE_SERVICE_ROLE_KEY',
]

const missing = required.filter((k) => !process.env[k])
if (missing.length) {
  console.error('Missing environment variables: ' + missing.join(', '))
  process.exit(1)
}

if (!fs.existsSync(configPath)) {
  console.error(`Missing tables config: ${configPath}. Copy tables.example.json to tables.json and edit.`)
  process.exit(1)
}

/** @type {{ tables: Array<{ name: string, chunkSize?: number }> }} */
const { tables } = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
if (!Array.isArray(tables) || tables.length === 0) {
  console.error('tables.json must contain a non-empty "tables" array')
  process.exit(1)
}

const oldCli = createClient(process.env.OLD_SUPABASE_URL, process.env.OLD_SUPABASE_SERVICE_ROLE_KEY)
const newCli = createClient(process.env.NEW_SUPABASE_URL, process.env.NEW_SUPABASE_SERVICE_ROLE_KEY)

async function copyTable(tableName, chunkSize = 1000) {
  console.log(`\nMigrating table: ${tableName}`)

  // Count total
  const { count, error: countErr } = await oldCli.from(tableName).select('*', { count: 'exact', head: true })
  if (countErr) throw new Error(`Count failed for ${tableName}: ${countErr.message}`)
  console.log(`Total rows: ${count}`)

  let offset = 0
  let copied = 0
  while (true) {
    const { data, error } = await oldCli
      .from(tableName)
      .select('*')
      .range(offset, offset + chunkSize - 1)

    if (error) throw new Error(`Select failed for ${tableName}: ${error.message}`)
    if (!data || data.length === 0) break

    const { error: upErr } = await newCli.from(tableName).upsert(data, { onConflict: undefined })
    if (upErr) throw new Error(`Upsert failed for ${tableName}: ${upErr.message}`)

    copied += data.length
    offset += data.length
    process.stdout.write(`  Copied ${copied}/${count} rows\r`)
  }
  process.stdout.write('\n')
  console.log(`Table ${tableName} migration complete.`)
}

async function main() {
  console.log('Starting DB copy...')
  for (const t of tables) {
    await copyTable(t.name, t.chunkSize || 1000)
  }
  console.log('\nDB copy done!')
}

main().catch((e) => {
  console.error('\nDB copy failed:', e)
  process.exit(1)
})
