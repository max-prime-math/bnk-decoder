# Decoder Direction

This repo should move toward structural decoding, not bank-specific patching.

## Primary Goal

Decode ExamView BNK files in a way that transfers across banks and textbooks:

- preserve binary structure
- recover narratives, algorithms, graphs, and question metadata from the file itself
- keep Typst/LaTeX rendering separate from low-level parsing
- surface failures as diagnostics instead of hardcoding one-off text repairs

## Allowed Work

These are the right kinds of improvements:

- format and chunk boundary decoding
- narrative and matching-group scope recovery
- generic algorithm structure extraction
- generic graph structure extraction
- placeholder detection and classification
- generic math-mode and Typst rendering rules
- corpus-wide variation analysis
- regression tooling

## Discouraged Work

These are the wrong direction unless they are temporary debugging aids:

- rewriting a specific question body by hardcoded wording
- inserting a formula because a single bank happens to need it
- reconstructing a specific answer or expression from one question’s text
- shipping question-family-specific content patches as permanent logic

If a content-specific patch is used for diagnosis, it should be treated as a temporary probe and then removed once the underlying structure is understood.

## What Future Workers Should Read

Read these first before changing parser behavior:

- `README.md`
- `BINARY_STRUCTURE_ANALYSIS.md`
- `ROADMAP.md`
- `NEXT_STEPS.md`

## Working Rule

If a proposed change only helps because it knows the wording of one bank question, it is not a good long-term decoder fix.
