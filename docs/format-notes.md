# ExamView BNK Format Notes

This file is a working reverse-engineering log for the local ExamView corpus. Keep
copyrighted banks and generated reports out of git; record only structure,
offsets, and small non-sensitive observations here.

## Current Goal

Milestone 1 is not perfect visual fidelity. It is a robust local decoder that
produces recognizable, usable output for every question in every bank, with
Typst-first rich content and warnings for anything not yet decoded.

Priority order:

1. Question text
2. Answers
3. Metadata
4. Math
5. Images
6. Graphs and algorithmic rules

## Canonical Output Direction

The decoder should emit JSON with Typst-first content fields. A useful starting
shape is:

```ts
{
  bank: {
    title,
    className,
    unitName,
    sectionName,
    sourcePath,
    examViewVersion
  },
  questions: [],
  assets: [],
  diagnostics: [],
  unknownFragments: []
}
```

Assets should be written with stable IDs and referenced from rich content.
Unknown binary spans should be preserved with offsets and warnings while the
format is still being mapped.

## File Headers

Observed files begin with a 16-byte ASCII-ish header. The first byte is `0x1a`.

| Extension | Header bytes/text |
| --- | --- |
| `.bnk` | `1a 46 53 43 42 4e 4b 23 57 23 30 36 23 30 30 23` / `\x1aFSCBNK#W#06#00#` |
| `.tst` | `1a 46 53 43 54 53 54 23 57 23 30 36 23 30 30 23` / `\x1aFSCTST#W#06#00#` |
| `.bnk` | `1a 46 53 43 42 4e 4b 23 57 23 30 35 23 30 30 23` / `\x1aFSCBNK#W#05#00#` |

Interpretation so far:

| Field | Meaning |
| --- | --- |
| `FSC` | ExamView/FSC container marker |
| `BNK` or `TST` | File kind |
| `W` | likely platform/encoding marker |
| `06` | observed format major version |
| `00` | observed minor/revision |

## Compression

For observed version `06#00` files, bytes after offset `0x10` begin with zlib
data, commonly `78 da`.

Example:

```text
00000000: 1a 46 53 43 42 4e 4b 23 57 23 30 36 23 30 30 23
00000010: 78 da ...
```

Inflating from offset `16` succeeds for at least:

| File | Inflated observation |
| --- | --- |
| `ignore/ExamView/Banks/Pre-Calculus 11/Chapter 01.bnk` | payload starts with UTF-16-like text for `Chapter 1: Sequences and Series` |
| `ignore/Examples/Pre-Calculus 11 - Chapter 01.tst` | same container style with `TST` kind |

Initial corpus scan:

| Metric | Value |
| --- | --- |
| BNK files | 373 |
| TST files | 3 |
| Files with zlib-inflated payloads | 375 / 376 |
| Known non-zlib outlier | `ignore/ExamView/Banks/Calculus/GQ-Calculus.bnk` |

The non-zlib outlier is version `05#00` and starts its payload with
`56 44 9b 2c`, so it needs a separate version interpreter.

## Text Encoding

The inflated payload contains readable text that appears to be UTF-16LE-like in
early regions. Parser work should prefer structured records once found, but
corpus inspection currently extracts both UTF-8/Latin-ish printable text and
UTF-16LE printable text for discovery.

## Next Unknowns

- Question record boundaries.
- Bank metadata fields.
- Question type codes.
- Answer key and solution record locations.
- Rich text run encoding.
- Math object encoding.
- Algorithmic variable record format.
- Graph definition record format.
- Asset embedding and length boundaries.

## Version 06 Question String Clusters

The first useful v06 structure is an offset-ordered sequence of UTF-16LE strings.
Question-like clusters commonly begin with:

```text
<difficulty>
Section <n.n>
<reference code>
<topic>
<keyword/title>
<algorithmic variable names/rules/sample values>
scramble
true
<additional predicate or rule>
<visible question text fragments>
```

Observed difficulty labels include `Easy` and `Average`; parser code also checks
for `Medium`, `Difficult`, and `Hard`.

Example from `Pre-Calculus 11/Chapter 01.bnk`:

