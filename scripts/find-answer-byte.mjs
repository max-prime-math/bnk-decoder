#!/usr/bin/env node
import fs from 'fs';
import { unzlibSync } from 'fflate';

const HEADER_LENGTH = 16;

function readFile(path) {
  const buffer = fs.readFileSync(path);
  const bytes = new Uint8Array(buffer);

  if (bytes.length < HEADER_LENGTH || bytes[0] !== 0x1a) {
    throw new Error(`Invalid ExamView file: ${path}`);
  }

  const payload = bytes.slice(HEADER_LENGTH);
  const inflated = unzlibSync(payload);

  return { path, compressed: bytes, inflated, compressedSize: buffer.byteLength };
}

function findDiffingBytes(files) {
  // Find the minimum length across all inflated payloads
  const minLen = Math.min(...files.map(f => f.inflated.length));

  const diffs = [];

  for (let offset = 0; offset < minLen; offset++) {
    const values = files.map(f => f.inflated[offset]);
    const unique = new Set(values);

    // Only flag if there's actual variation
    if (unique.size > 1) {
      diffs.push({
        offset,
        bytes: values.map((v, i) => ({
          label: files[i].path.match(/test-test-bank-([A-D])/)?.[1] || 'unknown',
          value: v,
          hex: '0x' + v.toString(16).padStart(2, '0'),
        })),
      });
    }
  }

  return diffs;
}

function analyzeAnswerPatterns(diffs, files) {
  // For each diffing byte, check if it correlates with answer
  const answers = ['A', 'B', 'C', 'D'];
  const candidates = [];

  for (const diff of diffs) {
    const pattern = {};
    for (let i = 0; i < 4; i++) {
      const label = answers[i];
      pattern[label] = diff.bytes[i].value;
    }

    // Check if values are all different (clean answer encoding)
    const unique = new Set(Object.values(pattern));
    if (unique.size === 4) {
      candidates.push({
        offset: diff.offset,
        pattern,
        spacing: Math.max(...Object.values(pattern)) - Math.min(...Object.values(pattern)),
      });
    }
  }

  return candidates;
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 4) {
    console.error('Usage: node find-answer-byte.mjs test_A.bnk test_B.bnk test_C.bnk test_D.bnk');
    process.exit(1);
  }

  try {
    console.log('Reading and inflating test banks...\n');
    const files = args.map(readFile);

    files.forEach((f, i) => {
      console.log(`${['A', 'B', 'C', 'D'][i]}: ${f.path}`);
      console.log(`  Compressed: ${f.compressedSize} bytes, Inflated: ${f.inflated.length} bytes`);
    });

    console.log('\nFinding differing bytes...\n');
    const diffs = findDiffingBytes(files);
    console.log(`Found ${diffs.length} byte positions with variation.\n`);

    if (diffs.length === 0) {
      console.log('ERROR: No differences found! Files may be identical.');
      process.exit(1);
    }

    // Show first 20 diff positions
    console.log('First 20 differing byte positions:');
    for (let i = 0; i < Math.min(20, diffs.length); i++) {
      const diff = diffs[i];
      console.log(`  Offset 0x${diff.offset.toString(16).padStart(4, '0')}: ${
        diff.bytes.map(b => `${b.label}=${b.hex}`).join(', ')
      }`);
    }

    // Analyze answer patterns
    const candidates = analyzeAnswerPatterns(diffs, files);

    if (candidates.length === 0) {
      console.log('\nNo clean single-byte answer encoding found.');
      console.log('The answer may be encoded across multiple bytes or in a timestamp-dependent location.');
    } else {
      console.log(`\n\n=== STRONG CANDIDATES (all 4 answers have unique values) ===\n`);

      // Sort by spacing (smaller spacing = more likely to be contiguous data)
      candidates.sort((a, b) => a.spacing - b.spacing);

      for (const candidate of candidates.slice(0, 10)) {
        console.log(`Offset 0x${candidate.offset.toString(16).padStart(4, '0')}: spacing=${candidate.spacing}`);
        console.log(`  A: ${candidate.pattern.A} (0x${candidate.pattern.A.toString(16).padStart(2, '0')})`);
        console.log(`  B: ${candidate.pattern.B} (0x${candidate.pattern.B.toString(16).padStart(2, '0')})`);
        console.log(`  C: ${candidate.pattern.C} (0x${candidate.pattern.C.toString(16).padStart(2, '0')})`);
        console.log(`  D: ${candidate.pattern.D} (0x${candidate.pattern.D.toString(16).padStart(2, '0')})`);
        console.log();
      }
    }

    // Show statistics
    console.log(`\n=== SUMMARY ===`);
    console.log(`Total bytes compared: ${files[0].inflated.length}`);
    console.log(`Bytes with variation: ${diffs.length} (${(diffs.length / files[0].inflated.length * 100).toFixed(2)}%)`);
    console.log(`Clean answer candidates: ${candidates.length}`);

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
