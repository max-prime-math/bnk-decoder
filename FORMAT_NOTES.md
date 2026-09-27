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

## Current TestGen Package Bridge

The BNK decoder UI now exports TestGen-ready packages as:

```ts
{
  format: 'test-generator-question-bank',
  version: 2,
  exportedAt,
  source,
  producer,
  diagnostics,
  questions,
  customClasses,
  images
}
```

`questions` use the TestGen stored-question shape, not the older draft-only
shape. Embedded image assets are bundled in `images` as base64 records with
`name`, `ext`, optional `mime`, optional `size`, and `data`.

Question records can carry decoder-owned extensions directly on the question:

- `algorithmModel` and `algorithmEvaluation`
- `graphModel` and `graphTypst`
- `decodeDiagnostics`
- `parts`
- `className`, `unitName`, `unitId`, `sectionName`, and `sectionId`

The bridge intentionally preserves graph and algorithm data even when TestGen
does not yet render or evaluate every ExamView construct natively.

## Grade 12 v06 Structural Findings (2026-06-14)

The current Grade 12 Pre-Calculus pass added these structural recoveries:

- Matching groups should be linked by evidence from answer-variable references
  or unresolved owned item records, not by broad proximity to nearby short-answer
  questions.
- Matching choices can be materialized from algorithm definitions. This includes
  `comb`, `perm`, factorial-style expressions, and suffixed distractor variants
  such as `n!/r!` -> `n1!/r1!`.
- Compact object-math runs in v06 are not necessarily OLE/MathType streams.
  Several use byte `0x7f` as an overloaded marker for exponent, function-call,
  absolute-value-like grouping, and grouped operands.
- Algorithm sample values can safely materialize some compact object-math
  variables, but scalar slots and diagram slots must reject equation-like
  candidates unless the local prompt context asks for a function, equation,
  identity, or expression.
- Scatter/table data, rational-function holes, and Chapter 03 number-line rays
  can be emitted as `graphModel.objects` using point and ray object fields.
- Currency values must be escaped conservatively after math wrapping. Literal
  money such as `\$150` should not trigger broad escaping of closed math spans
  such as `$2$`, `$15$ kg`, or equation spans.
- PDF comparison is now a required verification path. The internal quality
  report catches obvious placeholders and bad choice tokens, but it is not a
  semantic correctness guarantee.

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

## ExamView UI Reference

Observations from live ExamView screenshots of Pre-Calculus 11, Chapter 01 banks.
These describe what the software shows, independent of the binary format.

### Question Types Observed

- **Multiple Choice (Bimodal)**: a question that has both a regular MCQ form and a
  true/false form. The title bar shows `Multiple Choice (Bimodal) - N of Total`.
  The `question-model` already includes `bimodal` as a `QuestionType`.

### Question Editor Layout

The editor shows:
- A toolbar (font, size, bold/italic/underline, alignment).
- A body pane (top) with the question prompt. Variable names appear as inline blue
  tokens that can be double-clicked to open the Format Variable dialog.
- Choice rows labelled A/B/C/D with radio buttons. The selected radio is the correct
  answer but in edit mode it does not change appearance — the answer is tracked in a
  separate "Answer" dropdown at the bottom of the window.
- A bottom status bar with: `Narrative… (None)`, `Record | Info… | Close`, then on
  the right: `Answer: [letter]`, `Choices: [n]`, `Scramble: [All/None/…]`, `Columns: [n]`.

### The □ Character in Edit View

Every choice row ends with a `□` symbol in ExamView's edit view. This appears on
ALL choices — including plain-text choices with no variables. It is ExamView's
end-of-field inline object marker and maps to the UTF-16 codepoint `0x000f` in the
binary stream. It is not a user-visible math or diagram object; it is purely a
formatting artifact of the choice text field. The decoder already ignores it cleanly
(the trailing `[[slot]]` at the end of each choice is not rendered in output).

### Algorithmic Variable Edit View

Variable tokens in the body and choices are shown as blue highlighted text. The
variable name (e.g. `ANS`) appears literally in the edit view; sample values are
shown only in print preview.

### Format Variable Dialog (observed fields)

Opened by double-clicking a variable token:

| Field | Observed value / notes |
|---|---|
| Type | "Variable Type" (label only, not editable here) |
| Variable name | e.g. `ANS` |
| Definition | The rule expression, e.g. `fracs(t1*10,10-q)` |
| Format | Dropdown, e.g. `Metric (## ###)` |
| Decimal places | Integer, e.g. `5` |
| Fixed | Checkbox |
| Hide leading zero | Checkbox |
| Make only this variable value unique across questions | Checkbox |

