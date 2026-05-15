# BNK Decoder

https://max-prime-math.github.io/bnk-decoder/

Standalone Svelte app and shared TypeScript packages for decoding ExamView BNK files.

## Status: ALPHA (Early Development) 🔧

**Current Decoder State:** ~75% functional with significant issues

### Working Features
- ✅ ExamView v06 BNK format detection
- ✅ Basic question extraction (77/81 for Chapter 01)
- ✅ Multiple choice parsing
- ✅ Matching question composite structure (Chapter 01 working)
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
- Only Chapter 01 tested thoroughly; Ch02-Ch09 not yet validated
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
- **Answer Key Extraction**: All question answers via binary offset analysis (157/206 Pre-Calc 11 = 76%)
- **Choice Value Recovery**: Frequency-based heuristics for missing values
- **Text Repair**: Garbled text recovery and grammatical correction

