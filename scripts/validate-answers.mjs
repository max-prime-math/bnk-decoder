#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { reportPath } from './output-paths.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function validateAnswers(jsonFile) {
  if (!fs.existsSync(jsonFile)) {
    console.error(`File not found: ${jsonFile}`);
    process.exit(1);
  }

  let data;
  try {
    data = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
  } catch (e) {
    console.error(`Failed to parse ${jsonFile}: ${e.message}`);
    return null;
  }
  const results = {
    file: path.basename(jsonFile),
    totalQuestions: data.questions.length,
    validation: {
      validAnswers: 0,
      missingAnswers: 0,
      invalidAnswers: 0,
      issues: [],
    },
    distribution: {},
    confidence: {
      perfect: 0,
      good: 0,
      questionable: 0,
    },
  };

  data.questions.forEach((q, idx) => {
    const qNum = idx + 1;

    // Check if answer exists
    if (!q.answer) {
      results.validation.missingAnswers++;
      return;
    }

    // Check answer format
    if (!q.answer.value) {
      results.validation.invalidAnswers++;
      results.validation.issues.push(`Q${qNum}: Empty answer value`);
      return;
    }

    // Handle multiple choice answers
    let answerChoice;
    if (q.answer.format === 'choice') {
      if (!q.choices) {
        results.validation.invalidAnswers++;
        results.validation.issues.push(`Q${qNum}: Answer but no choices`);
        return;
      }

      answerChoice = q.choices.find(c => c.id === q.answer.value);
      if (!answerChoice) {
        results.validation.invalidAnswers++;
        results.validation.issues.push(`Q${qNum}: Answer '${q.answer.value}' not in choices ${q.choices.map(c => c.id).join(',')}`);
        return;
      }
    }
    // Handle numeric/text answers
    else if (q.answer.format === 'text') {
      // Text answers are typically numeric or short-answer
      // Validation: check that value is not empty and reasonable
      if (!q.answer.value || typeof q.answer.value !== 'string') {
        results.validation.invalidAnswers++;
        results.validation.issues.push(`Q${qNum}: Invalid text answer`);
        return;
      }
    } else {
      // Unknown format
      results.validation.invalidAnswers++;
      results.validation.issues.push(`Q${qNum}: Unknown answer format: ${q.answer.format}`);
      return;
    }

    // Valid answer
    results.validation.validAnswers++;

    // Track distribution (only for choice answers)
    if (q.answer.format === 'choice') {
      results.distribution[q.answer.value] = (results.distribution[q.answer.value] || 0) + 1;
    }

    // Confidence assessment
    let confidence = 'perfect';

    // Questionable patterns (only for choice answers)
    if (answerChoice) {
      if (answerChoice.body.text.includes('[embedded') || answerChoice.body.text.includes('[inline')) {
        confidence = 'questionable';
        results.validation.issues.push(`Q${qNum}: Answer choice has unrecovered placeholders`);
      }
    }
    // Multiple answers (duplicate values in choices) - only for choice format
    if (q.answer.format === 'choice' && q.choices.filter(c => c.id === q.answer.value).length > 1) {
      confidence = 'questionable';
      results.validation.issues.push(`Q${qNum}: Duplicate answer choice ID`);
    }

    results.confidence[confidence]++;
  });

  return results;
}

function analyzeDistribution(dist) {
  const values = Object.values(dist);
  const counts = new Map();

  values.forEach(v => {
    counts.set(v, (counts.get(v) || 0) + 1);
  });

  // Check for skewed distribution
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);

  return {
    mean: mean.toFixed(2),
    stdDev: stdDev.toFixed(2),
    distribution: Object.fromEntries(counts),
    isBalanced: stdDev < mean * 0.5, // Good if std dev is small relative to mean
  };
}

// Main
console.log('=== ANSWER KEY VALIDATION ===\n');

const decodedReportsDir = process.argv[2] ?? reportPath('decoded');
const jsonFiles = fs
  .readdirSync(decodedReportsDir)
  .filter(f => f.endsWith('.json') && !f.startsWith('test-'))
  .sort();

const allResults = [];

for (const file of jsonFiles) {
  const fullPath = path.join(decodedReportsDir, file);
  try {
    const result = validateAnswers(fullPath);
    if (!result || result.totalQuestions === 0) continue;

    allResults.push(result);

    const distAnalysis = analyzeDistribution(result.distribution);

    console.log(`\n${result.file}`);
    console.log(`  Total: ${result.totalQuestions} | Valid: ${result.validation.validAnswers} | Missing: ${result.validation.missingAnswers} | Invalid: ${result.validation.invalidAnswers}`);
    console.log(`  Confidence: Perfect ${result.confidence.perfect}, Good ${result.confidence.good}, Questionable ${result.confidence.questionable}`);

    if (Object.keys(result.distribution).length > 0) {
      console.log(`  Distribution: ${JSON.stringify(result.distribution)} (balanced: ${distAnalysis.isBalanced})`);
    }

    if (result.validation.issues.length > 0) {
      console.log(`  Issues: ${result.validation.issues.length}`);
      result.validation.issues.slice(0, 3).forEach(issue => {
        console.log(`    - ${issue}`);
      });
      if (result.validation.issues.length > 3) {
        console.log(`    ... and ${result.validation.issues.length - 3} more`);
      }
    }
  } catch (e) {
    // Skip files that fail to parse
  }
}

// Summary
console.log('\n=== SUMMARY ===\n');
let totalQ = 0, totalValid = 0, totalMissing = 0, totalInvalid = 0;
let totalPerfect = 0, totalGood = 0, totalQuestionable = 0;

allResults.forEach(r => {
  totalQ += r.totalQuestions;
  totalValid += r.validation.validAnswers;
  totalMissing += r.validation.missingAnswers;
  totalInvalid += r.validation.invalidAnswers;
  totalPerfect += r.confidence.perfect;
  totalGood += r.confidence.good;
  totalQuestionable += r.confidence.questionable;
});

console.log(`Total Questions: ${totalQ}`);
console.log(`Valid Answers: ${totalValid} (${Math.round(totalValid / totalQ * 100)}%)`);
console.log(`Missing Answers: ${totalMissing} (${Math.round(totalMissing / totalQ * 100)}%)`);
console.log(`Invalid Answers: ${totalInvalid} (${Math.round(totalInvalid / totalQ * 100)}%)`);
console.log(`\nConfidence Distribution:`);
console.log(`  Perfect: ${totalPerfect}`);
console.log(`  Good: ${totalGood}`);
console.log(`  Questionable: ${totalQuestionable}`);
