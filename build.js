/**
 * build.js — Vercel build-time environment variable injector
 *
 * This script runs automatically on Vercel before the site is served.
 * It reads environment variables set in the Vercel dashboard and injects
 * the real client data into the HTML, replacing the placeholder tokens.
 *
 * Set these in: Vercel Dashboard → Project → Settings → Environment Variables
 */

const fs = require('fs');

const FILES_TO_PROCESS = ['index.html'];

const replacements = {
  // ── Contact ──────────────────────────────────────────────────────────────
  '{{PHONE_TEL}}':      process.env.PHONE_TEL      || '+15550000001',
  '{{PHONE_DISPLAY}}':  process.env.PHONE_DISPLAY  || '+1 (555) 000-0001',
  '{{PHONE_SCHEMA}}':   process.env.PHONE_SCHEMA   || '+1-555-000-0001',
  '{{EMAIL}}':          process.env.EMAIL          || 'contact@example.com',

  // ── Address ───────────────────────────────────────────────────────────────
  '{{ADDRESS_STREET}}':    process.env.ADDRESS_STREET    || '123 Main St',
  '{{ADDRESS_CITY_STATE}}':process.env.ADDRESS_CITY_STATE|| 'Sample City, GA 00000',
  '{{ADDRESS_LOCALITY}}':  process.env.ADDRESS_LOCALITY  || 'Sample City',
  '{{ADDRESS_REGION}}':    process.env.ADDRESS_REGION    || 'GA',
  '{{ADDRESS_POSTAL}}':    process.env.ADDRESS_POSTAL    || '00000',

  // ── Site ──────────────────────────────────────────────────────────────────
  '{{SITE_URL}}':          process.env.SITE_URL          || 'https://example.com/',

  // ── Social & Maps ─────────────────────────────────────────────────────────
  '{{FACEBOOK_URL}}':      process.env.FACEBOOK_URL      || '#',
  '{{INSTAGRAM_URL}}':     process.env.INSTAGRAM_URL     || '#',
  '{{GOOGLE_MAPS_URL}}':   process.env.GOOGLE_MAPS_URL   || '#',
  '{{GOOGLE_MAPS_EMBED}}': process.env.GOOGLE_MAPS_EMBED || 'about:blank',
};

FILES_TO_PROCESS.forEach((file) => {
  if (!fs.existsSync(file)) return;

  let content = fs.readFileSync(file, 'utf8');

  Object.entries(replacements).forEach(([placeholder, value]) => {
    // Use split/join for global replacement without regex escaping issues
    content = content.split(placeholder).join(value);
  });

  fs.writeFileSync(file, content, 'utf8');
  console.log(`✅ Processed: ${file}`);
});

console.log('Build complete — environment variables injected.');
