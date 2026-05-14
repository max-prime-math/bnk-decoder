# BNK Decoder Roadmap

Priority-ordered list of open problems and planned improvements. Update after each session.
Detailed binary format research lives in `format-notes.md`.

---

## 1. Answer Key Byte Location (HIGHEST VALUE)

**Status:** Open  
**Impact:** Every MCQ in every bank gets a reliable correct answer  
**What we know:**
- Confirmed single character byte (A/B/C/D) via `evengine2.dll` DLL analysis
- COM method `EVGetCorrectAnswer` retrieves it from `CQuestion` serialized object
- XML export uses `<CORRECTANSWER>` element
- **Ruled out** (exhaustive differential analysis with 13 confirmed answers, Ch03 Q1–Q13):
  - Every fixed position from record start, end, fontOffset, choice block start, second TNR
  - The 242-byte end-of-record binary gap
  - First 438+ bytes of choice block binary section (identical across all records — fixed RTF template)

**Next approaches (in order):**
1. Disassemble `evengine2.dll` using Ghidra or similar — find `CQuestion::Serialize()` and trace the exact archive offset where the answer char is written
2. Search `evplay.exe` strings — simpler "player" binary may have more readable format parsing code
3. Look for a per-choice `isCorrect` flag within each choice's RTF binary sub-record (the 4 sub-blocks between TNR pairs 144 bytes apart)
4. Get an ExamView XML export of any Ch03 bank — `<CORRECTANSWER>` element maps directly to a binary position
5. Compare bytes WITHIN each choice's binary sub-block across records where different choices are correct

**Ground truth available:** Ch03 Q1–Q13 confirmed answers from ExamView UI screenshots (see `CURRENT_STATE.md`)

---

## 2. Record Over-counting (76 decoded vs 30 actual questions, Ch01)

**Status:** Open  
**Impact:** Clean question boundaries; correct question numbering  
**What we know:**
- Decoder finds 76 clusters in Ch01 vs 30 actual questions in ExamView
- Over-count caused by: answer explanations, sub-parts of multi-part questions all triggering the difficulty-label heuristic
- ExamView's title bar shows "Multiple Choice (Bimodal) - N of 30" — the question count is stored somewhere

**Next approaches:**
1. Find a record-type or record-kind byte in the binary header that distinguishes top-level questions from sub-records/explanations
2. Look for the total question count field in the global file header (bytes 0–4628 of inflated binary)
3. Use the known question count from the file header to validate record boundaries

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
| `pow()` graph evaluator | 2026-05-13 | Fixed — parabola expressions now sample 41 points |
| `x_int1` false-positive graph expressions | 2026-05-13 | Fixed — x-boundary check in `isLikelyGraphExpression` |
| Slot-based choice reconstruction | 2026-05-13 | Fixed — `inferSlotBasedChoices` fills slots from post-font refs in column-major order |
| Column-major choice ordering | 2026-05-13 | Documented and confirmed (A,C,B,D for 2-column) |
| Variable naming conventions (quadratic) | 2026-05-13 | Documented: a, p, q, y_int, x_int1/2, direction, etc. |
| ExamView software DLL analysis | 2026-05-14 | `evengine2.dll` confirms answer stored as char; `EVGetCorrectAnswer` method |
