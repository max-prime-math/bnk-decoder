# Graph investigation

## Structural observations

`scripts/research/inventory-graph-objects.mjs` derives object boundaries from validated
rich-text counts, rather than searching for graph-looking text. The retained report is
`graph-object-inventory.json`. On the v06 corpus it finds 2,883 kind 0 / subtype 9 objects.
All begin with int32 5. The previous font-signature graph reader identifies only 1,044
of them. Its signature requires two adjacent axis flags both equal to one; graphs with
tick labels disabled fail that test. This is an actual coverage defect, not proof that
the remaining objects cannot be graphs.

The previous reader's graph offset points to the external object length prefix. The
kind 0 / subtype 9 body begins four bytes later. Its size field excludes that prefix.
2,870 bodies have lengths equal to 2456 + 1796 * N. Thirteen objects have additional
data and must not have their item count rounded from their total byte length.

Reading item codes at the established fixed-layout offsets for those 2,870 objects
gives codes 0, 1, 3, 4, 6, 7, 9, 10, 12, 13, 16, 17, 18, 21, 22, 23. These offsets and
codes remain structural hypotheses until corroborated with native graph serialization.
The old reader only models 0, 1, 6, 7, 12. Graph contents are therefore substantially
more diverse than the old decoder reports.

## Native trace seeds

Retained REA Evidence `ev_a362180e3fe38b1f8243534a4f75ec3c0697f3ee9ceb65ddcd8b9b3d56931690`
for `FUN_004be790` dispatches subtype 9 to `FUN_004bdf30`; subtype 4 to
`FUN_004bc3d0`; subtype 2 to `FUN_004bc370`. Focused decompilation requests 100–102
are queued in the shared REA session. Static pseudocode is not runtime render evidence.

## Native framing result

REA evidence `ev_3662c2fed49de24e0f70e71bb66ce64e9690a18f331d4c7775ae61c593ed6add`
for `FUN_004bdf30` establishes the 0x998-byte body header, count at body +0x85c,
0x704-byte fixed items, and appended bytes for item code 11. Its payload length
is the second int32 of that item's union (+0x84 relative to the fixed item).
`FUN_004bdc60` establishes the fixed UTF16 view strings and two 0x90-byte axis
records; `FUN_004bd780` establishes the item union dispatch and common fields.
Focused native evidence is retained in `graph-native-evidence.json`.

`readNativeGraphObject` now follows those declared boundaries. The corpus test
`test-native-graph-framing.mjs` parses all 2,883 subtype-9 bodies and consumes each
exactly, including 26 pictures in the 13 non-fixed-size graph bodies. It retains
all original bytes and raw style/axis fields. Unsupported version, invalid item
count, truncated item, invalid picture length and leftover bytes fail explicitly.
This establishes structural framing, not visual equivalence. The older heuristic
reader remains for compatibility with its existing callers.

## Fidelity boundary

No prose-derived graph reconstruction has been added. A faithful native decoder still
needs header bounds/center/scale semantics; axis flag definitions and fonts; item types,
line styles, marker/arrow rules, inequalities/fills; variable/sample substitution; extra
payload framing; and pixel/layout comparisons against ExamView exports. The existing
nearby frame-size scan is heuristic and cannot establish the actual object's dimensions.
The rich object header supplies explicit width/height and should be used at integration.