```text
Easy
Section 1.1
RF 9
Arithmetic Sequences
nth term
range(-20,50,1)
...
scramble
true
abs(n)>3
Which of the following numbers occurs in the sequence
, . . .?
```

The current parser turns these clusters into candidate questions. This is useful
but still heuristic:

- Body text is recognizable but misses embedded rich math slots.
- Algorithmic variables are now extracted as `name`, `rule`, and `sampleValue`
  where the string sequence is clear.
- Choices prefer `ANS`/`DIS*` variables, then `isunique(...)` argument lists.
- Answers prefer explicit `ANS` variables, then the first `isunique(...)`
  argument as a provisional answer.
- For scrambled MCQ items, the parser now tries to combine the visible
  A/B/C/D label run with post-font variable references to recover printed
  choice labels. This matches early RTF evidence for question 1 in the sample
  Pre-Calculus 11 export.
- Body text appends visible variable samples from display references, e.g.
  `(t1 = -2, t3 = 7, n = 15)`, until rich text/math slot reinsertion is mapped.
- Common placeholders are now interpolated directly when possible. For example,
  `sequence, . . .` plus display references `t1` through `t5` becomes
  `sequence -12, -8, -4, 0, 4, . . .`, and prompts like
  `t1 =, t3 =, and n =` are filled from sampled variable values.
- Raw cluster previews are preserved for each question to guide the next pass.

Known limitations:

- `isunique(...)` appears to validate uniqueness of answer/distractor values,
  but its first argument may not always be the correct answer. This needs
  validation against ExamView RTF/PDF exports.
- Some rendered math slots are still represented as appended values rather than
  exact inline placement.
- Some non-MCQ/completion questions are still classified too coarsely.
- Expressions inside `isunique(...)` can be direct expressions rather than
  variable names. Example: `isunique(f,d,1/d,D2)`. The parser now resolves
  simple reciprocal choices such as `1/d` against sampled variable values, which
  fixed the sample Pre-Calculus 11 question 3 answer label.
- Grade 12 transformation banks use string-valued variables such as
  `ANS_direction = if(k>0,"up","down")`. The parser now accepts plain word
  samples for string-producing rules, and has a targeted translation interpreter
  for `ANS_units`/`ANS_direction`/`DIS_direction` clusters. This turns early
  Pre-Calculus 12 prompts into readable choices like `9 units down`.
- Grade 12 graph/function banks often include compact expression tokens near
  the visible prompt. A conservative graph-definition heuristic now records
  expression-like tokens such as `(-a/(x-h))-k`, `(sin(x))/x`, and
  `-1*((x-2)^2)+22` under `question.graphDefinitions`. This is not a renderer
  yet, but it separates recoverable graph data from unsupported graph drawing.
- Graph definitions now keep the raw ExamView expression, a variable-substituted
  expression, Typst/LaTeX expression strings, the variables used, and sampled
  `(x, y)` points when the expression is safe to evaluate. In the Pre-Calculus
  12 pass, 65 graph-related questions produced graph definitions, with 121
  expression curves sampled for quick preview.
- Some hidden math objects can be recovered from nearby algorithmic variables
  even before the glyph-stream format is fully decoded. The first implemented
  case is linear inverse-function content: when variables such as `m`, `b`,
  `inv_m`, and `inv_b` are present, the decoder reconstructs prompts like
  `f(x) = 3x + 5`, inverse choices like `f^(-1)(x) = 1/3x - 5/3`, and the
  matching correct answer. This is a high-confidence algebraic reconstruction,
  not a general math-object parser yet.
- Transformation prompts also carry enough semantic data for recovery. The
  decoder now reconstructs relation signs in prompts like `When b > 0`, fills
  vertical/horizontal translation amounts and directions from variables such as
  `h_display`, `k_display`/`k_dsiplay`, `vert_direction`, and
  `horiz_direction`, and builds readable transformation MCQ choices.
- Some v06 records put `scramble true` before their algorithmic variables
  rather than after them. Display-start detection now searches for the first
  sentence-like prompt after the scramble marker and extracts variables up to
  that prompt. This removed most leading algorithmic junk in the Pre-Calculus
  12 scan.
