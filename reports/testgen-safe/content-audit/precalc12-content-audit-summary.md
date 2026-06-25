# Pre-Calculus 12 Safe Bank Content Audit Summary

Source ledger: `precalc12-content-audit.tsv`

## Overall

| Status | Count |
| --- | ---: |
| pass | 45 |
| needs_answer_check | 218 |
| needs_edit | 123 |
| unusable | 350 |
| not_reviewed | 0 |

## By Chapter

| Chapter | Pass | Needs answer check | Needs edit | Unusable | Not reviewed | Total |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| chapter-01 | 8 | 22 | 9 | 32 | 0 | 71 |
| chapter-02 | 3 | 19 | 6 | 37 | 0 | 65 |
| chapter-03 | 2 | 8 | 17 | 37 | 0 | 64 |
| chapter-04 | 3 | 28 | 15 | 21 | 0 | 67 |
| chapter-05 | 4 | 29 | 7 | 29 | 0 | 69 |
| chapter-06 | 11 | 18 | 13 | 28 | 0 | 70 |
| chapter-07 | 3 | 16 | 16 | 33 | 0 | 68 |
| chapter-08 | 0 | 21 | 9 | 36 | 0 | 66 |
| chapter-09 | 5 | 14 | 15 | 31 | 0 | 65 |
| chapter-10 | 1 | 19 | 11 | 35 | 0 | 66 |
| chapter-11 | 5 | 24 | 5 | 31 | 0 | 65 |

## Interpretation

- `pass` means the extracted question and answer key were clear enough to verify from the safe bank text.
- `needs_answer_check` usually means the question is usable-looking, but the export has no answer key or depends on a graph/image/source detail.
- `needs_edit` means the question is probably salvageable after localized source/text/typesetting repair.
- `unusable` means the extracted row is too damaged, has a visible answer-key conflict, or is an answer/solution fragment rather than a clean question.

## Main Finding

The safe bank is useful as a working copy, but it is not ready for final classroom use as an answer-key-verified bank. The dominant problem is not curriculum fit; it is extraction damage: missing equations, stripped choices, source-image-only prompts, answer fragments imported as questions, and several visible key conflicts.

## Suggested Repair Order

1. Drop or return to source for `unusable` rows before investing time in answer-key solving.
2. Repair `needs_edit` rows where the original source/PQP image can restore a missing expression.
3. Add answer keys for `needs_answer_check` rows that are already readable.
4. Re-run this audit only on the repaired bank.
