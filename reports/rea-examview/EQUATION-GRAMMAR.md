# Equation grammar findings

REA retained native code at `FUN_004bc520` (original evidence bundle) establishes
the sizes of equation stream tokens: `0x03` is two bytes, `0x09` thirteen,
`0x0b` five, and `0x0a` contains a terminated variable name converted to UTF16.
`FUN_004bc640` ([request 200](../../.tools/rea-queue/200.result.json)) establishes
the template grammar: sixteen header bytes after `0x01`, an extra-data byte count
at header offset twelve, extra data, then four metadata bytes and a terminated
line for every slot. The metadata is not a zero separator. Matrix templates
(`kind=8`) read columns/rows from extra-data offsets eight/twelve and iterate
row by row. Those dimensions are checked against the stored slot count.

The old nested-line interpretation of `0x0b` swallowed the enclosing slot's
terminator. Actual Rationals_multiply-divide Q10 contains a standalone minus
glyph (`shape=2`) followed by peer tokens and fractions. Fixing this grammar
eliminated 380 unterminated-line errors and 159 unknown-shape errors in 20,780
equations across 372 banks. After correcting template headers and slot metadata,
none of those equations reports unexpected trailing bytes or slot-boundary errors.
This is structural coverage, not a claim of pixel-identical visual rendering.

The 2026-10-11 native-oracle pass decoded every equation control and template used
by the 372-bank v06 corpus. The six `0x03` character-format values are paired
cancellation (`0x0e`), postfix cancellation (`0x0f`), prime (`0x10`), double
prime (`0x11`), multiline relation alignment (`0x14`), and overbar (`0x17`).
Token `0x04` is the smallest member of the `0x04`-`0x08` spacing family. Extra
font bytes `0x80` and `0x91` are the parallel relation and centered ellipsis;
ExamView's synchronized exports visibly corroborate `AB ∥ CD` and arithmetic
series ellipses.

Newly decoded templates cover scalable parentheses (`0.1`), set-builder condition
bars (`0.24`), quotient/remainder long division (`1.8`), paired lower/upper scripts
(`2.2`), left superscripts (`2.3`), overbars and underlines (`5.0`, `5.2`), equation
transformation arrows (`6.0`), and matrices (`8.0`). Matrix extra-data offsets
eight and twelve are the column and row counts. The first layout word distinguishes
ruled factor tables, unruled row layouts, and synthetic-division grids. The latter
draw a vertical separator after column one and a horizontal separator after row two.

`equation-grammar-audit.json` now reports zero parse/render grammar errors across
20,780 equation objects. Stored variables with unsupported encoded displays and
record-level visibility rules remain separate conversion issues; the grammar audit
does not suppress those failures.

ExamView's native RTF Chapter 01 oracle corroborates the display of string-valued
fractions: image 0141 is a stacked `4/5`; image 0142 is `+4`. The BNK Q35 algorithm
stores the latter as `U+0001 U+F081 4`, with format four, and no plus sign. The
decoder now applies the positive sign and exposes the fraction as Typst math.
It retains the unmodified raw display string separately.

Other encoded math values cannot be flattened safely: `F080` radicals, `F083`
mixed fractions, `F085` scientific notation, `F088` repeating decimals, and
`F089` rational fractions produce explicit display errors pending their faithful
renderer. For example MMS10_4.3 Q1's `sqrs(n3)` stores `F0806/3`; emitting `6/3`
as ordinary text changes the answer. Its inline substitution now fails explicitly.

Verification: `scripts/research/test-equation-grammar.mjs` checks actual bank
fixtures, native Q35 samples, every observed embellishment and extra glyph, matrix
dimensions and cell slots, synthetic division, set-builder notation, unsupported
radical refusal, and truncation handling. `verify-equation-format-typst.mjs`
compiles native-correlated examples with the real Typst WASM compiler and writes
`equation-format-typst.pdf`; the visually reviewed pages include overbars,
cancellation, stacked tolerances, repeating decimals, underlined elimination,
transformation arrows, long division, ruled factor tables, and synthetic division.
Corpus inventories are `equation-grammar-audit.json`, `equation-format-audit.json`,
and `algorithm-display-audit.json`.
