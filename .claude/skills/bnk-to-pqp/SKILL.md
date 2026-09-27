---
name: bnk-to-pqp
description: Turn an ExamView .bnk question bank into Portable Question Package (.pqp.json) files that import cleanly into test-generator, including algorithmic questions and redrawn graphs. Use when converting ExamView banks, extending the BNK decoder, attaching ExamView algorithms, or checking PQP output before import.
---

# ExamView BNK → PQP for test-generator

Everything here was learned converting the McGraw-Hill **Pre-Calculus 12** bank (Manitoba Pre-Calculus 40S, chapters 01–11, 696 questions, 147 algorithmic; route A) and the teacher-made **Pre-Calculus 12 (Mickelson)** bank (35 section files, 525 questions, no printout; route B) into PQP files that pass every gate and load in test-generator. Paths are relative to the bnk-decoder repo unless noted.

## The goal and the bar

A bank is done when **every** gate in `npm run check:pqp` passes (see [Gates](#gates-definition-of-done)) and a teacher can import it and build a test without fixing anything by hand. Aim for a correct subset over a complete but wrong set: a question that can't be made right is kept as a fixed (non-algorithmic) question, or left out with a diagnostic, never shipped wrong.

## Pick a route

| Route | Input | Quality | Use when |
|---|---|---|---|
| **A. Printout + Mathpix** (proven) | ExamView's own PDF and RTF of the bank, plus Mathpix LaTeX `.zip`s of the PDF | High: math, tables and pictures as printed | A PDF/RTF export and Mathpix output exist or can be made |
| **B. Direct decode** | The `.bnk` only | High for metadata-free (teacher-made) banks, whose records are read structurally; lower for publisher banks, where the string-scan decoder still misses embedded math and pictures | No printout is available |

Route A's text comes from the printout, and the BNK supplies what the printout can't: algorithm blocks and graph objects. Route B uses the BNK for everything. Either way, algorithms and graphs are attached from the BNK with `attach-algorithms.mjs`.

Check which inputs exist before starting:

- `ignore/ExamView/Banks/<bank>/` holds the `.bnk` files (on `main` these are tracked in git).
- `ignore/Mathpix/<bank>/` holds Mathpix zips (route A); `ignore/Examples/` holds ExamView PDF/RTF/TST printouts used as answer-key oracles.
- **No Mathpix API key is configured.** Only the Mathpix desktop app is installed. Don't lift its session token for scripted use; if route A is needed and no zips exist, ask the user to run Mathpix.
- ExamView itself (`ignore/ExamView/evpro.exe`) and `wine` exist, so printing a bank to PDF/RTF through ExamView is possible in principle but untested. Ask before trying it.

## The BNK container (v06)

- A 16-byte ASCII header, `\x1aFSCBNK#W#06#00#` (bank) or `…FSCTST…` (test), then a zlib stream: `zlib.inflateSync(bytes.subarray(16))`. Only version 06 is supported.
- Strings are UTF-16LE, often in fixed-width buffers (NUL-terminated). Scanning the inflated payload as latin1 with `\x00` stripped is a quick way to eyeball content.
- Question metadata strings (topic, objective, `NAT` outcome, `DIF` difficulty, `KEY`, `REF`) sit near each question record.
- Banks differ in layout. The publisher's chapter banks (40–60 KB each) decode through `decodeBnkFile`'s string-cluster scan. **Teacher-made banks** (Mickelson Pre-Calculus 11 and 12: small files, one section each, no difficulty/topic metadata) find 0 clusters; `decodeBnkFile` then reads their **question records structurally** (`V06_QUESTION_RECORDS`), which also carries text formatting, tables, equations and pictures exactly. Full layout in `FORMAT_NOTES.md` ("Version 06 Question Records"); code in `packages/bnk-core/src/records.ts`, `equations.ts`, `record-typst.ts`, `record-questions.ts`.
- **Question record:** `int32 question number, bank id (= first int32 of the payload), type, -1, bank id (0 in some matching items), 1`; answer at +0x1c (choice index, 0 = a / True / Yes; a bitmask for multiple response, bit 0 = a), choice count at +0x24 (for a matching item, the index of its match). Type codes: 0 true/false, 2 and 4 multiple choice, 3 multiple response, 5 yes/no, 7 completion, 8 matching item, 9 short answer, 10 problem.
- **Matching group record:** a 44-byte header `int32 number, bank id, choice count, 1|2, 1, 1, 0, 0, 0, 0, 4` then one block with the prompt and lettered choices; the type-8 items in the file index into it. One group per file so far; items are left out if a file has more. A group record between two questions otherwise looks like extra blocks and breaks the framing check. Without metadata the first rich-text block is at +0x21c; blocks chain by length to the next record (block 0 question, block 1 answer or rationale). Every Mickelson record splits with no bytes left over, which is the check that the layout is right.
- **Rich-text block:** a 15-int header of counts, UTF-16 text, then paragraph runs/styles, character runs/styles (bold 1, italic 2, underline 4; face "Symbol" means Symbol-font glyphs), face names, tables, and objects. In the text, `0x0f` marks an object, `0x10` starts a table, `0x11` ends a cell (a row ends with an empty marker cell), `0x0d` is a paragraph, `0x09` a tab (default stops every 0.5 in).
- **Equation objects** are a token stream, not MathType: `0x09` style (class -11 regular, -10 Greek, -6 Symbol, -9 extra: ∘, 0x98 ℝ, 0xbd ℕ), `0x01` template (slot count, kind.variant: 0.0 ( ), 0.2 { }, 0.4 | |, 0.19 piecewise brace [rows are the slot's lines], 1.0/1.1 fraction, 1.2 slash fraction, 1.5 √, 1.6 nth root [radicand, index], 1.7 long division, 2.0 sup, 2.1 sub, 2.4 left sub, 3.2 summation [body, lower, upper]), slots as lines ended by `0x00` (later slots after an int32 0), `0x0d` line break, `0x05`–`0x08` spaces (narrow to wide), `0x0b` int32 shape + line = geometry name (0 △ABC, 1 ▱ABCD). When a new bank reports an unknown control byte or template, dump the token stream around it (the equation object carries its payload `range`) and read it against the surrounding question text; `lastRecordFailure` says why a file's records didn't frame. **Pictures** are uncompressed DIBs (8- and 1-bit) → PNG (`dibToPng`, pixel-identical to ImageMagick's decoding).
- Keep the decoder **structural**: no per-question content patches (`DECODER_DIRECTION.md`). Hand fixes go in override files with a `note` explaining why.

## Route A: printout + Mathpix

1. In ExamView, print the bank as PDF and RTF (the RTF is the answer-key oracle). Run the PDF through Mathpix; keep one LaTeX `.zip` per chapter in `ignore/Mathpix/<bank>/`.
2. `npm run pqp:mathpix -- <zip-dir> <out-dir> [data/pqp-overrides/<bank>.json]` converts to PQP.
3. `npm run pqp:algorithms -- <out-dir> <bnk-dir> [data/algorithm-overrides/<bank>.json]` attaches algorithms and graph templates where they're proven safe.
4. `TEST_GENERATOR_DIR=<checkout> npm run check:pqp -- <out-dir> ignore/Examples` must pass.
5. `npm run pqp:precalc12` runs steps 2–3 for Pre-Calculus 12 into `reports/pqp/pre-calculus-12/`. Copy this pattern into a new `pqp:<bank>` script.

### What `mathpix-to-pqp.mjs` handles (keep these when changing it)

- **Splitting questions:** the start pattern is `/^(\d+)\.(?!\d)\s*(.*)$/`, and the next number must be the expected one (`isNextNumber`) so "2. 5" inside math doesn't split. Normalize full-width characters first.
- **Sections** (MULTIPLE CHOICE, SHORT ANSWER, MATCHING, …) set the type; matching blocks become numbered items with a "1 → A" key.
- **Answers:** parse the `ANS:` lines, including array forms. Drop a solution that is only the MCQ letter.
- **Choice pictures:** Mathpix crops are 254 px per inch. A printed 2×2 choice grid is A top-left, B bottom-left, C top-right, D bottom-right; assign crops by position (`splitFigureChoices`, `assignGridChoices`).
- **LaTeX → Typst pitfalls,** each of which broke real questions:
  - `^{…}` → `^(…)`; an empty prescript `{ }` → `""`.
  - `\sqrt` with nested braces needs brace matching, not a regex (17 questions lost roots before this).
  - Fractions with an empty denominator; unbalanced parentheses must be escaped.
  - `aligned`/`array` bodies become multi-line display math. Inline `\(`…`\)` and `$` wrappers around environments must be unwrapped.
  - Keep operators like `!=`, `<=`, `->` together when spacing operators.
  - `tabular` → Typst tables, including `\multicolumn`. Split cells only at top-level `&`, never inside math or environments.
  - Unescape LaTeX specials in text (`\%`, `\&`, `\$`); escape Typst specials (`#`, `$`, `[`, `]`, `*`, `_`, `@`, `<`) in text.
  - Remove orphan `itemize` markers and leftover tabular column specs.
- **Picture names** are short and stable: `${bankPrefix}-chNN-NN` (such as `pc12-ch01-07`), numbered in page order.
- **Tags:** `examview`, one corpus tag (`source: McGraw-Hill Pre-Calculus 12`; the record converter takes it from the bank config's `corpus`), and ExamView's `KEY` topic keywords, cleaned (`keywordTags`: cut at `NOT:` notes, table/LaTeX debris and run-on instructions, rejoin wrapped phrases, at most six words). **Don't tag anything that is already a category**: not the class, not curriculum outcomes (the unit and section), not the question type. Keep `true-false` and `yes-no`, which test-generator stores as plain multiple choice. Test Generator lowercases tags and splits them at commas, so a comma in a tag becomes two tags (that is how long outcome statements turned into fragments like "and tangent to solve problems.").
- **Curriculum:** the Manitoba Pre-Calculus 40S outcome (from ExamView's `NAT` field, or inferred from the topic) sets `classId`/`unitId`/`sectionId` and the names. Class `pre-calculus-40s` (Pre-Calculus 40S); units such as `relations-and-functions`; sections are outcome codes such as `12P.R.2`.
- **Overrides** (`data/pqp-overrides/<bank>.json`, keyed by chapter and then source question number, such as `"MULTIPLE CHOICE 7"`): `answer`, `choiceImages`, each with a `note`. Use them only when the OCR is unrecoverable, and check against the RTF.

## Route B: direct decode

- **Metadata-free banks:** `node --experimental-strip-types scripts/bnk-records-to-pqp.mjs <bnk-dir> <out-dir> data/pqp-banks/<bank>.json [data/pqp-overrides/<bank>.json]` writes one PQP per BNK file plus `assets/<section>/*.png`, `summary.json` and a README listing what was left out and why. `npm run pqp:mickelson12` is the worked example (then `pqp:algorithms`, which pairs `<section>.pqp.json` with `<section>.bnk`).
  - The bank config names the bank, an id/picture prefix, the `course` (`pre-calculus-40s`, the default, or `pre-calculus-30s`; tables with the official Manitoba outcome wording are in `scripts/manitoba-curriculum.mjs`), the npm `script` name, chapter names, and each section's outcomes (primary first). Choose them by reading the section, not its title (Mickelson's "standard form" is y = a(x − p)² + q); a section with no outcome in the course gets a `unitId` and its own title as section, with a `note`. Unknown outcome codes are an error. `npm run pqp:mickelson11` is the 30S example.
  - Multiple response ships as a written response with the choices listed and the correct letters as the answer (test-generator's multiple choice has one key). Each matching group ships as one `matching` question: prompt, lettered choices, numbered items, a "1 → C" solution and a "1:C; 2:F" text answer, the same shape as the Pre-Calculus 12 Mathpix output.
  - Teacher-made multiple choice types its choices into a borderless table at the end of the stem (`a. | choice | c. | choice` / `b. | … | d. | …`); `findChoiceTable` maps choices by label, never by position. True/false and yes/no become `mcq` with two choices, so the key survives import (test-generator only reads `choice` answers).
  - A question is left out when anything is unmapped (glyph, template, control code), a choice is empty or duplicated, the key is out of range, or an override excludes it. Pictures of left-out questions aren't written.
  - Rendering details that mattered: pictures are `#box(image(...))` so pictures typed side by side stay side by side; an equation typed against a word gets a space ("√x has"); tab-laid-out lines (letter pyramids, two-column lists) use measured 0.5 in tab stops (`#context` + `measure`); a line break anywhere in an equation means display math.
- **Other banks:** `npm run decode:file -- <file.bnk> [out-dir]` writes `.json`, `.pqp.json` and `.typ`. Check with `npm run report:quality -- <decoded-dir>`, but **"clean" scores aren't semantic checks**; compare with any printout (`npm run audit:pdf`). The string-scan path still misses OLE/MathType equations, WMF pictures and some format runs. Don't ship a question that still contains a placeholder or garbled text.
- **Answers without a printout:** run `check:pqp` with `--bnk <bnk-dir>` (below). That proves the keys were carried over from the BNK faithfully, **not that the teacher's key is right**. Read every question and work each key: the Mickelson 12 review found 21 authoring errors in 525 questions, and **Mickelson 11 had 91 in 414** (22%), mostly in short answers and word problems: wrong simplifications, wrong signs, missed second solutions, wrong restrictions, answers for a different function, mixed units, worked solutions that end on a different value from the key, and choices where two or none are right. Check algebra numerically (evaluate the expression and the key at a few values) rather than trusting a skim; check keys that depend on a picture by rendering it. Exclude rendering problems too (a degree sign pasted as a picture, words typed inside an equation that split into letters). Exclude those with `{ "exclude": true, "questionNumber": n, "note": "…" }` in `data/pqp-overrides/<bank>.json` (keyed by section file, then source question number); never rewrite the teacher's content.

## Algorithms (both routes)

`attach-algorithms.mjs` reads the BNK's algorithm blocks (`packages/bnk-core/src/algorithms.ts`), matches blocks to questions (a DP alignment over question order and text), and attaches an `algorithmModel` only when test-generator's **Calculate values** is proven to produce correct versions.

**Block layout:** `int32 byteLength`, then entries of 8 int32 fields:

| Field | Meaning |
|---|---|
| nameLen, ruleLen, displayLen | lengths of the three strings |
| kind | 0 = variable, 3 = condition |
| valueType | 1 = number, 2 = string |
| format | 0 plain; 1 fixed decimals; 4 always signed; 5; 6 decimals with digit grouping |
| decimals | decimal places |
| flags | |

Then a float64 sample value, then the UTF-16 name, rule and display strings. Five metadata strings sit just before the block. References to values in text are UTF-16 `"X"` + name; in equations they are `0x0a` + UTF-16 name.

**Rules** are ExamView expressions such as `range(-9,9)`, `rand(5)`, `choose(i, a, b, c)`, `round(x, 2)`, `fracs(a, b)` and `sqrs(n)`. `translateRule` rewrites them for test-generator's engine:
- Space function calls correctly; case-sensitive `ROUND(` handling (a case-insensitive regex looped forever).
- An indexed `choose` becomes an `if` chain.
- Order definitions by dependency, since ExamView evaluates in dependency order.
- Negative powers need parentheses: `-6**4` is a JavaScript syntax error.

**Displays** such as `\x01…` / `…` are ExamView fraction and square-root displays; they become `frac(a, b)` / `sqrt(n)` with the sign handled.

**Value slots:** the model records exactly where each value is printed (`{name, field, text, occurrence}`), with whitespace-tolerant matching, so recalculation replaces those spots instead of guessing.
- `promoteSignedTerms` shows "x –9" as a signed term "x − 9" in math only, changing the display, never the slot text.
- Display formats go in `definition.display` (`sign: 'always'`, `decimals`, `group`).

**Gates** (a question that fails any of them stays fixed, with the reason in `extensions.examview.algorithm.reason`):

| Gate | Meaning |
|---|---|
| TEXT_MISMATCH | Printed values can't be located |
| NO_DISPLAYED_VARIABLES | Nothing printed depends on the values |
| UNREADABLE_DISPLAY | A display can't be decoded |
| UNSUPPORTED_RULE | A rule can't be translated |
| OUTSIDE_VARIABLE | A rule uses a variable outside the block |
| PICTURE | Pictures and ExamView graphs don't pair one-to-one |
| GRAPH_UNSUPPORTED | x = f(y) curves, circles, rays or free text |
| GRAPH_MISMATCH | The redrawn graph covers less than 70% of the printed picture's ink |
| GRAPH_UNVERIFIED | The picture can't be read or checked |
| MISSING_GRAPH | A variable graph has no picture in the question |

Also checked:
- A displayed value also typed as fixed text is an authoring flaw; ask for an override.
- Choices that can coincide get a distinct-choices condition.

**Overrides** go in `data/algorithm-overrides/<bank>.json`, per question: `conditions` (extra conditions, such as pinning `m=50`), `acceptFixedText`, and a `note`. Each fixes a real ExamView authoring flaw found in review. Don't use them to paper over decoder bugs.

## Graphs (both routes)

`packages/bnk-core/src/graphs.ts` reads Cartesian graph objects:

- **Size:** `byteLength` = 2456 + 1796 per item.
- **View:** four view strings (centre x and y).
- **Axes:** the x axis is at +0x86c and the y axis at +0x8fc. Each has a label, scale (f64 at +0x18), ticks per inch (+0x20), ticks per label (+0x24), and label flags (+0x88 / +0x8c).
- **Items:** at +0xa1c + k×0x704, addressed from the main string E:
  - E−0x80 domain min, E−0x60 domain max, E−0x40 display condition
  - E−0x20 type: 0 = y = f(x), 1 = x = f(y), 3 = circle, 6 = point, 7 = segment, 12 = text, 18 = ray
  - E−0x14 colour: 1 = black, 2 = blue, 6 = red
  - E−0x08 width: 300 = thin, 600 = thick
- **Points:** x at E, y at E+0x20, marker at +0x60 (1 = solid, 2 = hollow), label style at +0x64 (1 = coordinates).
- **Frame size:** in twips − 1, found just before the object. Otherwise use crop pixels ÷ 254.
- **Choice graphs are stored in A, C, B, D order** (column-major), unlike the printed grid.

`scripts/graph-templates.mjs` turns a graph object into a **Math Graph** template (test-generator's graph format) with the variables left in:

- **Window:** centre ± (inches × ticks per inch × scale ÷ 2 − scale).
- **Ticks:** `xtick`/`ytick` = scale; `xlabelEvery`/`ylabelEvery` = ticks per label; `tickLabels` from the label flags.
- **Objects:** functions with `visibleIf` for conditions; points labelled `({x}, {y})`; segments. Text items merge into point labels.
- **`showFeatures: true`:** test-generator widens the window to keep roots and asymptotes visible, draws dashed, captioned asymptotes, and labels clean roots.

Each template is verified by drawing it with the sample values and matching it against the printed picture (≥ 70% ink overlap, `matchPicture`). This catches both decoding errors and wrong picture pairing.

## PQP essentials

One `.pqp.json` per chapter or section. Each question has:

- `content.stem`, `content.choices[]` and `content.solution` with `format: "typst"`.
- The answer, and scoring (points).
- `classification`: `questionType`, `tags`, `classId`/`className`, `unitId`/`unitName`, `sectionId`/`sectionName`, `curriculum`, `source`.
- `provenance.sourceQuestionNumber`, such as `"MULTIPLE CHOICE 7"`.
- `extensions.algorithmModel` (`definitions`, `slots`, `graphs`), `extensions.examview` and `extensions.decodeDiagnostics`.

Pictures are package `assets` stored under `assets/<chapter>/`, and questions reference them as `#image("/imgs/<name>", width: …)`.

The algorithmic features (value slots, ExamView functions, graph templates) need test-generator `main` at or after the "Merge algorithmic questions, redrawn graphs and faster bank saves" commit. See test-generator's `docs/user-guide/portable-question-package.md` and `algorithmic-questions.md`.

## Gates (definition of done)

```sh
TEST_GENERATOR_DIR=/path/to/test-generator npm run check:pqp -- <out-dir> [<rtf-dir>] [--bnk <bnk-dir>]
```

It checks:
- **Typst:** every stem, choice and solution compiles (batched through `#block(include …)`).
- **Answer keys** match the RTF export, and section counts match (it converts RTF with `soffice`). Skipped when no RTF directory is given.
- **BNK answer keys** (`--bnk`, for banks with no printout): every choice key equals its record's answer field (read by a minimal header reader inside `check-pqp.mjs`, independent of the decoder), multiple-response letters equal the record's bitmask, every matching item's key equals its record's match index, two-option questions have the right True/False or Yes/No choices, choice counts match, and every record is shipped or listed as left out.
- **No placeholders or garbled text** (replacement/private-use/control characters, `[embedded …`, `not decoded`), and every picture is a present, used asset.
- **Import:** test-generator's own importer accepts every question.
- **Every algorithmic question:**
  - 100 seeds resolve with no warnings;
  - 25 generated versions compile, including their redrawn graph SVGs;
  - no duplicate choices;
  - each rule recomputes the same value;
  - every picture has a graph template.

Also look at the results. Render a few generated versions side by side with the original, and check graph windows, labels and choice pairing by eye. Tools needed: `typst`, `soffice`, `magick`, Node 22 (`--experimental-strip-types`).

## Delivering to a teacher's workspace

```sh
TEST_GENERATOR_DIR=/path/to/test-generator node --experimental-strip-types \
  scripts/export-testgen-bank.mts <pqp-dir> ~/TestGen/banks/<new-folder> "<Bank name>" [id-prefix]
```

This writes a workspace bank folder with the app's own writer, building the curriculum from the packages. It refuses to overwrite an existing folder. In the app, choose **Reload workspace**. To change an existing workspace bank, read it with `importRepoEntriesToAppData`, change it, and write it back with `exportAppDataToRepoEntries`, so anything the teacher edited in the app is kept.

## Hazards

- On bnk-decoder `main`, `ignore/`, `reports/` and `node_modules/` are **tracked**. Checking `main` out over a working directory where they're ignored overwrites local files silently. Use a separate worktree.
- Use test-generator `main` for `TEST_GENERATOR_DIR`. Older branches drop slots and graph templates, which shows up as text changing while graphs don't.
- ExamView authoring flaws are common: stems with a hard-coded number, rounding that makes the key wrong, choices that can coincide. The gates find them; fix each with a reviewed override and a note.
- Report honestly: counts per gate, what was kept fixed and why, and what wasn't verified.