The `Definition` field is exactly what appears in the binary string stream as the
variable's rule. The `Format` dropdown controls how the computed value is displayed
(e.g. Metric uses spaces as thousands separators).

### Print Preview vs. Edit View

- Edit view: variable names (`t1`, `ANS`, etc.) appear literally; choices show
  `ANS.□` style tokens.
- Print preview: all variables are substituted with computed sample values;
  fractions are typeset (e.g. `−81/2` renders as a proper fraction); the `□` is
  gone; choice letters are printed without radio buttons.

Confirmed for q-29 (convergent series, Pre-Calculus 11 Ch01): the decoder's body
text and choice text match the print preview exactly after variable interpolation.

### Answer Key Storage

ExamView stores the correct answer as a choice letter (e.g. `A`) in an explicit
field visible in the editor's "Answer" dropdown. This field is stored in the binary
but has not yet been located in the inflated payload. It is likely in the
**unread region between the end of the choice text block and the start of the next
question's difficulty label** — approximately 2600 bytes per record in Ch01 that the
decoder currently ignores.

Finding and reading the answer key byte is the highest-value next binary format task.

### Question Count Discrepancy (Ch01)

ExamView reports **30 questions** in Pre-Calculus 11 Chapter 01
(`Multiple Choice (Bimodal) - 29 of 30` is question 29 of 30 total).
The decoder finds **76 string clusters** — a 2.5× overcount.

The excess clusters come from:
- Matching question answer items (q-36 to q-40 in current decoded output: bare
  definitions like "a geometric series that has no last term").
- Sub-parts of multi-part problem questions (q-42 to q-76 in current output:
  bare sequences, explanations, "Since the terms have a common ratio of…" fragments).

The decoder's difficulty-label heuristic triggers on sub-records because these
sub-records also begin with a difficulty string in the binary. The fix requires
identifying a question-type or record-kind byte in the binary header that
distinguishes top-level questions from sub-records.

## Confirmed Binary Choice Block Structure (v06)

From `inspect:records` hex output on Pre-Calculus 11 Ch01, record 29:

After the body text ends (last `?` or `.` in the question prompt):

```
[body text] [0x0010] A [0x0011] [choice A text] [0x0011][0x0011] B [0x0011] [choice B text] [0x0011][0x0011] C [0x0011] [choice C text] [0x0011][0x0011] D [0x0011] [choice D text]
```

Codepoints:
- `0x0010` = **start-of-choice-block marker** — appears exactly once after the body.
- `0x0011` = **choice field separator** — appears after the choice letter (`A[0x11]`) and
  as a double (`[0x11][0x11]`) between choices.
- `0x000f` = **inline variable/object slot** — appears inside choice text where a
  variable value is to be substituted. At the end of each choice (the `□`), this
  appears as a trailing slot before the final period and choice separator.

Example hex for choice A ending and choice B starting (record 29):
```
...sum of [0f 00] 2e 00 [11 00 11 00] 42 00 [11 00] The series...
         [[slot]] '.'   [end/sep]    'B'    [sep]
```

This confirmed structure can be used to parse choice blocks directly from the
binary instead of relying on the visible-string heuristic.

## Graph Expression Syntax (confirmed from ExamView UI, 2026-05-13)

From the Format Graph - Cartesian dialog (Pre-Calculus 11 Ch03, q-10):

- Functions are listed as `y = <expression>` in f(x) mode.
- The exponent operator is `pow(base, exp)`, NOT `^`. Example: `y = a*(pow((x-p),2))+q` is vertex form.
- Variable names in graph expressions are the same as the algorithmic variable names in the question.
- The graph object is embedded **as an inline `0x000f` slot** in the body text stream, between the question prompt and the choice block. The graph settings (expression, axes, etc.) are stored in a binary blob associated with that slot — the plain-text expression string still appears in the UTF-16LE string stream and is found by the heuristic scanner.
- Decoder fix: `pow()` now converts to `(base)^exp` in Typst/LaTeX and evaluates via `Math.pow()` in the graph sampler.

## Column-Major Choice Ordering (observed, 2026-05-13)

When ExamView displays choices in **2 columns** (status bar shows `Columns: 2`), the binary stores choices in **column-major order**: A, C, B, D — **not** A, B, C, D.

Confirmed for Pre-Calculus 11 Ch03 q-10 (Section 3.2 "vertex | axis of symmetry..."):

