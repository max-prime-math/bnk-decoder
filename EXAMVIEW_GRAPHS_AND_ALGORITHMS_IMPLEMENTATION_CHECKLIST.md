# ExamView Graphs and Algorithms Implementation Checklist

## Immediate Fixes

- [ ] Add regression check: Chapter 03 matching group has exactly 4 items.
- [ ] Add regression check: Chapter 11 matching group has exactly 5 items.
- [x] Replace broad matching proximity linking with evidence-based item linking.
- [x] Add diagnostics when matching-group item count cannot be recovered.

## Shared Model

- [x] Add graph object fields for display condition, point style, label style, relation, color, shading, point coordinates, and ray data.
- [x] Preserve point objects through TestGen JSON and PQP import.
- [x] Preserve number-line rays through TestGen JSON and PQP import.
- [x] Preserve conditional graph item fields through TestGen JSON and PQP import.
- [ ] Render graph model point objects in TestGen.
- [ ] Render graph model number-line rays in TestGen.
- [ ] Render conditional graph items in TestGen.

## Algorithm Parser/Evaluator

- [ ] Parse and preserve duplicate `Condition` definitions distinctly.
- [ ] Normalize ExamView `Condition` records to `condition_1`, `condition_2`, etc. without losing their UI label.
- [ ] Evaluate `comb`, `perm`, and factorial.
- [x] Materialize `comb`, `perm`, and factorial-style matching-choice expressions from stored sample values.
- [ ] Evaluate `fracs`, `mixfracs`, and `rfracs` as display strings and math objects.
- [ ] Evaluate `range`, `rand`, `choose`, and `if` deterministically from stored sample values when present.
- [ ] Preserve unresolved values with diagnostics instead of converting them into opaque support tokens.

## Graph Extraction

- [ ] Recover `f(x)` item expressions from graph object records.
- [ ] Recover `Display function only if` conditions.
- [x] Recover graph point objects and their styles from table/scatter plot records.
- [x] Recover hollow points for rational-function holes.
- [x] Recover number-line ray objects.
- [ ] Recover graph axis/view metadata when available.
- [ ] Preserve degree-mode trig conversions such as `pi*x/180`.

## Bitmap/OLE and Pictures

- [ ] Classify `Format Picture` objects separately from graph objects.
- [x] Preserve inserted bitmap assets detected by file signatures and carry them into TestGen import packages.
- [ ] Preserve picture crop metadata.
- [ ] Confirm extracted route/grid diagrams match PDF output.
- [ ] Keep OLE/math objects as structured inline assets when semantic parsing is unavailable.

## PDF Reference Pipeline

- [x] Implement first-pass PDF text audit: `scripts/audit-pdf-reference.mjs`.
- [x] Parse printed question blocks by chapter, number, answer, and visible choices from `pdftotext -layout` text.
- [ ] Render page images for visual QA.
- [ ] Crop graph/image-heavy question regions.
- [x] Compare decoded question text, answers, and choices to PDF reference by printed order.
- [ ] Use PDF crops only as fallback assets or QA references, not as the semantic source.
- [x] Manually verify Chapter 11 combinatorics matching choice F against PDF/RTF reference and recover it structurally from algorithm-variable variants.

## Grade 12 Screenshot Regression Targets

- [x] Chapter 03 matching group: quotient/divisor/remainder/dividend.
- [ ] Chapter 05 MC #5: radians sine graph, variables `a_graph`, `b_graph`.
- [ ] Chapter 05 MC #6: degrees cosine graph, `pi*x/180`.
- [ ] Chapter 05 MC #13: `a*cos(b*(x+pi/c))-d`.
- [x] Chapter 07 short-answer #7: scatter plots as point objects.
- [x] Chapter 07 short-answer #8: investment scatter plot as point objects.
- [x] Chapter 09 MC #11: rational graph with hollow point `(hole, y_var)`.
- [ ] Chapter 10 MC #8: conditional sine/cosine graph items.
- [x] Chapter 03 problem #14: number-line rays from `-1` left and `1` right.
- [ ] Chapter 11 short-answer #3: 256-color bitmap route diagram.
- [x] Chapter 11 matching group: combinatorics expression matching.

## Latest Measurement (2026-06-14)

- Grade 12 BNK-only object-math reports: `reports/math-object-pass-20260614e`.
- Decoded count: 732 Grade 12 questions across Chapters 01-11.
- Matching: Chapter 03 and Chapter 11 groups still recover 9 total nested items and 9 answer mappings; unresolved matching candidates remain diagnostic-only.
- Graphs: 510 graph objects preserved (`function`, `point`, and 2 `ray` objects).
- Algorithms: 460 algorithm-bearing questions / 3815 definitions.
- Internal quality: 721 clean, 10 suspect, 1 garbage, 4 bad choice tokens, 93/100 average.
- Placeholder accounting: 58 bodies still contain embedded placeholders; 123 total body "not decoded yet" markers remain after conservative rejection of unsafe scalar/diagram substitutions.
- Chapter 01 transformation prompts: compact BNK object math now recovers early function slots such as `f(x) = x^2`, `g(x) = x^2 - 9`, `g(x) = f(x - 2)`, and `g(x) = f(x + 3)`.
- Chapter 10 function-combination prompts: mixed-encoding object math now recovers body equations such as `f(x) = x^2 - 3`, `g(x) = -9 - x`, and `y = f(x) + g(x)`, with low-substance object choices recovered only when display label order is available.
- Object-math finding: these runs are not OLE/MathType in the inflated BNK; byte `0x7f` is an overloaded marker for exponents, function-call/group delimiters, and absolute-value-like grouping, with algorithm sample values supplying numeric and operator terms.
- Previous PDF audit: `reports/precalc12-pdf-audit-20260614` had 717 compared question positions, 385 low-similarity stems, 180 decoded questions with placeholders, 271/305 answer matches, and 153/402 choice matches.

## Low-Hanging Fruit Follow-Up (2026-06-14)

- Spot report: `reports/spot-all-20260614-metadata-graphs-currency`.
- Internal quality: 724 clean, 7 suspect, 1 garbage, 4 bad choice tokens, 94/100 average.
- Placeholder accounting: 57 bodies still contain embedded placeholders; 120 total body "not decoded yet" markers remain.
- TestGen metadata bridge: exported questions now include decoded class name, chapter/section ids and names, and ExamView/topic/difficulty/reference/title tags for import-time bulk curriculum assignment.
- Graph prompt cleanup: repeated `Recovered graph functions` bodies are reduced to readable graph-choice prompts while preserving structured graph models.
- Algorithm-variable placeholder cleanup: Chapter 01 translation/reflection completion prompts now use recovered variables instead of repeated `[DIAGRAM: variables (...)]` text.
- Typst currency cleanup: malformed money values are escaped as literal dollars without broad escaping of closed math spans.

## Documentation / Handoff (2026-06-14)

- [x] Document current TestGen package export shape in `README.md` and `FORMAT_NOTES.md`.
- [x] Document Grade 12 v06 structural findings: matching evidence, compact object-math markers, graph point/ray preservation, conservative currency escaping, and PDF audit expectations.
- [x] Document TestGen ownership split for seeded algorithm recalculation.
- [ ] Decide how direct TestGen bank import should handle decoder `className` and recovered curriculum creation.
- [ ] Add an automated TestGen import fixture that proves `test-generator-question-bank` packages preserve images, algorithms, graphs, diagnostics, parts, and curriculum fields.
