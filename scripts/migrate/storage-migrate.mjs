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
  const results = []
  const queue = [''] // prefixes to traverse
  while (queue.length) {
    const prefix = queue.shift()
    // list path prefix
    const { data, error } = await cli.storage.from(bucketName).list(prefix, { limit: 1000 })
    if (error) throw error
    for (const item of data || []) {
      if (item.name === null) continue
      if (item.id && item.metadata && item.updated_at) {
        // File
        const path = prefix ? `${prefix}/${item.name}` : item.name
        results.push(path)
      } else {
        // Folder
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

async function main() {
  console.log('Listing buckets from source project...')
  const { data: buckets, error } = await oldClient.storage.listBuckets()
  if (error) throw error

  for (const bucket of buckets || []) {
    console.log(`\nMigrating bucket: ${bucket.name}`)
    await ensureBucket(newClient, bucket)
    const files = await listAllObjects(oldClient, bucket.name)
    console.log(`Found ${files.length} objects`)
    let i = 0
    for (const f of files) {
      i++
      process.stdout.write(`  [${i}/${files.length}] ${f}    \r`)
      await copyObject(oldClient, newClient, bucket.name, f)
    }
    process.stdout.write('\n')
    console.log(`Bucket ${bucket.name} migration complete.`)
  }
  console.log('\nStorage migration done!')
}

main().catch((e) => {
  console.error('\nMigration failed:', e)
  process.exit(1)
})
