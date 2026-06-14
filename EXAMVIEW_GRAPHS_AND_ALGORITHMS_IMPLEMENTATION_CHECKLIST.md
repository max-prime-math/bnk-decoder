# ExamView Graphs and Algorithms Implementation Checklist

## Immediate Fixes

- [ ] Add regression check: Chapter 03 matching group has exactly 4 items.
- [ ] Add regression check: Chapter 11 matching group has exactly 5 items.
- [ ] Replace broad matching proximity linking with record-boundary/item-count linking.
- [ ] Add diagnostics when matching-group item count cannot be recovered.

## Shared Model

- [x] Add graph object fields for display condition, point style, label style, relation, color, shading, point coordinates, and ray data.
- [ ] Add graph model support in TestGen import/rendering for point objects.
- [ ] Add graph model support in TestGen import/rendering for number-line rays.
- [ ] Add graph model support for conditional graph items.

## Algorithm Parser/Evaluator

- [ ] Parse and preserve duplicate `Condition` definitions distinctly.
- [ ] Normalize ExamView `Condition` records to `condition_1`, `condition_2`, etc. without losing their UI label.
- [ ] Evaluate `comb`, `perm`, and factorial.
- [ ] Evaluate `fracs`, `mixfracs`, and `rfracs` as display strings and math objects.
- [ ] Evaluate `range`, `rand`, `choose`, and `if` deterministically from stored sample values when present.
- [ ] Preserve unresolved values with diagnostics instead of converting them into opaque support tokens.

## Graph Extraction

- [ ] Recover `f(x)` item expressions from graph object records.
- [ ] Recover `Display function only if` conditions.
- [ ] Recover graph point objects and their styles.
- [ ] Recover hollow points for rational-function holes.
- [ ] Recover number-line ray objects.
- [ ] Recover graph axis/view metadata when available.
- [ ] Preserve degree-mode trig conversions such as `pi*x/180`.

## Bitmap/OLE and Pictures

- [ ] Classify `Format Picture` objects separately from graph objects.
- [ ] Preserve inserted bitmap assets and crop metadata.
- [ ] Confirm extracted route/grid diagrams match PDF output.
- [ ] Keep OLE/math objects as structured inline assets when semantic parsing is unavailable.

## PDF Reference Pipeline

- [ ] Implement `scripts/build-pdf-reference.mjs`.
- [ ] Parse printed question blocks by chapter, section, number, answer, and metadata.
- [ ] Render page images for visual QA.
- [ ] Crop graph/image-heavy question regions.
- [ ] Compare decoded question text, answers, and metadata to PDF reference.
- [ ] Use PDF crops only as fallback assets or QA references, not as the semantic source.

## Grade 12 Screenshot Regression Targets

- [ ] Chapter 03 matching group: quotient/divisor/remainder/dividend.
- [ ] Chapter 05 MC #5: radians sine graph, variables `a_graph`, `b_graph`.
- [ ] Chapter 05 MC #6: degrees cosine graph, `pi*x/180`.
- [ ] Chapter 05 MC #13: `a*cos(b*(x+pi/c))-d`.
- [ ] Chapter 07 short-answer #7: scatter plots as point objects.
- [ ] Chapter 07 short-answer #8: investment scatter plot as point objects.
- [ ] Chapter 09 MC #11: rational graph with hollow point `(hole, y_var)`.
- [ ] Chapter 10 MC #8: conditional sine/cosine graph items.
- [ ] Chapter 03 problem #14: number-line rays from `-1` left and `1` right.
- [ ] Chapter 11 short-answer #3: 256-color bitmap route diagram.
- [ ] Chapter 11 matching group: combinatorics expression matching.