- Additional high-confidence semantic recoveries now include point-coordinate
  choices for transformed graph points, inverse-radical restriction choices
  such as `x >= -4`, and reflection/translation choice families. In the current
  Pre-Calculus 12 scan, leading-junk bodies dropped to one false-positive
  radians prompt, with 15 recovered translation prompts, 8 restriction-choice
  questions, and 2 coordinate-choice questions.
- When a math or graph object is clearly present but not decoded yet, body text
  now uses explicit placeholders such as `[math expression not decoded yet]`
  or `[graph/diagram choice not decoded yet]` instead of leaking raw label runs
  or bogus `0`/`1` choice values.
- Embedded raster assets are now scanned from the inflated payload. PNG, JPEG,
  GIF, and validated BMP signatures are recognized; JPEG extraction is confirmed
  on the current corpus. `scripts/decode-file.mjs` writes assets next to the
  JSON as `<bank>-assets/asset-N.ext`.
- Asset scan result on the current local bank corpus: 327 BNK files, 8226
  decoded questions, and 5 embedded JPEG assets detected. The files with assets
  were `5.1 Scale Drawing, Models.bnk` (4 JPEGs) and `Chapter 09 AW11.bnk`
  (1 JPEG). Older/non-v06 fallback banks still need better per-question asset
  association because their question byte ranges are not mapped yet.
- Graph expression validation now rejects unbalanced fragments such as `sin(`
  and `x)`, which were previously leaking into recovered graph notes.
- If ExamView stores graph choices as dynamic graph objects, and the decoder can
  recover expression tokens, placeholder graph choices are replaced with choices
  such as `graph of sqrt(x+3)`. This is still a semantic fallback, not the final
  ExamView graph-object parser.
- Unit-circle algorithmic records expose a `which` index plus `radN`, `xdispN`,
  `ydispN`, and `eqN` flags. The decoder now has a provisional 17-point unit
  circle table to turn these into readable angle/point choices instead of raw
  zero/one graph placeholders.
- Latest Pre-Calculus 12 focused pass after graph/picture/unit-circle work:
  345 questions, 62 questions with graph definitions, 0 graph/diagram choice
  placeholders, 40 remaining explicit math-expression placeholders, and 64
  total `not decoded yet` markers. The remaining markers are concentrated in
  embedded math object streams, especially Chapter 06 trigonometric identities.
- Foundations of Math 10 Chapter 01 uses a compact v06 record layout rather
  than the `Easy -> Section ...` layout seen in some Grade 12 files. Its records
  look like `difficulty -> section title -> curriculum code -> topic ->
  knowledge type`, e.g. `Moderate -> 1.1 Imperial Measures of Length -> 10.M2
  -> Measurement -> Procedural Knowledge`. Some strings also appear on the odd
  UTF-16 alignment, so the string scanner now checks both alignments. Missing
  `Moderate` as a difficulty label caused several records to be swallowed into
  neighboring questions; adding it raised Foundations of Math 10 Chapter 01 from
  7 fallback blob questions to 156 candidate question records across the folder.
- The compact Foundations banks often store visible A/B/C/D choices as ordinary
  text immediately before the font marker. A visible-choice parser now extracts
  those choices and removes the printed choice run from the body. Remaining
  quality issues in this folder are mostly inline object/value slots, e.g.
  prompts like `radius cm` or `distance ... is in.` where ExamView inserted a
  value or diagram object outside the plain text stream.
- Inline variable/object slots in these compact records are represented by a
  UTF-16 control code `0x000f` inside the visible text stream. The extractor now
  preserves this as an internal `[[slot]]` marker and replaces body slots with
  sampled algorithmic variable values when the post-font variable reference
  stream identifies them. This fixed examples such as `Convert ft. in. to
  inches.` becoming `Convert 6 ft. 5 in. to inches.` and `radius cm` becoming
  `radius 11.6 cm`. If a slot has no associated algorithmic variable, the output
  now says `[inline object not decoded yet]` rather than silently deleting the
  missing value or diagram.
