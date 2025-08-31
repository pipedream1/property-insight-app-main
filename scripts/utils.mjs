#!/usr/bin/env node
/**
 * Property Insight Dashboard - Utility Scripts
 * 
 * Common administrative tasks for the dashboard
 * 
 * Usage:
 *   node scripts/utils.mjs <command> [options]
 * 
 * Commands:
 *   health-check    - Test connectivity to Supabase
 *   create-admin    - Create an admin user profile
 *   seed-sources    - Add default water sources
 *   backup-data     - Export data to JSON files
 */

import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, writeFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load environment variables
const envPath = join(__dirname, '../.env.local');
let SUPABASE_URL, SUPABASE_SERVICE_KEY;

try {
  const envContent = readFileSync(envPath, 'utf-8');
  const envLines = envContent.split('\n');
  
  envLines.forEach(line => {
    if (line.startsWith('VITE_SUPABASE_URL=')) {
      SUPABASE_URL = line.split('=')[1];
    }
    if (line.startsWith('VITE_SUPABASE_SERVICE_KEY=')) {
      SUPABASE_SERVICE_KEY = line.split('=')[1];
    }
  });
} catch (error) {
  console.log('Note: Could not load .env.local file. Using environment variables.');
}

// Fallback to environment variables
SUPABASE_URL = SUPABASE_URL || process.env.VITE_SUPABASE_URL;
SUPABASE_SERVICE_KEY = SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing required environment variables:');
  console.error('   VITE_SUPABASE_URL and SUPABASE_SERVICE_KEY');
  console.error('   Set them in .env.local or as environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function healthCheck() {
  console.log('🔍 Testing Supabase connectivity...');
  
  try {
    // Test basic connectivity
    const { data, error } = await supabase
      .from('profiles')
      .select('count(*)')
      .limit(1);
    
    if (error) {
      console.error('❌ Database connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Database connection successful');
    
    // Test water sources table
    const { data: sources, error: sourcesError } = await supabase
      .from('water_sources')
      .select('*')
      .limit(5);
    
    if (sourcesError) {
      console.error('❌ Water sources query failed:', sourcesError.message);
      return false;
    }
    
    console.log(`✅ Water sources: ${sources.length} found`);
    
    return true;
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    return false;
  }
}

async function createAdmin(userId) {
  if (!userId) {
    console.error('❌ User ID required. Get it from Supabase Auth > Users');
    console.log('Usage: node scripts/utils.mjs create-admin <user-uuid>');
    return;
  }
  
  console.log(`🔧 Creating admin profile for user: ${userId}`);
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert([
        { user_id: userId, role: 'admin' }
      ])
      .select();
    
    if (error) {
      console.error('❌ Failed to create admin profile:', error.message);
      return;
    }
    
    console.log('✅ Admin profile created successfully:', data);
  } catch (error) {
    console.error('❌ Error creating admin profile:', error.message);
  }
}

async function seedSources() {
  console.log('🌱 Seeding default water sources...');
  
  const sources = [
    'Borehole 2',
    'Borehole 3', 
    'Borehole 4',
    'Knysna Water'
  ];
  
  try {
    // Insert water sources
    for (const source of sources) {
      const { error } = await supabase
        .from('water_sources')
        .upsert([
          { name: source, is_active: true }
        ], { onConflict: 'name' });
      
      if (error) {
        console.error(`❌ Failed to insert ${source}:`, error.message);
      } else {
        console.log(`✅ ${source} added`);
      }
    }
    
    console.log('✅ Water sources seeding completed');
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
  }
}

async function backupData() {
  console.log('💾 Starting data backup...');
  
  const tables = ['profiles', 'water_sources', 'water_source_aliases', 'water_readings'];
  const backupData = {};
  
  try {
    for (const table of tables) {
      console.log(`📊 Backing up ${table}...`);
      
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error(`❌ Failed to backup ${table}:`, error.message);
        continue;
      }
      
      backupData[table] = data;
      console.log(`✅ ${table}: ${data.length} records`);
    }
    
    // Write to file
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `backup-${timestamp}.json`;
    const filepath = join(__dirname, '../backups', filename);
    
    // Create backups directory if it doesn't exist
    try {
      const { mkdirSync } = await import('fs');
      mkdirSync(join(__dirname, '../backups'), { recursive: true });
    } catch (e) {
      // Directory might already exist
    }
    
    writeFileSync(filepath, JSON.stringify(backupData, null, 2));
    console.log(`✅ Backup saved to: ${filepath}`);
    
  } catch (error) {
    console.error('❌ Backup failed:', error.message);
  }
}

// Main command handler
const command = process.argv[2];
const args = process.argv.slice(3);

switch (command) {
  case 'health-check':
    await healthCheck();
    break;
  
  case 'create-admin':
    await createAdmin(args[0]);
    break;
  
  case 'seed-sources':
    await seedSources();
    break;
  
  case 'backup-data':
    await backupData();
    break;
  
  default:
    console.log('Property Insight Dashboard - Utility Scripts\n');
    console.log('Available commands:');
    console.log('  health-check              - Test connectivity to Supabase');
    console.log('  create-admin <user-uuid>  - Create an admin user profile');
    console.log('  seed-sources              - Add default water sources');
    console.log('  backup-data               - Export data to JSON files');
    console.log('\nUsage:');
    console.log('  node scripts/utils.mjs <command> [options]');
    break;
}
