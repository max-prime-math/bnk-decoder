# Local PQP vs Google Drive TestGen bank

Drive bank: **Pre-Calculus 40S — McGraw-Hill (ExamView)**

| Chapter | Questions local / Drive | Comparable answers equal | Answer coverage local / Drive | Types equal | Body exact / normalized | Choices exact / normalized | Algorithms local / Drive | Equal models / both algorithmic | Image refs local / Drive |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 03 | 65 / 65 | 26/26 | 65/26 | 65/65 | 2/16 | 42/53 | 28/17 | 2/17 | 188/31 |
| 04 | 63 / 63 | 25/25 | 63/25 | 63/63 | 2/8 | 40/46 | 22/8 | 6/8 | 172/20 |

## Algorithm changes

- Chapter 03: 11 newly algorithmic (pc12-chapter-03-q005, pc12-chapter-03-q008, pc12-chapter-03-q009, pc12-chapter-03-q010, pc12-chapter-03-q019, pc12-chapter-03-q022, pc12-chapter-03-q023, pc12-chapter-03-q025, pc12-chapter-03-q026, pc12-chapter-03-q028, pc12-chapter-03-q030); 0 no longer algorithmic.
- Chapter 04: 14 newly algorithmic (pc12-chapter-04-q004, pc12-chapter-04-q005, pc12-chapter-04-q007, pc12-chapter-04-q008, pc12-chapter-04-q009, pc12-chapter-04-q014, pc12-chapter-04-q015, pc12-chapter-04-q016, pc12-chapter-04-q019, pc12-chapter-04-q025, pc12-chapter-04-q026, pc12-chapter-04-q027, pc12-chapter-04-q028, pc12-chapter-04-q029); 0 no longer algorithmic.

## Integrity differences

- Chapter 03: 0 mismatches among 26 Drive answers; 65/65 exact TestGen question types; 0 missing in Drive; 0 missing locally.
- Chapter 04: 0 mismatches among 25 Drive answers; 63/63 exact TestGen question types; 0 missing in Drive; 0 missing locally.

## Validation

- All 50 algorithm-bearing BNK records are live in the local PQPs: 28/28 in Chapter 03 and 22/22 in Chapter 04. No source algorithm remains static.
- TestGen accepted all 128 questions and generated 25 checked variants for every algorithmic question after resolving 100 seeds per model.
- TestGen's browser Typst compiler compiled every original question, every generated variant, every algorithmic graph, and every reachable conditional-equation branch.
- The independent BNK audit checked 60 stored answer keys with 0 problems. Garbled-text and asset-integrity audits found 0 problems.
- The standalone checker could not invoke a system `typst` executable (`spawnSync typst ENOENT`); the bundled TestGen browser compiler completed the full render check instead.

Questions are matched by ExamView native export ordinal. “Normalized” text is a heuristic comparison that ignores whitespace, font wrappers, and a small set of equivalent math glyphs.

Exact image-byte matches count only images referenced by the same matched question. A zero does not mean the diagrams differ visually; the Drive bank uses separately cropped JPEG assets while the local PQPs embed native ExamView PNG/JPEG assets.
