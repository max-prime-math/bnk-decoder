#!/usr/bin/env node
// Decode an image to one 8-bit grayscale channel for graph verification. This helper is
// separate because sharp's API is asynchronous while attach-algorithms deliberately keeps
// each question conversion synchronous and fail-closed.
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const input = process.argv[2];
if (!input) process.exit(2);

const require = createRequire(import.meta.url);
const roots = [
  process.env.TEST_GENERATOR_DIR,
  resolve(dirname(fileURLToPath(import.meta.url)), '../../test-generator'),
].filter(Boolean);
let sharp;
try { sharp = require('sharp'); } catch {}
for (const root of roots) {
  if (sharp) break;
  try { sharp = require(resolve(root, 'node_modules/sharp')); } catch {}
}
if (!sharp) process.exit(3);

try {
  const { data, info } = await sharp(input)
    .flatten({ background: '#ffffff' })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  if (info.channels !== 1 || data.length !== info.width * info.height) process.exit(4);
  const header = Buffer.alloc(8);
  header.writeUInt32BE(info.width, 0);
  header.writeUInt32BE(info.height, 4);
  process.stdout.write(Buffer.concat([header, data]));
} catch {
  process.exit(5);
}
