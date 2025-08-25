#!/usr/bin/env node
// Copies all buckets and objects from one Supabase project to another using service role keys.
// Usage (PowerShell):
//   $env:OLD_SUPABASE_URL="https://old.supabase.co"; $env:OLD_SUPABASE_SERVICE_ROLE_KEY="...";
//   $env:NEW_SUPABASE_URL="https://new.supabase.co"; $env:NEW_SUPABASE_SERVICE_ROLE_KEY="...";
//   node scripts/migrate/storage-migrate.mjs

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

const oldUrl = process.env.OLD_SUPABASE_URL
const oldKey = process.env.OLD_SUPABASE_SERVICE_ROLE_KEY
const newUrl = process.env.NEW_SUPABASE_URL
const newKey = process.env.NEW_SUPABASE_SERVICE_ROLE_KEY

const oldClient = createClient(oldUrl, oldKey)
const newClient = createClient(newUrl, newKey)

async function ensureBucket(newCli, bucket) {
  const { data: buckets } = await newCli.storage.listBuckets()
  const exists = buckets?.some((b) => b.name === bucket.name)
  if (!exists) {
    const { error } = await newCli.storage.createBucket(bucket.name, {
      public: bucket.public,
      fileSizeLimit: bucket.file_size_limit ?? undefined,
      allowedMimeTypes: bucket.allowed_mime_types ?? undefined,
    })
    if (error) throw error
    console.log(`Created bucket: ${bucket.name}`)
  }
}

async function listAllObjects(cli, bucketName) {
  // Returns array of { path, updated_at, size }
  const results = []
  const queue = [''] // prefixes to traverse
  while (queue.length) {
    const prefix = queue.shift()
    const { data, error } = await cli.storage.from(bucketName).list(prefix, { limit: 1000 })
    if (error) throw error
    for (const item of data || []) {
      if (!item || item.name == null) continue
      const isFile = !!(item.id || (item.metadata && (item.metadata.size != null || item.metadata.mimetype)))
      if (isFile) {
        const path = prefix ? `${prefix}/${item.name}` : item.name
        const updated_at = item.updated_at || (item.metadata && item.metadata.lastModified) || null
        const size = (item.metadata && item.metadata.size) || null
        results.push({ path, updated_at: updated_at ? new Date(updated_at) : null, size })
      } else {
        const nextPrefix = prefix ? `${prefix}/${item.name}` : item.name
        queue.push(nextPrefix)
      }
    }
  }
  return results
}

async function copyObject(oldCli, newCli, bucketName, path) {
  const { data, error } = await oldCli.storage.from(bucketName).download(path)
  if (error) throw error
  const arrayBuf = await data.arrayBuffer()
  const { error: upErr } = await newCli.storage.from(bucketName).upload(path, Buffer.from(arrayBuf), { upsert: true })
  if (upErr) throw upErr
}

async function copyObjectWithRetry(oldCli, newCli, bucketName, path, attempts = 3) {
  let delay = 1000
  for (let i = 1; i <= attempts; i++) {
    try {
      await copyObject(oldCli, newCli, bucketName, path)
      return
    } catch (e) {
      const msg = (e && e.message) ? e.message : String(e)
      if (i === attempts) {
        throw new Error(`copy failed after ${attempts} attempts for ${bucketName}/${path}: ${msg}`)
      }
      // Backoff and retry on transient network/storage errors
      const retryable = /ECONNRESET|ETIMEDOUT|fetch failed|network|timeout|429/.test(msg)
      if (!retryable) {
        throw e
      }
      await new Promise((r) => setTimeout(r, delay))
      delay = Math.min(delay * 2, 10000)
    }
  }
}

async function main() {
  console.log('Listing buckets from source project...')
  const { data: buckets, error } = await oldClient.storage.listBuckets()
  if (error) throw error

  for (const bucket of buckets || []) {
    console.log(`\nMigrating bucket: ${bucket.name}`)
    await ensureBucket(newClient, bucket)
    const srcFiles = await listAllObjects(oldClient, bucket.name)
    console.log(`Found ${srcFiles.length} objects in source`)

    // Build a set of existing target objects to enable fast skip
    let existing = []
    try {
      existing = await listAllObjects(newClient, bucket.name)
    } catch (e) {
      // If listing new bucket fails (empty/new), treat as none existing
      existing = []
    }
    const existingMap = new Map(existing.map((o) => [o.path, o]))
    if (existing.length) {
      console.log(`Target already has ${existing.length} objects`)
    }
    let i = 0
    const failed = []
    let copied = 0
    let updated = 0
    let skipped = 0
    for (const f of srcFiles) {
      i++
      const tgt = existingMap.get(f.path)
      if (!tgt) {
        process.stdout.write(`  [${i}/${srcFiles.length}] ${f.path} (copy)   \r`)
        try {
          await copyObjectWithRetry(oldClient, newClient, bucket.name, f.path)
          copied++
        } catch (e) {
          failed.push({ path: f.path, error: (e && e.message) ? e.message : String(e) })
        }
      } else {
        // Compare updated_at if available; if source is newer by >1s, re-upload (upsert)
        const srcTime = f.updated_at ? f.updated_at.getTime() : null
        const tgtTime = tgt.updated_at ? tgt.updated_at.getTime() : null
        if (srcTime != null && tgtTime != null && srcTime > tgtTime + 1000) {
          process.stdout.write(`  [${i}/${srcFiles.length}] ${f.path} (update)   \r`)
          try {
            await copyObjectWithRetry(oldClient, newClient, bucket.name, f.path)
            updated++
          } catch (e) {
            failed.push({ path: f.path, error: (e && e.message) ? e.message : String(e) })
          }
        } else {
          process.stdout.write(`  [${i}/${srcFiles.length}] ${f.path} (skip)   \r`)
          skipped++
        }
      }
    }
    process.stdout.write('\n')
    console.log(`Bucket ${bucket.name} migration complete. Copied: ${copied}, Updated: ${updated}, Skipped: ${skipped}.`)
    if (failed.length) {
      console.log(`\n${failed.length} objects failed to copy. Rerun will retry only these remaining ones.`)
      // Optionally, print a few samples
      for (const sample of failed.slice(0, 5)) {
        console.log(` - ${sample.path}: ${sample.error}`)
      }
    }
  }
  console.log('\nStorage migration done!')
}

main().catch((e) => {
  console.error('\nMigration failed:', e)
  process.exit(1)
})
