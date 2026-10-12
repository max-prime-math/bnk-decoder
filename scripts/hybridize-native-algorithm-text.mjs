#!/usr/bin/env node
// Replace native equation-image fields with the independently decoded
// structural Typst field from the same verified BNK record. Native content remains the
// source of truth everywhere else. This prepares variable-bearing text for the conservative
// algorithm attachment/variant verifier without PDF or OCR.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const [nativeArg, structuralArg, outputArg] = process.argv.slice(2);
if (!nativeArg || !structuralArg || !outputArg) {
  console.error('Usage: node scripts/research/hybridize-native-algorithm-text.mjs <native.pqp.json> <structural.pqp.json> <new-output.pqp.json>');
  process.exit(1);
}
const nativePath = resolve(nativeArg);
const structuralPath = resolve(structuralArg);
const outputPath = resolve(outputArg);
if (existsSync(outputPath)) throw new Error(`Output already exists: ${outputPath}`);
const native = JSON.parse(readFileSync(nativePath, 'utf8'));
const structural = JSON.parse(readFileSync(structuralPath, 'utf8'));
const sourceNumber = (question) => String(question.provenance?.sourceQuestionNumber ?? '').match(/\d+/)?.[0] ?? '';
const structuralByNumber = new Map(structural.questions.map((question) => [sourceNumber(question), question]));
const hasImage = (text) => typeof text === 'string' && text.includes('/imgs/');
const substitutions = [];

function replaceRich(nativeRich, structuralRich, field, evidence) {
  if (!hasImage(nativeRich?.text) || !structuralRich?.text || hasImage(structuralRich.text)) return nativeRich;
  evidence.push({ field, nativeText: nativeRich.text, structuralText: structuralRich.text });
  return { ...nativeRich, format: 'typst', text: structuralRich.text };
}

for (const question of native.questions) {
  const number = sourceNumber(question);
  const decoded = structuralByNumber.get(number);
  const hasAlgorithm = question.extensions?.examview?.sourceRecords?.some((record) => record.algorithmBase64);
  if (!decoded || !hasAlgorithm) continue;
  const evidence = [];
  question.content.stem = replaceRich(question.content.stem, decoded.content.stem, 'stem', evidence);
  question.content.solution = replaceRich(question.content.solution, decoded.content.solution, 'solution', evidence);
  if ((question.content.choices?.length ?? 0) === (decoded.content.choices?.length ?? 0)) {
    const decodedChoices = new Map(decoded.content.choices.map((choice) => [choice.id.toLowerCase(), choice]));
    for (const choice of question.content.choices ?? []) {
      const replacement = decodedChoices.get(choice.id.toLowerCase());
      choice.body = replaceRich(choice.body, replacement?.body, `choice:${choice.id}`, evidence);
    }
  }
  if (!evidence.length) continue;
  question.extensions.examview.algorithmTextSubstitution = {
    status: 'conservative',
    method: 'same-source-record structural Typst replacing native equation-image fields',
    structuralSource: structuralPath,
    fields: evidence,
  };
  substitutions.push({ number, fields: evidence.map((entry) => entry.field) });
}

native.extensions ??= {};
native.extensions.algorithmTextSubstitution = {
  status: 'conservative',
  nativeSource: nativePath,
  structuralSource: structuralPath,
  questions: substitutions.length,
  substitutions,
};
writeFileSync(outputPath, `${JSON.stringify(native, null, 2)}\n`, { flag: 'wx' });
console.log(`Replaced native equation-image fields in ${substitutions.length} question(s).`);
console.log(outputPath);
