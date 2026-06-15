# BNK Decoder — Next Steps Roadmap

**Current Status:** 227 of 228 Pre-Calculus 11 questions decoded (99.6%); Grade 12 Pre-Calculus structural decode materially improved
**Latest Feature:** Grade 12 BNK-only object-math recovery pass (2026-06-14)
**Corpus:** 400+ BNK files available across multiple textbooks

---

## Latest Grade 12 Pre-Calculus Status (2026-06-14)

Fresh BNK-only object-math reports live in `reports/math-object-pass-20260614e`.

- 732 decoded questions across Chapters 01-11.
- Internal quality report: 721 clean, 10 suspect, 1 garbage, 4 bad choice tokens, 93/100 average.
- Body embedded-placeholder count is 58, with 123 total body "not decoded yet" markers. This is intentionally conservative after rejecting unsafe equation candidates in scalar-value and diagram slots.
- Chapter 01 transformation prompts now recover compact BNK object equations for the first transformation items, including `f(x) = x^2`, `g(x) = x^2 - 9`, and shifted function calls such as `g(x) = f(x - 2)`.
- Chapter 10 function-combination prompts now recover mixed-encoding object equations such as `f(x) = x^2 - 3`, `g(x) = -9 - x`, and `y = f(x) + g(x)`.
- Structural finding: these early inline math expressions are not standard OLE/MathType streams in the inflated BNK. They are compact object-math runs near the display text, using byte `0x7f` as an overloaded exponent/function/absolute-value marker and using stored algorithm sample values for terms and operators.

Follow-up low-hanging-fruit pass in `reports/spot-all-20260614-metadata-graphs-currency`:

