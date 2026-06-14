# Algorithm and Graph Extraction Plan

This plan turns the observed ExamView UI model into decoder work. It intentionally avoids question-specific content rewrites.

## Architecture

1. Decode question, narrative, and matching-group boundaries.
2. Decode algorithm definitions in the correct scope.
3. Evaluate or preserve algorithm expressions.
4. Decode embedded graph and picture objects.
5. Attach graph objects to their owning question, choice, answer, rationale, or matching group.
6. Render graph objects through an ExamView-compatible graph renderer when possible.
7. Use PDF-derived visual references for verification and fallback assets.

## Algorithms First

Graph expressions and display conditions use the same syntax as algorithm definitions. The graph renderer must depend on the algorithm evaluator.

Required evaluator behavior:

- Preserve raw expressions exactly.
- Support numeric, string, boolean-like, and list values.
- Support `range`, `rand`, `choose`, `list`, `if`, `fracs`, `mixfracs`, `rfracs`, `comb`, `perm`, factorial, trig, log, sqrt, abs, and simple string functions.
- Preserve unresolved functions as structured diagnostics instead of inventing values.
- Track dependencies between variables.
- Preserve sample values separately from the template rule.
- Respect scopes: question, narrative, matching group.

## Matching Groups

Current risk: proximity linking can attach unrelated short-answer questions to a matching group.

Plan:

1. Identify matching group records before standard question linking.
2. Extract explicit group item count from the matching record if present.
3. Extract choice range and columns.
4. Extract answer mapping from the matching table.
5. Attach only the rows owned by that matching record.
6. Stop using broad nearest-short-answer linking except as a diagnostic fallback.

Regression targets:

- Chapter 03 matching group must have 4 items.
- Chapter 11 matching group must have 5 items.

## Graph Object Schema

The shared model must represent these families:

- `cartesian`
- `polar`
- `number-line`
- `unknown`

The shared model must represent these object kinds:

- function/relation curves
- point
- ray
- segment
- picture
- text
- shape or unknown structured object

Graph object fields should include:

- raw expression
- normalized expression
- relation
- domain
- display condition
- variables referenced
- point coordinates
- point style
- label style and label position
- line pattern
- color
- shading
- item source offset or extraction evidence when available

## Cartesian Graph Extraction

Start with high-value objects seen in Grade 12:

1. `f(x)` and `f(y)` expressions.
2. Conditional `f(x)` alternatives using `Display function only if`.
3. Point objects for scatter plots.
4. Hollow points for rational holes.
5. Axis/view metadata sufficient for renderer defaults.

Examples:

- Chapter 05 MC #5: radians trig graph with `a_graph` and `b_graph`.
- Chapter 05 MC #6: degrees trig graph using `pi*x/180`.
- Chapter 05 MC #13: sinusoidal transformation `a*cos(b*(x+pi/c))-d`.
- Chapter 07 short-answer #7 and #8: scatter plots as point lists.
- Chapter 09 MC #11: rational graph plus hollow point.
- Chapter 10 MC #8: conditional sine/cosine graph items.

## Number Line Extraction

Number-line objects need separate parsing from Cartesian graphs.

First target:

- Chapter 03 problem #14.

Required object model:

- family: `number-line`
- objects:
  - ray endpoint `-1`, direction `left`, hollow endpoint, red
  - ray endpoint `1`, direction `right`, hollow endpoint, red

## Picture and Bitmap Extraction

Some visuals are simple inserted pictures.

Plan:

1. Keep signature-based bitmap/OLE extraction.
2. Classify inserted pictures separately from graph objects.
3. Preserve crop metadata when found.
4. Prefer extracted bitmap assets over reconstruction when the UI shows `Format Picture`.
5. Use PDF crops as fallback only when the BNK asset cannot be mapped cleanly.

Target:

- Chapter 11 route/grid diagram, shown by ExamView as a 256-color bitmap.

## PDF Verification

Build a PDF reference index for each chapter:

1. Extract text with `pdftotext -layout`.
2. Extract word geometry with `pdftotext -bbox-layout`.
3. Render pages with `pdftoppm`.
4. Parse question blocks by printed section and `ANS/DIF/OBJ/NAT/TOP/KEY`.
5. Compare decoded output to PDF text by chapter and printed question order.
6. Crop exact question/graph regions for visual QA and fallback rendering.

The PDF layer is a verifier and fallback, not a replacement for BNK algorithm/graph decoding.
