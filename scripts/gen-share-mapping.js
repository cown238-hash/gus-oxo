#!/usr/bin/env node
/**
 * Generate a share mapping CSV (old domain -> new domain) from Vercel Blob.
 * Usage: node scripts/gen-share-mapping.js [BLOB_TOKEN]
 * Or:    BLOB_READ_WRITE_TOKEN=xxx node scripts/gen-share-mapping.js
 */

const fs = require('fs');
const path = require('path');
const { list } = require('@vercel/blob');

const BLOB_TOKEN = process.argv[2] || process.env.BLOB_READ_WRITE_TOKEN;
const OLD_DOMAIN = 'rosantoscs1997.com';
const NEW_DOMAIN = 'www.wksl.site';

if (!BLOB_TOKEN) {
  console.error('❌  Need BLOB_READ_WRITE_TOKEN');
  console.error('   Usage: node scripts/gen-share-mapping.js <token>');
  console.error('   Or: BLOB_READ_WRITE_TOKEN=xxx node scripts/gen-share-mapping.js');
  process.exit(1);
}

/** Walk every page of the `shares/` prefix and collect the share ids. */
async function fetchShareIds() {
  const ids = [];
  let cursor;

  do {
    const result = await list({ prefix: 'shares/', cursor, token: BLOB_TOKEN });
    for (const blob of result.blobs) {
      if (!blob.pathname.endsWith('.json')) continue;
      ids.push(blob.pathname.slice('shares/'.length, -'.json'.length));
    }
    cursor = result.hasMore ? result.cursor : undefined;
  } while (cursor);

  return ids;
}

async function main() {
  try {
    console.log('📡 Fetching share list from Vercel Blob...');
    const ids = await fetchShareIds();

    if (ids.length === 0) {
      console.log('⚠️  No shares found');
      return;
    }

    const rows = ids.map((id) => ({
      old_url: `https://${OLD_DOMAIN}/s/${id}`,
      new_url: `https://${NEW_DOMAIN}/s/${id}`,
    }));

    const csv = [
      'old_url,new_url',
      ...rows.map((r) => `${r.old_url},${r.new_url}`),
    ].join('\n');

    const outPath = path.join(__dirname, '..', 'share-mapping.csv');
    fs.writeFileSync(outPath, csv, 'utf8');

    console.log(`✅ Generated ${rows.length} mappings → ${outPath}`);
    console.log('\nFirst 5:');
    rows.slice(0, 5).forEach((r) => console.log(`  ${r.old_url} → ${r.new_url}`));
    if (rows.length > 5) console.log(`  ... and ${rows.length - 5} more`);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

main();
