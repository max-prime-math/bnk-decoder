# BNK Decoder

https://max-prime-math.github.io/bnk-decoder/

Standalone Svelte app and shared TypeScript packages for decoding ExamView BNK files.

## Shared Interchange Format

This repo is part of a larger workspace that is converging on a shared JSON interchange format: the **Portable Question Package (PQP)**.

- Canonical spec: [`../PORTABLE_QUESTION_PACKAGE.md`](../PORTABLE_QUESTION_PACKAGE.md)
- Machine-readable schema: [`../shared-question-package.schema.json`](../shared-question-package.schema.json)

`bnk-decoder` is the natural place for the shared model to mature because it already exposes framework-neutral packages and typed question structures. The intended export surface is:

- PQP JSON as the common interchange format
- Typst export
- LaTeX export where it is useful and source fidelity permits

PQP is designed to preserve:

- decoded question text and choices
- answer and solution data
- embedded assets
- diagnostics and decode confidence
- curriculum metadata and forward-compatible extensions

## Decoder Direction

The decoder should stay structural-first. Avoid hardcoded content patches for specific questions unless they are temporary probes that will be removed after the underlying binary structure is understood.

Start here for the working policy:

- [`DECODER_DIRECTION.md`](./DECODER_DIRECTION.md)
- [`BINARY_STRUCTURE_ANALYSIS.md`](./BINARY_STRUCTURE_ANALYSIS.md)
- [`ROADMAP.md`](./ROADMAP.md)
- [`NEXT_STEPS.md`](./NEXT_STEPS.md)

## Current Grade 12 / TestGen Bridge Snapshot

The active Grade 12 Pre-Calculus work is tracked in [`NEXT_STEPS.md`](./NEXT_STEPS.md), [`ALGORITHM_AND_GRAPH_EXTRACTION_PLAN.md`](./ALGORITHM_AND_GRAPH_EXTRACTION_PLAN.md), and [`EXAMVIEW_GRAPHS_AND_ALGORITHMS_IMPLEMENTATION_CHECKLIST.md`](./EXAMVIEW_GRAPHS_AND_ALGORITHMS_IMPLEMENTATION_CHECKLIST.md).

As of the 2026-06-14 Grade 12 pass:

- The decoder emits `test-generator-question-bank` v2 JSON for the TestGen app instead of only a raw draft-question array.
- TestGen exports include stored-question-shaped records, decoder diagnostics, `customClasses` built from recovered or user-entered curriculum, and embedded image bytes encoded as base64 package assets.
- Questions carry curriculum metadata where recoverable: stable `classId`, chapter-derived `unitId`/`unitName`, section-derived `sectionId`, topic-derived `sectionName`, and tags for ExamView, topic, difficulty, reference, and title keywords.
- Graph models preserve function/relation objects plus point and number-line ray objects. TestGen can import and retain this structure, but native graph rendering is still pending.
- Algorithm models are preserved for TestGen. TestGen owns per-question variant calculation through its seeded `Calculate values` UI; the decoder's job is to preserve definitions, sample values, diagnostics, and source expressions.
- The PDF audit path is available through `npm run audit:pdf -- <decoded-json-dir> <pdf-dir> [out-json]` and should be used as the readiness gate because internal "clean" quality scores are not semantic parity checks.

Known readiness gaps:

- Graph objects are imported as data, not yet rendered as ExamView-style graph visuals.
- OLE/MathType and WMF-style embedded math/picture objects still need deeper structural decoding or a clearly documented fallback.

## Status: ALPHA (Early Development) 🔧

**Current Decoder State:** ~75% functional with significant issues

### Working Features
- ✅ ExamView v06 BNK format detection
- ✅ Basic question extraction (77/81 for Chapter 01)
- ✅ Multiple choice parsing
- ✅ Matching question composite structure (Chapter 01 working)
- ✅ Binary-backed narrative recovery (`narr1`..`narr6`) with per-question attachment
- ✅ Algorithmic variable extraction
- ✅ Metadata filtering (variables assignments as fake questions)
- ✅ JSON and Typst export formats

### Critical Issues (Blocking Release)
- ❌ **Binary Format Runs:** Widespread subscript/underline corruption (~40% of questions affected)
  - Patterns like "geo$m_etric" (should be "geometric"), "compu$t_e$r" (should be "computer")
  - Root cause: Format run positions or attributes incorrectly interpreted from binary
  - Impact: Makes ~60+ questions difficult to read

- ❌ **Embedded Objects:** 16 unresolved placeholders across chapters
  - [embedded object], [DIAGRAM NEEDED], [embedded value]
  - Impact: Incomplete question text

- ❌ **Malformed Fragments:** Questions like "a) Since t1 = 3 and r = P, P b) P"
  - Likely due to incorrect chunk boundaries in non-metadata section
  - Impact: 5-10 questions per chapter are unusable

### Known Limitations
- Type classification off (MCQ +1, Short Answer -13, Problem +8 for Ch01)
- Only Chapter 01 narrative linkage verified end-to-end; Ch02-Ch09 not yet validated for narrative coverage
- ExamView v05 format: Not supported
- OLE equation objects: Not implemented

## Packages

- `packages/bnk-core`: framework-neutral decode/export/adapters API.
- `packages/question-model`: shared question and draft question types.
- `app`: standalone BNK decoder UI.

## Development

```sh
npm install
npm run dev
npm run check
npm run build
```

## Testing

```sh
# Decode a single file
npm run decode:file -- "path/to/file.bnk"

# Output appears in reports/decoded/
```

## Recent Achievements

- **Image Asset Integration** (2026-05-14): All embedded images detected, extracted, and linked to questions (v06 byte-range overlap + fallback distribution)
- **Embedded Object Recovery** (2026-05-14): 12 semantic recovery strategies, 99.6% coverage
- **Narrative Recovery** (2026-05-15): Binary narrative catalog discovered in Chapter 01; question records now attach the correct shared preamble from the `narr1`..`narr6` table instead of guessing from body text
- **Answer Key Extraction**: All question answers via binary offset analysis (157/206 Pre-Calc 11 = 76%)
- **Choice Value Recovery**: Frequency-based heuristics for missing values
- **Text Repair**: Garbled text recovery and grammatical correction
