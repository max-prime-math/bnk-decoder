# BNK Decoder Roadmap

Priority-ordered list of open problems and planned improvements. Update after each session.
Detailed binary format research lives in `format-notes.md`.

---

## 1. ~~Answer Key Byte Location~~ ✅ COMPLETED

**Status:** Completed (2026-05-14)  
**Solution:** Answer byte stored at `sourceOffset - 508` (−0x1FC) in v06 records. Implemented in `tryReadAnswerByteFromBinary()` and `inferVersion06Answer()`.

**Verification:** All 13 Ch03 questions (Q1–Q13) extract correct answers (A/C/B/C/B/B/B/A/B/B/B/C/D).

**Why it works:** Binary record structure maintains a fixed 508-byte offset between the answer byte and the string cluster start. Consistent across all questions in a file.

**Commit:** 9689d6d `feat: extend answer byte extraction to all questions via relative offset`

---

## 2. ~~Record Over-counting~~ ✅ COMPLETED

**Status:** Completed (2026-05-14)  
**Solution:** Read question count from DWORD at inflated payload offset 0x0a04. Use this to truncate the chunk array in `decodeVersion06QuestionCandidates()`.

**Results:**
- Ch01: 30 questions (was 76) ✓
- Ch02: 24 questions (was 75) ✓
- Ch03: 22 questions (was 63) ✓

**Commit:** 0f0cf10 `fix: use header question count to eliminate record over-counting`

---

## 3. Embedded Math Objects (`[embedded math expression]`)

**Status:** Open (partial — semantic recovery handles many common patterns)  
**Impact:** Questions with inline math (especially trig identities, Ch03 Ch06) decode fully  
**What we know:**
- Math objects are stored as `0x000f` slot markers in the text stream
- The slot content is in a rich-text/binary blob not yet decoded
- Current decoder recovers many patterns via hardcoded semantic rules (linear functions, sequences/series, transformations, unit circle)
- Ch03 has 17 embedded placeholders remaining after current decoder

**Next approaches:**
1. Map the binary blob format for inline math objects (look near slot marker bytes in the inflated binary)
2. Extend semantic recovery for remaining common patterns in Ch03
3. Investigate whether the math object blobs use RTF math encoding or proprietary FSC format

---

## 4. Column Count from Binary

**Status:** Open  
**Impact:** Correct choice ordering without hardcoded assumption  
**What we know:**
- ExamView status bar shows `Columns: N` — this count IS stored in binary somewhere
- Current decoder assumes 2-column layout (A,C,B,D order) which is correct for most Ch03 questions
- For 1-column questions (some completion/short-answer types), order would be A,B,C,D

**Next approaches:**
1. Search the 242-byte binary gap for a byte that encodes 1 or 2 (column count)
2. Search the choice block binary for a column-count field
3. Look for `mc-choice-sequence` / `question-type-order` strings in the binary (seen in evfbb.dll)

---

## 5. Version 05 BNK Format (`GQ-Calculus.bnk`)

**Status:** Open — no decoder for version 05  
**Impact:** One known outlier file decoded  
**What we know:**
- `ignore/ExamView/Banks/Calculus/GQ-Calculus.bnk` is version `05#00`
- Payload starts with `56 44 9b 2c` — not zlib
- Format version strings: `FSCBNK3` (version 3 in evpro.exe strings) may correspond to version 05

---

## 6. Per-Question Image Assets

**Status:** Partial — PNG/JPEG/GIF/BMP detected by signature scan  
**Impact:** Images embedded in questions become usable  
**What we know:**
- 5 JPEG assets detected in corpus (in 2 files)
- Asset-to-question association works for v06 questions via byte-range overlap
- Non-v06 fallback banks still need per-question asset association

---

## 7. Graph Object Rendering

**Status:** Partial — expressions recovered and sampled, but no visual render  
**Impact:** Graph questions show actual graphs, not just expression text  
**What we know:**
- Graph expressions like `a*(pow((x-p),2))+q` are recovered and sampled to 41 points
- `pow()` evaluator fixed; Typst/LaTeX render as `(A)^N`
- The Format Graph dialog has Axes and View tabs with axis range/scale — not yet decoded
- Graph object rendering would require Typst graph output or similar

---

## Completed

| Item | Session | Result |
|---|---|---|
| Answer Key Byte Location | 2026-05-14 | Implemented; all Ch03 Q1–Q13 answers correct. Binary offset = sourceOffset − 508. |
| Record Over-counting | 2026-05-14 | Fixed; reads DWORD at 0x0a04. Ch01=30, Ch02=24, Ch03=22 all correct. |
| `pow()` graph evaluator | 2026-05-13 | Fixed — parabola expressions now sample 41 points |
| `x_int1` false-positive graph expressions | 2026-05-13 | Fixed — x-boundary check in `isLikelyGraphExpression` |
| Slot-based choice reconstruction | 2026-05-13 | Fixed — `inferSlotBasedChoices` fills slots from post-font refs in column-major order |
| Column-major choice ordering | 2026-05-13 | Documented and confirmed (A,C,B,D for 2-column) |
| Variable naming conventions (quadratic) | 2026-05-13 | Documented: a, p, q, y_int, x_int1/2, direction, etc. |
| ExamView software DLL analysis | 2026-05-14 | `evengine2.dll` confirms answer stored as char; `EVGetCorrectAnswer` method |
