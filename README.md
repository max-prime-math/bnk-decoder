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

## PQP for test-generator

### BNK-only conversion with local ExamView

On Windows with Node 24 and the local `ExamView/evpro.exe`, run:

```sh
npm run pqp:examview -- "path/to/bank.bnk" "output/bank.pqp.json"
```

This machine can also use its installed Codex Node runtime through the launcher:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/convert-bnk.ps1 -Bank "path/to/bank.bnk" -Output "output/bank.pqp.json"
```

This opens an isolated copy of the v06 bank and exports synchronized native question
XML and RTF. Questions, narratives, choices, matching answers, tables, and solutions
become PQP content; native-rendered math and graphs become embedded images. The RTF
supplies graphical completion answers that ExamView omits from its Blackboard XML.
No PDF or OCR input is required. Source hashes are checked before and after export,
and the original BNK, native evidence, algorithm bytes, and diagnostics are retained.
Existing PQP outputs are never overwritten; exit 2 reports a partial conversion.

The [validated publisher packages](reports/rea-examview/native-publisher-OR4kc6/summary.json)
cover **739/739 source records** across Chapters 01–11: 696 PQP questions and 2,530
images. All packages compile in Typst and conform to this repository's PQP interface;
all 300 multiple-choice keys match the paired native RTF. Matching groups account
for the difference between source-record and question counts. A teacher graph bank
and a controlled shared-narrative bank also convert completely.

The bridge captures one native loaded instance; it does not reproduce randomized
algorithm generation. Missing original fonts produce explicit substitution warnings
and native Windows glyph images, rather than guessed symbols. Consumer-app import
and pixel parity across every corpus bank remain unverified. The standalone browser
app still uses its existing decoder; this Windows bridge is a CLI command.

Further fidelity checks found that ExamView can overwrite image filenames when
exporting bimodal questions in short-answer mode. Bimodal conversion now captures
both modes and requires content alignment; unresolved mismatches produce a partial
result. Earlier coverage counts establish record inclusion and compilation, not
correctness of every diagram in those native exports.

Retained exports can be reprocessed without launching ExamView:

```sh
npm run pqp:examview -- "path/to/bank.bnk" "output/new-bank.pqp.json" --evidence "path/to/native-evidence-directory"
```

### Direct BNK conversion (structural reader)

With Node 24, convert a single v06 bank without PDF, Mathpix, or a curriculum config:

```sh
npm run pqp:bnk -- "path/to/bank.bnk" "output/bank.pqp.json"
```

The new file embeds recovered PNG assets and preserves raw metadata and algorithm bytes.
Existing output files are never overwritten. Exit status 0 means all detected source records
converted; status 2 means a partial package was written, with each omission listed in
`extensions.bnk.omittedQuestions`; status 1 means conversion failed. Record coverage does
not establish visual or semantic parity with ExamView.

The structural reader now follows ExamView's declared counts and sequential question,
narrative, and matching records, including length-prefixed metadata and algorithms.
Corpus checks parse all 372 v06 banks (13,871 question records), preserving opaque tails
in 49 banks. Rendering coverage is lower: graphs, some equation templates, completion
questions, and other embedded objects remain unresolved. Stored algorithm display values
are substituted by their binary variable references; randomized variants are not evaluated.
Teacher-made structural smoke samples convert 22/22, 15/15, and 11/11 records.
The structural CLI explicitly omits unsupported content; the native bridge above
provides the validated publisher-bank route. Matching groups combine several source
records into one question.
See [REA investigation](reports/rea-examview/INVESTIGATION.md) for evidence and limitations.

### Existing PDF and Mathpix route

The curated publisher-bank PQP files use ExamView's printouts because direct conversion
still omits too much embedded math and graph content for complete publisher-bank coverage.

1. Export the bank from ExamView as a PDF and as RTF (the RTF is the answer-key oracle).
2. Run the PDF through Mathpix and keep the LaTeX `.zip` for each chapter.
3. Convert the zips to PQP:

   ```sh
   npm run pqp:mathpix -- <zip-dir> <out-dir> [overrides.json]
   npm run pqp:algorithms -- <out-dir> <bnk-dir>   # attach ExamView algorithms where safe
   npm run pqp:precalc12   # both steps for Pre-Calculus 12 -> reports/pqp/pre-calculus-12
   ```

   The algorithm step reads the BNK's algorithm blocks and graph objects and attaches them
   only when test-generator's **Calculate values** is proven to produce correct versions,
   including redrawn graphs; see "Attaching Algorithms to PQP" in `FORMAT_NOTES.md`.
   These packages use test-generator's value slots, ExamView functions and graph templates
   (the `algorithm-slots` branch).

4. Check the result before importing:

   ```sh
   npm run check:pqp -- reports/pqp/pre-calculus-12 ignore/Examples
   ```

   This compiles every stem, choice and solution as Typst, compares section counts and
   MCQ/completion answer keys with the RTF exports, and runs the files through
   test-generator's importer (set `TEST_GENERATOR_DIR` if it isn't at `../test-generator`).
   For algorithmic questions it also generates versions with test-generator's own engine
   and checks that they resolve, recompute correctly, and compile with their redrawn graphs.

5. In test-generator, import each `Chapter NN.pqp.json`, then upload that chapter's images
   from `assets/Chapter NN/` when prompted.

`data/pqp-overrides/` holds hand-reviewed fixes for the few questions whose OCR is
too scrambled to parse. Each entry records why it exists.

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

# Output appears in ../../sources/examview-test-banks/outputs/reports/decoded/
```

## Recent Achievements

- **Image Asset Integration** (2026-05-14): All embedded images detected, extracted, and linked to questions (v06 byte-range overlap + fallback distribution)
- **Embedded Object Recovery** (2026-05-14): 12 semantic recovery strategies, 99.6% coverage
- **Narrative Recovery** (2026-05-15): Binary narrative catalog discovered in Chapter 01; question records now attach the correct shared preamble from the `narr1`..`narr6` table instead of guessing from body text
- **Answer Key Extraction**: All question answers via binary offset analysis (157/206 Pre-Calc 11 = 76%)
- **Choice Value Recovery**: Frequency-based heuristics for missing values
- **Text Repair**: Garbled text recovery and grammatical correction