| Print order | Binary position | Choice label |
|---|---|---|
| 1st in binary | A (wrong vertex, downward) | A |
| 2nd in binary | C (wrong vertex, upward) | C |
| 3rd in binary | B (correct: right vertex, upward) | B |
| 4th in binary | D (right vertex, wrong axis, distractor intercepts, downward) | D |

This means the current decoder cannot correctly reconstruct slot-based choices in 2-column questions without knowing the column count from the binary. The `Columns: n` value is stored somewhere in the unread choice-block region.

## Variable Naming Conventions — Quadratic Characteristics (observed, 2026-05-13)

From the same q-10 (bimodal, Section 3.2):

| Variable | Meaning | Example rule |
|---|---|---|
| `a` | Leading coefficient; sign determines direction | `range(-15,2,.1)` |
| `p` | Vertex x-coordinate | `range(-15,15,1)` |
| `q` | Vertex y-coordinate | `range(-15,15,1)` |
| `y_int` | y-intercept | `a*p*p+q` |
| `x_int1` | First x-intercept | `p+sqrt(-q/a)` |
| `x_int2` | Second x-intercept | `p-sqrt(-q/a)` |
| `direction` | Correct direction string | `if(a<0,"downward","upward")` |
| `direction_dis` | Distractor direction | `if(a>0,"downward","upward")` |
| `x_int1_dis`, `x_int2_dis` | Distractor x-intercepts | `-1*x_int1`, `-1*x_int2` |

The choice distractors systematically swap p↔q, flip signs, or swap direction to create the four options. This is a general ExamView pattern: correct answer plus three variants that change one attribute at a time.

## Slot-Based Choices (observed, 2026-05-13)

Quadratic-characteristics questions have ALL choice text encoded as `[[slot]]` markers filled from variables — there is NO plain text in the choice bodies (except labels like "vertex:", "axis of symmetry:"). The current decoder cannot reconstruct these choices from the existing approach; it falls back to placeholder text or picks up wrong variables.

These questions need a choice-slot mapper that:
1. Detects when visible choices have all-slot content
2. Assigns the correct post-font variable refs to each choice's slots based on column-major ordering
3. Fills the slots with the resolved variable values

This is distinct from the ANS/DIS pattern — no `ans` or `dis_N` variables are used; instead all choices are built from named variables in a structured block.

## Answer Key Binary Search — Findings (2026-05-13)

Using 13 confirmed answers from ExamView UI screenshots (Q1=A, Q2=C, Q3=B, Q4=C, Q5=B, Q6=B, Q7=B, Q8=A, Q9=B, Q10=B, Q11=B, Q12=C, Q13=D — all from Pre-Calculus 11 Ch03), a comprehensive differential binary analysis was performed.

### What was ruled out

All of the following fixed-position searches returned ZERO perfect groupings (positions where A-records always share one value, B-records share another, C another, D another):

- Every byte position 0..4627 from record start
- Every byte position 0..300 from record end
- Every byte position in the 242-byte binary gap at the end of each record
- Every byte position ±500 from the first "Times New Roman" (fontOffset)
- Every byte position in the 2437-byte post-font region (from fontOffset)
- Every byte position 0..508 from the choice block start ([0x10 41 00 11 00])
- Every byte position 0..2008 from choice block start to second "Times New Roman"
- ±500 bytes from the second "Times New Roman"

### What was discovered

