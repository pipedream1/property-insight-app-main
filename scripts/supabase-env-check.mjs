#!/usr/bin/env node
import https from 'node:https';

function log(section, msg){
  console.log(`\n=== ${section} ===\n${msg}`);
}

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;
const issues = [];
if(!url) issues.push('VITE_SUPABASE_URL missing');
else if(!/^https:\/\/.*\.supabase\.co\/?$/.test(url)) issues.push('Supabase URL format invalid');
if(!key) issues.push('VITE_SUPABASE_ANON_KEY missing');
else if(key.length < 60) issues.push('Anon key length suspicious (<60)');

log('ENV VALIDATION', issues.length ? issues.join('\n') : 'OK');

if(issues.length){
  process.exitCode = 1;
} else {
  const endpoint = url.replace(/\/$/,'') + '/rest/v1/';
  log('PING', `GET ${endpoint}`);
  const req = https.get(endpoint, { headers: { apikey: key }}, (res)=>{
    log('PING RESULT', `Status: ${res.statusCode}\nShould be 404 or 200. If no response, network/DNS issue.`);
  });
  req.on('error', (e)=>{
    log('PING ERROR', e.message);
    process.exitCode = 2;
  });
  req.setTimeout(7000, ()=>{ req.destroy(new Error('Timeout after 7s')); });
}