- Unresolved inline slots are now classified in output text and JSON as
  `value`, `diagram`, `math`, `choice-value`, or `unknown` inline objects, with
  local context preserved under `question.inlineObjects`. In the current
  Foundations of Math 10 Chapter 01 scan, 21 unresolved inline objects remain:
  7 likely fixed inline values and 14 likely diagrams/objects. The browser app
  shows these in an Inline Objects panel for the selected question.
- `scripts/inspect-records.mjs` is a focused reverse-engineering inspector for
  one BNK/TST at a time. It inflates the file, finds candidate v06 records, and
  writes JSON/Markdown reports with metadata, variable tables, display text,
  visible choices, post-font references, inline slot positions, slot context,
  and raw bytes around each slot. Run it with:

```bash
npm run inspect:records -- 'ignore/ExamView/Banks/Pre-Calculus 11/Chapter 01.bnk' reports/record-inspector
```

- The Pre-Calculus 11 Chapter 01 inspection found 76 section-style records,
  331 inline slots, and 291 slots with candidate variable references. This shows
  that much of the remaining garbage is not absent data; it is incorrect
  assignment of slot refs to body text versus answer choices, especially in
  formula-heavy sequence/series questions. A first targeted fix strips trailing
  inline choice slots before body interpolation, reducing bogus body objects in
  the decoded Chapter 01 output from 84 to 63. The next high-value task is a
  record-aware slot mapper that aligns body slots and choice slots separately
  instead of treating the whole display run as one flat text string.
- The v06 display stream now gets split into body text and visible choice
  regions before interpolation. This avoids pulling A/B/C/D slot placeholders
  into the prompt body and reduced Pre-Calculus 11 Chapter 01 unresolved inline
  body placeholders from 63 to 40 in the focused scan.
- Sequence/series records need extra alignment because formula choices can
  inject references before the actual sequence terms. The decoder now only
  prioritizes `t1..t5` when the word `sequence` occurs before the first body
  slot. This fixes prompts like `What is the 18th term...`, where the first slot
  is `n`, while still fixing prompts like `sequence [[slot]], [[slot]], ...`.
- A semantic recovery pass now rewrites high-confidence sequence/series prompt
  shapes from their algorithmic variables. Examples from Pre-Calculus 11 Chapter
  01 include `–9, –1, 7, 15, 23,...`, `The sum of the series (-5) + (-7) +
  (-9) + ... + (-19)`, geometric series ellipses, `S_9` alternating-series
  prompts, and sign/value pairs such as `5 - 15 + 45 - 135 + ...`. This reduced
  obvious sequence/series garbage in the first half of the chapter without
  changing the Foundations of Math 10 smoke output.
- Some sequence/series choices can also be reconstructed semantically. The
  arithmetic general-term item now emits formula choices such as `t_n = 8n -
  17`, and the convergence item emits the four printed statement choices
  instead of raw sampled variables.
- The PostScript export for `Pre-Calculus 11 - Chapter 01` preserves more math
  text than the RTF export, which renders many math objects as images. Using it
  as an oracle, the decoder now recovers several high-confidence embedded math
  slots in that bank: arithmetic/geometric general-term formulas, ellipsis
  sequence prompts, `S_8`/`S_4` notation, simple fractions such as `2/3`, and
  the infinite-series perimeter formula. In the focused Pre-Calculus 11 Chapter
  01 scan, body-level `not decoded yet` markers dropped from 20 after the prior
  pass to 0, and the remaining `DIS1` choice token in the eighth-term item is
  replaced with the printed numeric choice.
- Pre-Calculus 11 Chapters 01-09 now decode to 570 question records with no
  body-level `not decoded yet` markers and no obvious answer-choice garbage
  tokens in the folder quality report. Unresolved slots are rendered as
  user-facing placeholders such as `[embedded math expression]`,
  `[embedded diagram/object]`, and `[embedded value]`, while the original slot
  context is still preserved in `question.inlineObjects`. The current
  Pre-Calculus 11 folder report has 183 bodies with embedded placeholders and
  279 inline-object records, so the remaining work is true embedded
  math/diagram/graph decoding rather than plain-text record cleanup.
