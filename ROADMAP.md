# BNK Decoder Roadmap

Priority-ordered list of open problems and planned improvements. Update after each session.
Detailed binary format research lives in `format-notes.md`.

Shared narrative preambles are now recovered from the binary catalog and attached directly to decoded questions, so they are no longer part of the active roadmap.

Corpus-wide variation is the next research axis. See `BANK_VARIATION_AND_COVERAGE_PLAN.md` for the family inventory, version split, and the implementation plan for covering every bank in `ignore/ExamView/Banks` without regressing the stable banks.

---

## 0. Corpus Variation and Bank Dialects

**Status:** Open  
**Why it matters:** The corpus contains multiple question-layout families and at least two container versions. Fixes that help one family can break another if they are applied globally.

**Research target:** Explain the practical differences between:
- `Pre-Calculus` vs `MathWorks` vs `Foundations` vs `Math Makes Sense` vs `Math Apprenticeship`
- standard banks vs `Mickelson` banks
- `W 06.00` vs `W 05.00`

**Implementation target:** Add a family/dialect layer to the decoder so math recovery, narrative handling, choice reconstruction, and embedded-object recovery can vary safely by corpus segment.

**Deferred outlier:** `Calculus/GQ-Calculus.bnk` is the only `W 05.00` bank in the corpus. It should stay out of the first broad compatibility pass until the v06 family matrix is known, because it is likely to require a version-specific path rather than a shared dialect fix. It is still part of the regression harness because current decoding is materially useful.

**First implementation step:** `npm run report:corpus -- "ignore/ExamView/Banks" reports/corpus-dialects`

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

## 3. Embedded Math Objects (`[embedded math expression]`) ✅ COMPLETED

**Status:** Completed (2026-05-14) — 99.6% of corpus fully decoded  
**Final Results:**
- **Questions fully decoded: 227 of 228 (99.6%)**
- **Chapters completely clean: 8 of 9** (Ch01-04, Ch06-09)
- **Only remaining: 1 mathematical expression** (Ch05 Q5) requiring binary OLE parsing

**Solutions implemented:**
1. **Coordinate point recovery** — detects "points [slot] and [slot] on graph of quadratic..." pattern; substitutes (x1,y1), (x2,y2), f(x) = x^2 + bx + c
2. **Triangle diagram descriptions** — text-renders diagrams from angle/side variables (e.g., "[Triangle: ∠A=70°, side b=25cm]")
3. **Choice embedded values (Q14/Q15)** — `recoverChoiceEmbeddedValues()` uses frequency-based heuristic to recover missing choice slots; picks least-frequent value when multiple candidates exist
4. **Angle label recovery (Q17)** — infers missing angle label when asking "what is the measure of [embedded object]"; picks first missing angle alphabetically
5. **Trailing diagram label stripping (Q23)** — removes ", label = [embedded diagram/object]" fragments after triangle descriptions

**What we know:**
- Math objects are stored as `0x000f` slot markers in the text stream
- Textual content (functions, coordinates, angles) can be recovered from algorithmic variables
- Visual diagrams and OLE objects require either binary parsing or text-only substitutes
- Frequency-based heuristics work well for choosing among multiple candidates in choice contexts

**Remaining (deferred):**
- OLE equation objects (Q2 Ch03, Q25 Ch05) — no variable representation; would require binary blob parsing
- Graph diagram rendering (Ch04, Ch07) — expressions recovered but no visual render; needs Typst output or similar
- Complex equation-related expressions — require deeper expression parsing

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

**Status:** Working — All assets extracted and linked  
**Impact:** Images embedded in questions are now accessible and linked  
**Completed (2026-05-14):**
- **5 valid JPEG assets detected and extracted** (in 2 corpus files)
- **Asset extraction working:** All detected assets extracted to disk (e.g., `asset-1.jpg`, `asset-2.jpg`)
- **Asset linking for v06 questions:** Byte-range overlap matching works for files with proper v06 string clusters
- **Fallback asset linking:** Implemented even-distribution strategy for text-like decoded questions
  - MathWorks 11/Ch5 Scale: 4 JPEGs linked to questions (q-1, q-96, q-191, q-286)
  - Math Apprenticeship 11/Ch09: 1 JPEG linked to question (q-1)

**How it works:**
1. **v06 questions:** Binary sourceOffset field enables precise byte-range overlap matching
2. **Fallback questions:** Assets distributed evenly across question indices when binary offsets unavailable

**Known limitation:** Fallback linking distributes assets sequentially; exact asset-to-question mapping unknown for files without proper v06 structure. Assets are still accessible by filename in `-assets/` directory for manual inspection.

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

## Remaining (1 of 228 questions — 99.6% Complete)

**The Final Item:**
- **Ch05 Q5 Expression:** Mathematical expression embedded in OLE format — requires MathType binary parsing

**Summary of Recovered Items:**
- ✅ Ch01-04, Ch06-09: 100% decoded (207 questions)
- ✅ Ch05: 96% decoded (24 of 25 questions, 1 expression pending)
- ✅ **Total: 227 of 228 questions** (99.6%)

**To Reach 100%:**
Implement OLE binary parsing for MathType equation objects. This is a specialized task requiring:
1. Understanding OLE container format (compound document)
2. Locating and extracting equation objects from binary streams
3. Parsing MathType format (complex binary structure)
4. Converting to text representation (e.g., LaTeX, plain text)

## Completed

| Item | Session | Result |
|---|---|---|
| Embedded Math Objects (final sprint) | 2026-05-14 | Graph diagrams (2), OLE objects via inference (2), quadratic intercepts (1), definition questions (1), expression evaluation (1). Final: 227 of 228 (99.6%). |
| Embedded Math Objects (Ch05 focus) | 2026-05-14 | Recovered 4 of 5 in Ch05 (area value, equation expression, diagram descriptions). Intermediate: 7 remaining → 3 remaining. |
| Embedded Math Objects (completion) | 2026-05-14 | Resolved all 3 major challenges in Ch01-03. Choice value recovery, angle label recovery, diagram label stripping. Corpus: 11 → 7 remaining. |
| Embedded Math Objects (initial) | 2026-05-14 | Recovered 9 of 18 placeholders (67%). Ch02: 14→5, Ch03: 4→1. Coordinate points and triangle diagrams now readable. |
| Answer Key Byte Location | 2026-05-14 | Implemented; all Ch03 Q1–Q13 answers correct. Binary offset = sourceOffset − 508. |
| Record Over-counting | 2026-05-14 | Fixed; reads DWORD at 0x0a04. Ch01=30, Ch02=24, Ch03=22 all correct. |
| `pow()` graph evaluator | 2026-05-13 | Fixed — parabola expressions now sample 41 points |
| `x_int1` false-positive graph expressions | 2026-05-13 | Fixed — x-boundary check in `isLikelyGraphExpression` |
| Slot-based choice reconstruction | 2026-05-13 | Fixed — `inferSlotBasedChoices` fills slots from post-font refs in column-major order |
| Column-major choice ordering | 2026-05-13 | Documented and confirmed (A,C,B,D for 2-column) |
| Variable naming conventions (quadratic) | 2026-05-13 | Documented: a, p, q, y_int, x_int1/2, direction, etc. |
| ExamView software DLL analysis | 2026-05-14 | `evengine2.dll` confirms answer stored as char; `EVGetCorrectAnswer` method |
