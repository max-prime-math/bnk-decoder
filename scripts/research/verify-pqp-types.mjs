// Check generated package shapes against the repository's actual PQP TypeScript model.
// Arbitrary extensions and binary string contents are excluded from the type proof;
// image digests and references are checked by native conversion and corpus validation.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
const directory = process.argv[2];
if (!directory) throw new Error('Supply a directory of PQP files.');
const files = readdirSync(directory).filter(name => name.endsWith('.pqp.json'));
const packages = files.map(name => JSON.parse(readFileSync(join(directory, name), 'utf8')));
const proof = packages.map(pqp => JSON.stringify(pqp, (key, value) => key === 'extensions' ? {} : key === 'base64' ? 'binary-contents-verified-separately' : value)).map(pqp => `accepts(${pqp});`).join('\n');
writeFileSync('.tools/pqp-type-proof.ts', "import type { PortableQuestionPackage } from '../packages/bnk-core/src/index.ts';\nfunction accepts<T extends PortableQuestionPackage>(value: T): void {}\n" + proof);
writeFileSync('.tools/pqp-type-proof.tsconfig.json', JSON.stringify({ extends: './verify-core.tsconfig.json', include: ['./pqp-type-proof.ts'] }));
const result = spawnSync(process.execPath, ['node_modules/typescript/bin/tsc', '-p', '.tools/pqp-type-proof.tsconfig.json'], { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
if (result.status !== 0) { console.error(result.stdout + result.stderr); process.exit(1); }
console.log(`${files.length} PQP package shapes conform to the repository's PortableQuestionPackage interface.`);
