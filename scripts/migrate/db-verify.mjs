#!/usr/bin/env node
// Compares row counts per table between OLD and NEW Supabase projects.
// Requires env: OLD_SUPABASE_URL, OLD_SUPABASE_SERVICE_ROLE_KEY,
//               NEW_SUPABASE_URL, NEW_SUPABASE_SERVICE_ROLE_KEY
// Usage (PowerShell):
//   node scripts/migrate/db-verify.mjs

import fs from 'node:fs'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'

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

const oldClient = createClient(process.env.OLD_SUPABASE_URL, process.env.OLD_SUPABASE_SERVICE_ROLE_KEY)
const newClient = createClient(process.env.NEW_SUPABASE_URL, process.env.NEW_SUPABASE_SERVICE_ROLE_KEY)

const tablesPath = path.resolve('scripts/migrate/tables.json')
const tablesFile = JSON.parse(fs.readFileSync(tablesPath, 'utf8'))
const tables = (Array.isArray(tablesFile) ? tablesFile : tablesFile.tables?.map(t => t.name) || [])
if (!tables.length) {
  console.error('No tables found in scripts/migrate/tables.json')
  process.exit(1)
}

async function countRows(client, table) {
  const { count, error } = await client
    .from(table)
    .select('*', { count: 'exact', head: true })
  if (error) throw error
  return count ?? 0
}

async function main() {
  console.log('Verifying row counts (OLD vs NEW) ...')
  const rows = []
  for (const t of tables) {
    try {
      const [oc, nc] = await Promise.all([
        countRows(oldClient, t),
        countRows(newClient, t),
      ])
      rows.push({ table: t, old: oc, new: nc, diff: oc - nc })
    } catch (e) {
      rows.push({ table: t, old: 'ERR', new: 'ERR', diff: 'ERR', error: (e && e.message) ? e.message : String(e) })
    }
  }

  // Print a compact report
  for (const r of rows) {
    if (r.error) {
      console.log(`${r.table.padEnd(24)} old=ERR new=ERR note=${r.error}`)
    } else {
      const tag = r.diff === 0 ? 'OK' : (r.diff > 0 ? 'MISSING' : 'EXTRA')
      console.log(`${r.table.padEnd(24)} old=${String(r.old).padEnd(6)} new=${String(r.new).padEnd(6)} diff=${String(r.diff).padEnd(6)} ${tag}`)
    }
  }
}

main().catch((e) => {
  console.error('Verification failed:', e)
  process.exit(1)
})