- `npm run report:quality -- <decoded-json-dir> [out-json]` summarizes decoded
  JSON folders by question count, remaining `not decoded yet` markers,
  user-facing embedded placeholders, inline-object count, and suspicious choice
  tokens. This is now the quickest way to compare corpus-wide progress after a
  decoder change.

## RTF Evaluation

Use the local RTF oracle script when a matching ExamView export exists:

```bash
npm run evaluate:rtf -- 'ignore/ExamView/Banks/Pre-Calculus 11/Chapter 01.bnk' 'ignore/Examples/Pre-Calculus 11 - Chapter 01.rtf'
```

This writes an ignored report under `reports/evaluation/`. The current parser
uses this for feedback only; it does not depend on RTF files at decode time.

## Algorithm Blocks (v06)

Decoded structurally in `packages/bnk-core/src/algorithms.ts` (`readAlgorithmBlocks`).
The old string-sequence heuristic (`name`, `rule`, `sample` in a row) dropped every
condition and produced false variables from ordinary words; the structure below
parses exactly, with each block's entries filling its declared length.

A question's algorithm block follows its five metadata strings (difficulty,
objective, reference, topic, key) directly, at any byte alignment:

```text
int32  byteLength                 includes this field; block ends at start + byteLength
entry* until the block end
  int32 nameLength, ruleLength, displayLength   UTF-16 code units
  int32 kind        0 = variable, 3 = condition (conditions have an empty name)
  int32 valueType   1 = number, 2 = string
  int32 format      0 plain, 1 fixed decimals, 4 always signed ("+ 5", "– 9"),
                    6 fixed decimals with digit grouping ("20 712"), 5 other signed style
  int32 decimals    places for formats 1 and 6
  int32 flags
  float64 value     numeric sample (0 for strings)
  UTF-16 name, rule, display, each followed by one 16-bit slot (not always 0 when empty)
```

`scramble` is an ordinary entry (`true`). Display strings switch to the Symbol font
with `\x01` + U+F08x and then use U+F0xx glyphs (U+F02D is a minus sign).

Rules are ExamView expressions evaluated in dependency order, not list order
(`ans_x = cos(radians)` can precede `radians = degrees*pi/180`). Semantics that
matter when translating: `rand(n)` is an integer 1..n; `choose(i, a, b, ...)`
picks by index; `round(x, d)` keeps d decimals; `isunique(...)` can sit inside a
larger condition; `mod` is an operator. Some rules reference variables that are
not in the question's own block (narrative-scoped).

Inside the question record that follows, variables are referenced three ways:

| Where | Encoding |
| --- | --- |
| Text slot | UTF-16 string `"X"` immediately followed by the UTF-16 variable name |
| Equation object | byte `0x0a`, UTF-16 name, UTF-16 terminator, inside compact object math (`g(x)=x` `01 ff 7f` `2` `0a k`) |
| Graph object | plain UTF-16 expression strings: point coordinates (`x1`, `y1`), label offsets (`x3-.3`), functions (`(x + h)^2 + k`) |

Counting these gives, per question, exactly how many times each variable is
displayed. Ch01 Q1: `k` once in `g(x)=x^2+k`, `ANS_units` four times (one per
choice), `ANS_direction` and `DIS_direction` once each.

The ExamView printout (and so the Mathpix text) shows each variable's stored
display value, which is what makes attaching algorithms to printed text possible.

Pre-Calculus 12: 376 blocks parse; 332 match PQP questions.

## Graph Objects (v06)

Decoded in `packages/bnk-core/src/graphs.ts` (`readGraphObjects`). A Cartesian graph is a
fixed-layout record with fixed-width UTF-16 string buffers:

```text
+0x000  int32 byteLength (2456 + 1796 per item), int32 5
+0x008  four 16-char strings: view settings, [0]/[1] = centre x/y (expressions, usually "0")
+0x86c  x-axis: label (12 chars), float64 scale, int32 ticksPerInch, int32 ticksPerLabel,
        ..., font; +0x88 show tick labels, +0x8c show tick marks
+0x8fc  y-axis, same layout
+0xa1c + k*0x704   item k, addressed from its main string E:
        E-0x80 domain min, E-0x60 domain max, E-0x40 display condition (16 chars each)
        E-0x20 type, E-0x14 colour index (1 black, 2 blue, 6 red), E-0x08 width (300/600)
        E      expression, or the first coordinate
```

