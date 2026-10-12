# Local PQP vs Google Drive TestGen bank

> Superseded by `perfected-local-vs-drive.md`. A later direct BNK audit found and fixed the sequential matching-key defect described below and recovered Chapter 3 q002/q024.

Drive bank: **Pre-Calculus 40S — McGraw-Hill (ExamView)**

The Drive folder contains the expanded TestGen bank (`manifest.json`, `questions/`, and `images/`), rather than standalone `.pqp` files. This report compares those stored TestGen questions with the Chapter 3 and Chapter 4 PQPs produced locally.

| Chapter | Questions local / Drive | Comparable answers equal | Answer coverage local / Drive | Types equal | Body exact / normalized | Choices exact / normalized | Algorithms local / Drive | Equal models / both algorithmic | Image refs local / Drive |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 03 | 65 / 65 | 26/26 | 65/26 | 65/65 | 2/15 | 42/53 | 17/17 | 13/15 | 194/31 |
| 04 | 63 / 63 | 25/25 | 63/25 | 63/63 | 2/8 | 40/46 | 22/8 | 6/8 | 173/20 |

## Algorithm changes

- Chapter 03: 2 newly algorithmic (pc12-chapter-03-q023, pc12-chapter-03-q025); 2 no longer algorithmic (pc12-chapter-03-q002, pc12-chapter-03-q024).
- Chapter 04: 14 newly algorithmic (pc12-chapter-04-q004, pc12-chapter-04-q005, pc12-chapter-04-q007, pc12-chapter-04-q008, pc12-chapter-04-q009, pc12-chapter-04-q014, pc12-chapter-04-q015, pc12-chapter-04-q016, pc12-chapter-04-q019, pc12-chapter-04-q025, pc12-chapter-04-q026, pc12-chapter-04-q027, pc12-chapter-04-q028, pc12-chapter-04-q029); 0 no longer algorithmic.

## Integrity differences

- Chapter 03: 0 mismatches among 26 Drive answers; 65/65 exact TestGen question types; 0 missing in Drive; 0 missing locally.
- Chapter 04: 0 mismatches among 25 Drive answers; 63/63 exact TestGen question types; 0 missing in Drive; 0 missing locally.

## Reviewed findings

- Coverage is complete: all 128 questions match one-to-one, and their precise TestGen types agree after mapping PQP `bimodal` records to TestGen `mcq`.
- All 51 answers populated in the Drive `answer` field are MCQ answers, and every one agrees. The local PQPs also preserve decoded answers for the 77 constructed-response and matching questions whose Drive `answer` field is null.
- This earlier local build assigned sequential matching keys. A later direct check against the BNK record indices proved that wrong; the perfected PQPs now use Chapter 3 `D, C, A, B` and Chapter 4 `C, E, A, D, B`.
- The local PQPs have 39 algorithmic questions versus 25 in Drive, a net gain of 14. Chapter 4 gains 14 without losing any. Chapter 3 gains q023 and q025 but does not attach the Drive algorithms for q002 and q024.
- Of 23 questions algorithmic in both versions, 19 models match after normalizing presentation whitespace. Chapter 3 q003 differs in graph-template image and canvas metadata. Chapter 3 q013 has the same full author-supplied uniqueness condition on both sides; only a redundant generated condition differs. Chapter 4 q010 and q020 have stronger uniqueness conditions locally.
- The low exact-body count reflects representation. Drive mostly uses editable Mathpix-derived Typst equations. The local PQPs preserve native ExamView equation snippets as images and keep the surrounding prose as text. This avoids OCR transcription in many formulas but produces many more image references: 367 locally versus 51 in Drive.
- A concrete Drive typesetting defect remains in Chapter 4 q015: `such` is inside the interval math span (`$0 <= theta < 2 pi "such"$`). The local version keeps “such that” outside the native interval image. Chapter 4 q014 and q015 are also algorithmic locally and static in Drive.
- Representative graph checks on Chapter 3 q023/q024 and Chapter 4 q007/q009 show the same curves, axes, labels, and rays. Drive's PDF crops are higher resolution (roughly 515–768 px on the checked images); the native local assets are roughly 192–289 px. The local graphs preserve the ExamView source raster but are visibly lower resolution when enlarged.
- Neither side stores separate narrative objects for these chapters; narrative prose is embedded in the question bodies. No narrative-linked question is missing.

This report describes the earlier artifacts. The perfected local PQPs recover q002/q024, correct the matching keys, and lower more equations to editable Typst; see the superseding report for current results.

Questions are matched by ExamView native export ordinal. “Normalized” text is a heuristic comparison that ignores whitespace, font wrappers, and a small set of equivalent math glyphs.

Exact image-byte matches count only images referenced by the same matched question. A zero does not mean the diagrams differ visually; the Drive bank uses separately cropped JPEG assets while the local PQPs embed native ExamView PNG/JPEG assets.