1. **All 13 records have an identical 242-byte binary gap** at the end (between the last readable string and the next record's difficulty label). Non-zero positions within this gap: 2, 226-230, 238. None of these cleanly encode the answer.

2. **The first "Times New Roman" in each record is a font reference within the choice block binary**, NOT the end of the display region. The true display end is at the second (or later) "Times New Roman" occurrence.

3. **The choice block binary contains one "Times New Roman" pair per choice** for questions with graph-image choices. The two TNRs within each choice's binary record are consistently 144 bytes apart. For a 4-choice question, this produces 4 close-pairs of TNR markers. The spacing between choice blocks varies by question type.

4. **Record 11 (Q12, answer C) has only ONE "Times New Roman"** — a structurally simpler question whose choice content doesn't require multiple font markers. This invalidates the "second TNR as reference point" approach.

5. **Position 2 in the 242-byte gap shows a near-monotonic pattern with answer order** (A tends toward smaller values, D toward larger), but the ranges overlap significantly between answer groups, so it doesn't encode the answer cleanly.

### DLL Analysis findings (2026-05-14)

The ExamView software binaries are available at `ignore/ExamView/`. Key strings found:

**From `evengine2.dll`:**
- `EVGetCorrectAnswer` — COM method to retrieve the correct answer from a loaded question
- `Answer: %c` — the answer is formatted as a single character for display
- `<answer>%c` — XML export format: `<answer>A</answer>` (or lowercase letter)
- `CorrectAnswerWWW` — COM property name for the correct answer
- `CQuestion` class (`.?AVCQuestion@@`) — the MFC class that holds question data
- `IQuestion`, `IQuestion2` — COM interfaces with `get_CorrectAnswer`/`EVGetCorrectAnswer` methods

**From `evfbb.dll` (bank file binary handler):**
- `choice-a` through `choice-z` — XML choice identifiers (lowercase letters)
- `<CORRECTANSWER` / `CORRECTANSWER` — XML element that stores the correct answer
- `AnswerChoice`, `AnswerChoiceSequence` — answer-related properties

**From `evpro.exe` (main application):**
- `FSCBNK1`, `FSCBNK3`, `FSCBNK#` — three format version identifiers (1, 3, 6+)
- `FSCBNK#W#06#00#` — the version 06 header we work with

**Conclusion:** The answer IS stored in the BNK binary as a single character byte (`%c` = 'A', 'B', 'C', 'D' or lowercase equivalent). The `EVGetCorrectAnswer` COM method reads it from the `CQuestion` serialized object.

### Choice block binary structure (2026-05-14)

The binary section after the readable choice content (after the last `[0x0011][0x0011]` double separator) has a consistent structure:
- All records begin with 20 bytes of zeros from the true binary start
- At offset 20 from the true binary start: `01 00 03 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ff ff 00 00 00 00 00 00 01 00 00 00 ...` — this IDENTICAL PATTERN appears in all 13 known-answer records regardless of which answer is correct
- This means the first ~438 bytes from this header are a FIXED RTF TEMPLATE, not containing the answer

### Next steps for finding the answer

The answer byte is at a **variable position** within the binary section that is NOT in the first 438+ bytes of the fixed RTF header region. Most likely approaches:

1. **Disassemble evengine2.dll or evfbb.dll** to find the CQuestion::Serialize() method and trace the exact byte offset at which the answer char is written to the CArchive
2. **Get an ExamView XML export** of any bank — the `<CORRECTANSWER>` element will map directly to a position in the binary
3. **The `evplay.exe` or `evimport.exe`** may have more readable import parsing code that reveals the answer field structure
4. **Look for the answer WITHIN EACH CHOICE'S binary sub-record** (the 4 sub-blocks between TNR pairs) — each choice may carry an `isCorrect` flag byte

Ground truth data for differential analysis: Ch03 Q1=A, Q2=C, Q3=B, Q4=C, Q5=B, Q6=B, Q7=B, Q8=A, Q9=B, Q10=B, Q11=B, Q12=C, Q13=D (from ExamView UI screenshots, 2026-05-13).

## Known Bugs (as of 2026-05-13)

| Bug | Affected questions | Status |
|---|---|---|
| Answer is raw ANS sample value instead of choice letter | q-29 and others where ANS embeds in a sentence choice | Partially fixed: substring-match fallback added; true fix needs answer key byte |
| Correct-answer choice missing from choice list | q-18 ("How many terms…") — n=11 is the answer but no choice contains 11 | Open — inference recovers distractors but misses ANS choice in some patterns |
| 76 clusters decoded instead of 30 actual questions | All Ch01 records | Open — needs question-type/record-kind byte in binary header |
| Graph inline slot interpolated as variable value | Graph questions where first body slot is the graph image (e.g. Ch03 q-10) | Partially fixed — graph-image body slots skipped; body instead shows graph expression from graphDefinitions |
| Slot-based choices not decoded | Questions where all choice text is variable slots (e.g. Ch03 q-10) | Fixed — inferSlotBasedChoices fills slots from post-font refs in column-major order, then sorts A→D |


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

## Version 06 Question Records (structural, 2026-09)

Teacher-made banks (Pre-Calculus 11 and 12 (Mickelson)) carry no difficulty, topic or
algorithm strings, so the string-cluster scan finds nothing in them. Their records are read
structurally by `packages/bnk-core/src/records.ts`; every record in all 35 Pre-Calculus 12
(Mickelson) files and in Pre-Calculus 11 (Mickelson) 4.6 splits into blocks with no bytes left
over. The same record header appears in publisher banks, but there variable-length metadata
and algorithm blocks sit where the first text block would be.

File header (inflated payload): int32 bank id at 0x0, bank title UTF-16 at 0x4, section title
UTF-16 at 0x16c.

Record header (found anywhere by its signature):

| Offset | Field |
| --- | --- |
| +0x00 | int32 ExamView question number (not contiguous) |
| +0x04 | int32 bank id |
| +0x08 | int32 type: 0 T/F, 2 and 4 MC, 5 yes/no, 7 completion, 8 matching, 9 short answer, 10 problem |
| +0x0c | int32 -1 |
| +0x10 | int32 bank id |
| +0x14 | int32 1 |
| +0x18 | int32 1 for written-response types |
| +0x1c | int32 answer: MC choice index (0 = a), T/F and yes/no 0 = True/Yes, 1 = False/No; written types store another value here |
| +0x24 | int32 MC choice count |
| +0x21c | first rich-text block (metadata-free records) |

Verified: T/F and yes/no answers against the statements, MC indexes against worked answers
(e.g. 1.6 q8 `y = 3|f(x)| + 1` → choice d), and publisher Pre-Calculus 12 Chapter 01 MC
records 1-4 (answers 2, 2, 0, 3) against the printed key C, C, A, D.

Blocks chain by length until the next record: block 0 is the question, block 1 the written
answer (short answer, problem) or a choice question's rationale.

Rich-text block layout:

| Part | Size |
| --- | --- |
| header | 15 int32: byteLength, 1, charCount, paragraphRuns, paragraphStyles, charRuns, charStyles, faces, 0, 0, tables, tableCells, objects, 1, 0 |
| text | charCount UTF-16 units + 2-byte terminator |
| paragraph runs | 12 bytes each: start, style, 0 |
| paragraph styles | 168 bytes each (6-byte prefix + 162) |
| character runs | 12 bytes each: start, style, 0 |
| character styles | 24 bytes: size, flags (1 bold, 2 italic, 4 underline), face index, weight, pitch/charset, 0 |
| faces | 66 bytes each, UTF-16 face name |
| tables | 20 bytes each (int32 position of the 0x10 marker first) |
| table cells | 52 bytes each: int32 content start; int16 flags at +20 (2 first cell of a row, 4 row-end marker, 8 last row) |
| object headers | 72 bytes each: int32 text position, 0, 0, width and height in twips, …, int32 kind at +36 (1 equation, 0 picture) |
| object payloads | int32 length + bytes, in object order |

Text control characters: 0x09 tab (default stops every 0.5 in), 0x0d paragraph, 0x0f object
(matched to its object by position), 0x10 table start, 0x11 cell end (each row ends with an
extra empty marker cell, flag 4). Characters in a "Symbol" face run, and U+F0xx, use the Adobe
Symbol encoding (e.g. U+F0A5 ∞).

Equation payload: 11 int32 layout fields, then a token stream:

- `0x09` + int32, int32 class, int32 flags: style for the following characters. Class -11
  regular, -10 Greek (Symbol letters: p π, q θ, a α, Q Θ), -6 Symbol operators (° ± ≤ ≥ ≠ × ≈),
  -9 extra symbols (0x9e ∘).
- `0x01` int16 flags, int16 0, int32 slot count, int16 kind, int16 variant, 8 bytes: template;
  slots follow as lines, each slot after the first preceded by int32 0. Kinds seen: 0.0 ( ),
  0.2 { }, 0.4 | |, 1.0 fraction, 1.1 small fraction, 1.2 slash fraction, 1.5 square root,
  1.6 nth root (radicand, index), 1.7 long division (dividend in the slot), 2.0 superscript,
  2.1 subscript, 2.4 left subscript (applies to what follows, as in ₆C₃).
- `0x0d` line break (also found inside slots, where authors type derivations into a
  denominator), `0x00` end of line, anything else one Windows-1252 character. Letters typed
  together are separate variables ("sinx" = sin x); the payload is zero-padded after the root line.

Picture payload: int32 1, int32 width+1, int32 height+1 (twips), then a Windows DIB
(BITMAPINFOHEADER, uncompressed, 8-bit or 1-bit in this corpus). `dibToPng` output is
pixel-identical to ImageMagick's decoding of the same DIB.

Teacher conventions to expect: multiple-choice choices typed into a borderless table at the end
of the stem (`a. | … | c. | …` / `b. | … | d. | …`, so map by label); graphs pasted as bitmaps
(there are no ExamView graph objects or algorithm blocks in the Mickelson banks); text art laid
out with tabs and spaces.