| Type | Item | Layout from E |
| ---: | --- | --- |
| 0 | y = f(x) | expression |
| 1 | x = f(y) | expression in y |
| 3 | circle | (not decoded yet) |
| 6 | point | x, y (+0x20); marker +0x60 (1 solid, 2 hollow); label style +0x64 (1 = coordinates); label position +0x68 |
| 7 | segment | two point records, the second at +0xc4 |
| 12 | text | text; position expressions at +0x98 / +0xb8 |
| 18 | number-line ray | (not decoded yet) |

The view size (width/height in twips minus one) sits in a frame record shortly before
many graphs. Graphs used as choices have none nearby; their Mathpix crops measure
254 px per inch, so the crop size gives the frame. The x range is centre ±
width × ticksPerInch × scale / 2 (the frame edge), which projects curves onto the printed
crops exactly. Graph choices are stored row by row across ExamView's two-column layout:
stem graphs, then choices A, C, B, D, then the rest.

## Attaching Algorithms to PQP

`npm run pqp:algorithms -- <pqp-dir> <bnk-dir> [overrides]` (part of `pqp:precalc12`)
matches algorithm blocks to questions and adds `extensions.algorithmModel` only when
test-generator can vary the question correctly:

- **Rules** are kept close to ExamView; test-generator's evaluator implements ExamView's
  functions. Only indexed `choose` is rewritten (to `if`), and call spacing normalised.
- **Slots** (`algorithmModel.slots`) record exactly where each displayed value is printed:
  each variable must take exactly as many places as the BNK references it, solved as an
  assignment over the printed text (math vs prose breaks ties). Anything ambiguous stays fixed.
- **Display formats** (`display`: signed terms, fixed decimals, digit grouping) come from the
  ExamView entry header, so new values print the way ExamView prints them.
- **Graphs** that use variables become Math Graph templates (`algorithmModel.graphs`), and
  test-generator redraws them for each version. Each template must land on the ink of its
  printed picture with the sample values (70% of sampled points) before it's attached, which
  checks the decoding and the picture pairing at once. Pictures that aren't graphs, x = f(y)
  curves, circles and number lines keep the question fixed, and so does a question whose
  variable graph has no picture at all (Ch09 MC24). `check:pqp` fails if any picture in an
  attached question lacks a template. Templates set `showFeatures`, so
  test-generator widens the window when new values push roots or asymptotes out of the
  ExamView frame, and draws and labels them.
- **Gates** for ExamView authoring flaws: a displayed value also typed as fixed text; choices
  that can coincide (a distinct-choices condition is added); values in term position printed
  plain ("x –9" becoming "x 7") are printed as signed terms.
- `data/algorithm-overrides/` records reviewed fixes for individual authoring flaws.

`npm run check:pqp` runs test-generator's engine for 100 seeds per question (25 compiled with
their redrawn graphs), recomputes every deterministic rule, and fails on any warning.

Current result: 147 of 332 algorithmic questions attached (26 of them with redrawn graphs),
each reviewed by reading generated versions. The rest stay fixed with the reason in
`extensions.examview.algorithm` and an `ALGORITHM_STATIC` diagnostic:

| Reason | Count | What would unlock it |
| --- | ---: | --- |
| Printed text doesn't pin down every slot (equal values, OCR differences) | 83 | Use the BNK's slot order inside each field |
| No displayed variables | 24 | Nothing to vary |
| Display value not matchable (Symbol glyphs, `list` displays) | 23 | More display decoding |
| Unsupported ExamView function (mostly `list`) | 19 | `list` is a choice-list construct, not a value |
| Decoded graph doesn't match its printed picture | 11 | Decode the remaining graph settings |
| Uses variables defined outside the question (narratives) | 10 | Decode narrative algorithm blocks |
| Graph has x = f(y), circles or number lines | 9 | Extend Math Graph |
| Pictures that aren't ExamView graphs | 6 | Nothing (they can't follow new values) |