- Internal quality report improved to 724 clean, 7 suspect, 1 garbage, 4 bad choice tokens, 94/100 average.
- Body embedded-placeholder count is 57, with 120 total body "not decoded yet" markers.
- TestGen export now carries decoded curriculum metadata: `className`, chapter-derived `unitId`/`unitName`, section-derived `sectionId`, topic-derived `sectionName`, and tags for ExamView, topic, difficulty, reference, and title keywords.
- Chapter 01 transformation/reflection placeholder families now materialize from recovered algorithm variables instead of emitting repeated `[DIAGRAM: variables (...)]` text, e.g. horizontal translation and reflection/translation completion stems.
- Graph-choice stems with repeated `Recovered graph functions` dumps are reduced to readable prompts while retaining the full structured `graphModel`.
- Literal currency values such as `$150`, `$0.12`, `$600`, and `$775` are escaped for Typst without changing closed numeric math spans such as `$2$` and `$15$ kg.

The previous audited PDF-reference reports remain in `reports/precalc12-pdf-audit-20260614`.

- 732 decoded questions across Chapters 01-11, versus 733 parsed PDF question blocks.
- Matching groups recovered for Chapter 03 and Chapter 11 with 9 linked items and 9 answer mappings.
- Graph object extraction currently preserves 510 graph objects, including 77 points and 2 number-line rays.
- Algorithm preservation currently reports 460 algorithm-bearing questions and 3815 definitions.
- Internal quality report: 720 clean, 11 suspect, 1 garbage, 4 bad choice tokens, 93/100 average.
- PDF audit report: 717 question-order comparisons, 385 low-similarity stems, 180 decoded questions with placeholders, 271/305 answer matches, and 153/402 choice matches.
- The Chapter 01 transformation-answer rewrite bug is removed: decoded bodies no longer replace stems with answer sentences such as "translated 9 units down." Visible translation choices now follow the PDF choice templates.
- TestGen bridge now exports `test-generator-question-bank` JSON with embedded image bytes; Chapter 04 smoke test produced 67 stored-bank-shaped questions and 15 importable images with no missing refs.

Known remaining blockers:

- Several `V06_MATCHING_ITEM_COUNT_UNKNOWN` diagnostics are candidate matching prompts whose owned item records are not yet recoverable. The decoder now drops these candidates instead of linking unrelated questions.
- OLE/MathType and WMF picture objects are still not semantically parsed. The decoder now rejects unsafe partial MathType recoveries that leak hidden variables such as `h`/`k`, leaving explicit embedded-math placeholders instead.
- PDF comparison is now required for readiness. The internal "clean" score is not a semantic correctness guarantee.
- TestGen preserves graph model metadata on import, but does not yet render graph models natively.
- TestGen direct bank JSON import preserves packaged questions and image bytes, but it does not yet create a custom class from decoder `className`. The bulk ingest review path remains the better workflow when class/unit/section creation needs human approval.
- TestGen owns seeded algorithm recalculation. The decoder should preserve algorithm definitions, sample values, and diagnostics; TestGen should continue improving expression evaluation and materialization for per-question variants.

---

## Corpus Variation Research

Before broadening the decoder further, establish why the other banks differ and which differences are structural versus cosmetic.

**Immediate goal:** fingerprint every bank under `ignore/ExamView/Banks`, then cluster them into decoder dialects.

**First deliverables:**
1. corpus fingerprint report
2. family/version matrix
3. stable golden corpus for regression testing
4. list of bank families that need special handling
5. deferment notes for any outlier bank that is not worth attacking yet

**Primary reference:** [`BANK_VARIATION_AND_COVERAGE_PLAN.md`](./BANK_VARIATION_AND_COVERAGE_PLAN.md)
**Graph/algorithm reference:** [`EXAMVIEW_GRAPHS_AND_ALGORITHMS_REFERENCE.md`](./EXAMVIEW_GRAPHS_AND_ALGORITHMS_REFERENCE.md)
**Graph/algorithm architecture plan:** [`ALGORITHM_AND_GRAPH_EXTRACTION_PLAN.md`](./ALGORITHM_AND_GRAPH_EXTRACTION_PLAN.md)
**Graph/algorithm execution plan:** [`EXAMVIEW_GRAPHS_AND_ALGORITHMS_IMPLEMENTATION_CHECKLIST.md`](./EXAMVIEW_GRAPHS_AND_ALGORITHMS_IMPLEMENTATION_CHECKLIST.md)

**LLM onboarding note:** Any future work on narratives, algorithms, equations, graphs, number lines, or dynamic question rendering should start by reading the graph/algorithm reference, the dedicated extraction plan, and the implementation checklist before changing parser behavior.

**Direction note:** Do not add bank-specific content patches as a long-term fix. Read [`DECODER_DIRECTION.md`](./DECODER_DIRECTION.md) before making any rewrite that depends on the wording of one question.

**Current tool:** `npm run report:corpus -- "ignore/ExamView/Banks" reports/corpus-dialects`
**Regression tool:** `npm run regress:dialects -- reports/dialect-regression`

---

## Priority 1: Validate Decoder Quality Across Corpus

**Why:** Pre-Calculus 11 is well-understood. Before optimizing edge cases, verify decoder handles other textbooks correctly.

**Scope:** Sample 5–10 files from different textbooks; check question counts, answer extraction, embedded objects

**Approach:**
1. Decode representative files from each textbook:
   - `Pre-Calculus 12/Chapter 01.bnk` (v06 format, likely similar to PC11)
   - `Calculus/GQ-Calculus.bnk` (v05 format — separate profile, keep in regression)
   - `Math Makes Sense 9/Unit 01/MMS9_1.1.bnk` (general math)
   - `Foundations of Math 10/Chapter 01/MMS10_1.1.bnk` (fundamentals)
   - `MathWorks 11/Ch1-Slope and Rate of Change/1.1 Rise Over Run.bnk` (with images)

2. For each file, check:
   - ✓ Question count matches ExamView UI (if available)
   - ✓ Answer extraction works (random sample of 5 questions)
   - ✓ Embedded objects resolved or marked clearly
   - ✓ Asset extraction (if present)
   - ✓ Format detection (v06 vs v05 vs text-like)
   - ✓ Narrative preambles preserved as shared prompt text when present

3. Document findings in a validation report

**Expected Outcome:** Confidence scores per textbook; identified format variations; catalog of edge cases

---

## Priority 2: Support Version 05 Format

**Why:** `GQ-Calculus.bnk` uses v05 and should be treated as its own version-specific path even though current decoding is already materially useful

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
- BNK workspace bridge emits first-class `test-generator-question-bank` JSON with embedded image bytes for direct TestGen import
- TestGen PQP and JSON import normalizers preserve algorithm models, graph models, diagnostics, point/ray graph objects, and BMP image assets

**Next steps:**
1. Browser-test a full Grade 12 chapter import and Typst preview with extracted images.
2. Add a stable automated TestGen import fixture for `test-generator-question-bank` JSON with embedded images.
3. Decide whether decoder exports should include `customClasses` for recovered `className`/chapter/section metadata, or whether TestGen direct import should route these packages through the bulk-ingest curriculum review path.
4. Continue mapping non-signature WMF/OLE math pictures to structured inline assets or reference crops.
5. Document remaining image formats that Typst cannot render directly, even when bytes are preserved.

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

## Priority 7: Generic Question-Body Recovery

**Why:** Recent progress shows that some lost readability can be regained from correctly decoded raw preview text without bank-specific rewrites. This should stay structural and generic.

**Scope:**
1. Use preserved raw preview text as a recovery source when stitched body text is clearly incomplete.
2. Prefer prompt lines and structural markers over worked-solution lines.
3. Keep placeholder cleanup generic so internal slot markers do not leak into exported bodies.
4. Avoid any rewrite that depends on one question’s wording.

**Expected Outcome:** Better question-body fidelity on similar banks, with no hardcoded content patches.

---

## Priority 8: Solution Boundary Extraction

**Why:** Algorithmic questions often contain solution text that reuses the same variables as the question. The decoder should separate prompt and solution more reliably, instead of letting worked steps drift into the body.

**Scope:**
1. Identify generic solution prelude cues in raw v06 text.
2. Separate worked-solution lines from the actual question prompt.
3. Preserve solution variables and formulas when they are genuinely present in the file.
4. Keep solutions distinct in exports and GUI previews.

**Expected Outcome:** Fewer missing solutions and fewer cases where solution text is mislabelled as question body.

---

## Priority 9: Images and Diagram Recovery

**Why:** The decoder can already extract embedded assets by signature, but many diagram-heavy questions still fall back to placeholders instead of true visual recovery.

**Scope:**
1. Improve the mapping between embedded assets and their owning questions.
2. Distinguish actual images from graph/object placeholders.
3. Make sure `test-generator` can import and serve extracted images consistently.
4. Track which diagram cases still require binary reconstruction versus simple asset extraction.

**Expected Outcome:** Better image visibility in the GUI and more reliable asset handling across banks.

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

1. **Start with Priority 1** — decode 5 diverse BNK files and generate validation report, with special attention to narrative-bearing runs:
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
   - Narrative coverage and any mismatched narrative selectors

3. **Based on findings**, prioritize the next improvement (likely v05 support or column count detection)

---

## Files to Update

- `ROADMAP.md` — update with findings from validation
- `MEMORY.md` — record any new format discoveries or patterns
- `NEXT_STEPS.md` — update after each session
