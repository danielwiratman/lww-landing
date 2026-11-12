#!/usr/bin/env node
/**
 * Production build.
 *
 * With TinaCloud credentials present (NEXT_PUBLIC_TINA_CLIENT_ID + TINA_TOKEN)
 * this builds the Tina admin against TinaCloud and lets Next.js read content
 * from the hosted API.
 *
 * Without them it falls back to building against the content files in
 * ./content, so the site still deploys. The CMS at /admin will only become
 * editable once the credentials are added to the host.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import { buildLocal } from './build-local.mjs';

if (fs.existsSync('.env')) {
  try {
    process.loadEnvFile('.env');
  } catch {
    // Older Node: the Tina CLI still reads .env itself.
  }
}

const hasCloudCredentials = Boolean(process.env.NEXT_PUBLIC_TINA_CLIENT_ID && process.env.TINA_TOKEN);

if (hasCloudCredentials) {
  const tina = spawnSync(process.execPath, ['node_modules/@tinacms/cli/bin/tinacms', 'build', '--datalayer-port', '9100'], {
    stdio: 'inherit',
    env: process.env,
  });
  if (tina.status !== 0) process.exit(tina.status ?? 1);

  const next = spawnSync(process.execPath, ['node_modules/next/dist/bin/next', 'build'], { stdio: 'inherit', env: process.env });
  process.exit(next.status ?? 1);
}

console.warn(
  [
    '',
    '  ! NEXT_PUBLIC_TINA_CLIENT_ID / TINA_TOKEN are not set.',
    '  ! Building from the content files in ./content instead of TinaCloud.',
    '  ! The site will deploy, but /admin will not be editable until the',
    '  ! credentials are added to the host environment.',
    '',
  ].join('\n')
);

process.exit(await buildLocal());
