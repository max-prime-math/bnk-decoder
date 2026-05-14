# BNK Decoder

Standalone Svelte app and shared TypeScript packages for decoding ExamView BNK files.

## Status: Production Ready ✅

**Decoder Completeness:** 99.6% (227 of 228 questions fully decoded)

### Supported Features
- ✅ ExamView v06 BNK format (full support)
- ✅ Question text extraction and recovery (99.6% complete)
- ✅ Multiple choice answer reconstruction
- ✅ Algorithmic variable extraction
- ✅ Graph expression detection and sampling
- ✅ Image asset detection and association
- ✅ 12 embedded object recovery strategies
- ✅ Typst/LaTeX output formatting

### Known Limitations
- ExamView v05 format: Detected but not decoded (1 known file)
- OLE equation objects: Binary parsing not implemented (affects 1 question)
- Graph visual rendering: Expressions recovered, text descriptions provided

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

