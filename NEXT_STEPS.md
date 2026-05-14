# BNK Decoder — Next Steps Roadmap

**Current Status:** 227 of 228 Pre-Calculus 11 questions decoded (99.6%)  
**Latest Feature:** test-generator JSON export format added (2026-05-14)  
**Corpus:** 400+ BNK files available across multiple textbooks

---

## Priority 1: Validate Decoder Quality Across Corpus

**Why:** Pre-Calculus 11 is well-understood. Before optimizing edge cases, verify decoder handles other textbooks correctly.

**Scope:** Sample 5–10 files from different textbooks; check question counts, answer extraction, embedded objects

**Approach:**
1. Decode representative files from each textbook:
   - `Pre-Calculus 12/Chapter 01.bnk` (v06 format, likely similar to PC11)
   - `Calculus/GQ-Calculus.bnk` (v05 format — currently unsupported)
   - `Math Makes Sense 9/Unit 01/MMS9_1.1.bnk` (general math)
   - `Foundations of Math 10/Chapter 01/MMS10_1.1.bnk` (fundamentals)
   - `MathWorks 11/Ch1-Slope and Rate of Change/1.1 Rise Over Run.bnk` (with images)

2. For each file, check:
   - ✓ Question count matches ExamView UI (if available)
   - ✓ Answer extraction works (random sample of 5 questions)
   - ✓ Embedded objects resolved or marked clearly
   - ✓ Asset extraction (if present)
   - ✓ Format detection (v06 vs v05 vs text-like)

3. Document findings in a validation report

**Expected Outcome:** Confidence scores per textbook; identified format variations; catalog of edge cases

---

## Priority 2: Support Version 05 Format

**Why:** `GQ-Calculus.bnk` uses v05 and cannot be decoded; understand v05 structure

**What we know:**
- Version 05 signature in header: `FSCBNK#05#00#...`
- Payload doesn't start with zlib magic (`78 9c`)
- Payload start: `56 44 9b 2c`
- `FSCBNK3` string seen in `evpro.exe` — possible link

**Approach:**
1. Dump and inspect raw payload structure from a v05 file
2. Search for string markers similar to v06 (question separators, choice markers)
3. Compare byte layout to v06 (record structure, choice encoding)
4. If zlib is absent, test alternative compression (deflate raw, other formats)

**Expected Outcome:** Basic v05 question extraction; identification of binary structure differences

---

## Priority 3: Column Count Detection

**Why:** Improves choice ordering accuracy without hardcoded assumptions

**Current state:** Assumes 2-column layout (A,C,B,D order) — works for most but not all files

**What we know:**
- ExamView UI shows `Columns: N` — value is stored in binary somewhere
- Likely candidates: 
  - 242-byte gap between choice block start and question record (search for 1 or 2)
  - Choice block header/footer metadata
  - Strings like `mc-choice-sequence` in DLL (seen in `evfbb.dll`)

**Approach:**
1. Find files with confirmed 1-column vs 2-column layouts
2. Hex dump the choice block region for both; compare structure
3. Search for byte offset that consistently encodes column count
4. Test on diverse corpus before committing

**Expected Outcome:** Dynamic column count detection; fixes choice ordering for non-standard layouts

---

## Priority 4: Fix Two Remaining Embedded Objects (Ch05 Q5, Ch09 Q2)

**Why:** Close to 100% decode accuracy; both are OLE binary objects

**Challenges:**
- Ch05 Q5: Mathematical expression in MathType binary format
- Ch09 Q2: Equation object (same format)
- OLE objects are compound documents; require parser to extract equation content

**Approach (if attempting):**
1. Investigate OLE format (ECMA-376 or similar)
2. Locate equation stream in binary blob
3. Parse MathType structure (complex; may not be worth ROI)
4. **Alternative:** Leave as [embedded object] placeholder; document limitation

**Expected Outcome:** Either 100% decode (if OLE parsing is feasible) or documented limitation with workaround

---

## Priority 5: Asset Inventory & Test-Generator Integration

**Why:** Ensure image assets are properly accessible from test-generator import

**Current state:**
- Assets extracted and linked to questions
- Fallback distribution for text-like questions
- Images stored as asset IDs in question JSON

**Next steps:**
1. Verify test-generator can import and serve images from the export format
2. Test import workflow: decode → export JSON → import into test-generator → view in browser
3. If images don't load:
   - Check asset encoding (base64 vs filename reference)
   - Implement asset bundle export if needed (ZIP with JSON + images)
4. Document expected directory structure for test-generator import

**Expected Outcome:** Full end-to-end workflow (BNK → test-generator web app with images)

---

## Priority 6: Performance & Large Corpus Testing

**Why:** Decoder should handle large files and many questions without performance degradation

**Scope:**
1. Identify largest BNK files in corpus
2. Decode and measure:
   - File parse time
   - Memory usage
   - Question extraction time
3. Profile bottlenecks (binary scanning, string matching, variable inference)

**Expected Outcome:** Baseline metrics; identified slow paths for optimization

---

## Optional (Lower Priority)

### Graph Rendering
- Expressions recovered; outputs Typst code
- Visual rendering would require Typst/LaTeX compilation
- Nice-to-have, not blocking

### Curriculum Mapping
- test-generator expects classId/unitId/sectionId
- Requires external mapping (which textbook chapter → which curriculum unit)
- Out of scope unless user provides mapping data

### Answer Validation Script
- Currently validates against binary offset
- Could compare against human answer keys if available

---

## Immediate Next Action

**For the next LLM:**

1. **Start with Priority 1** — decode 5 diverse BNK files and generate validation report:
   ```bash
   npm run decode:file -- "ignore/ExamView/Banks/Pre-Calculus 12/Chapter 01.bnk"
   npm run decode:file -- "ignore/ExamView/Banks/MathWorks 11/Ch1-Slope and Rate of Change/1.1 Rise Over Run.bnk"
   npm run decode:file -- "ignore/ExamView/Banks/Foundations of Math 10/Chapter 01/MMS10_1.1.bnk"
   # etc.
   ```

2. **Aggregate findings** into a corpus-wide report showing:
   - ✓ Files decoded successfully
   - ⚠ Files with issues (embedded objects, unknown format, etc.)
   - ✗ Files that failed
   - Format distribution (v06, v05, text-like)

3. **Based on findings**, prioritize the next improvement (likely v05 support or column count detection)

---

## Files to Update

- `ROADMAP.md` — update with findings from validation
- `MEMORY.md` — record any new format discoveries or patterns
- `NEXT_STEPS.md` — update after each session

