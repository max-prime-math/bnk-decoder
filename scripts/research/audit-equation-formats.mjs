#!/usr/bin/env node
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { inflateSync } from 'node:zlib';
import { readQuestionRecords } from '../../packages/bnk-core/src/records.ts';

const root = resolve(process.argv[2] ?? 'ExamView/Banks');
const output = process.argv[3] && resolve(process.argv[3]);
const files = [];
function visit(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) visit(path);
    else if (/\.bnk$/i.test(entry.name)) files.push(path);
  }
}
visit(root);

const counts = {}, examples = [];
function describe(node) {
  if (node.type === 'char') return String.fromCharCode(node.code);
  if (node.type === 'variable') return `{${node.name}}`;
  if (node.type === 'format') return `<03:${node.code.toString(16).padStart(2, '0')}>`;
  if (node.type === 'break') return '<br>';
  if (node.type === 'space') return `<space:${node.width}>`;
  if (node.type === 'geometry') return `<geometry:${node.shape}>`;
  return `<template:${node.kind}.${node.variant}>`;
}
function inspect(nodes, context) {
  for (let index = 0; index < nodes.length; index += 1) {
    const node = nodes[index];
    if (node.type === 'format') {
      const code = `0x${node.code.toString(16).padStart(2, '0')}`;
      counts[code] = (counts[code] ?? 0) + 1;
      if (examples.filter(example => example.code === code).length < 20) {
        examples.push({ ...context, code, position: index,
          before: nodes.slice(Math.max(0, index - 10), index).map(describe).join(''),
          after: nodes.slice(index + 1, index + 11).map(describe).join('') });
      }
    }
    if (node.type === 'template') node.slots.forEach((child, slot) => inspect(child, { ...context, template: `${node.kind}.${node.variant}`, slot }));
  }
}

let parsedBanks = 0;
for (const file of files) {
  const bytes = readFileSync(file);
  if (bytes.subarray(0, 16).toString('latin1') !== '\x1aFSCBNK#W#06#00#') continue;
  const bank = readQuestionRecords(inflateSync(bytes.subarray(16)));
  if (!bank) continue;
  parsedBanks += 1;
  for (const record of [...bank.records, ...bank.narratives, ...bank.groups]) {
    for (const block of record.blocks) for (const object of block.objects) if (object.kind === 'equation') {
      inspect(object.nodes, { file: relative(root, file), record: record.number, range: object.range });
    }
  }
}

const result = { root, parsedBanks, counts, examples };
if (output) writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify(result, null, 2));
