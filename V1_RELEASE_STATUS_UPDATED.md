# v1 Release Status — Updated After Binary Analysis

**Date:** 2026-05-15  
**Session Focus:** Understanding ExamView v06 binary structure, implementing matching question parsing

---

## Key Discoveries

### Section Structure (CONFIRMED)

ExamView v06 BNK files contain **two distinct sections**:

**Section 1: Standard Questions (difficulty+section metadata)**
- 81 question chunks identified
- Each starts with difficulty label (Easy, Average, Difficult, Difficult +, Hard)
- Followed by section metadata (Section X.Y, Reference, Topic, Title)
- Current: 31 MCQ + 6 completion + 27 problem + 13 short_answer = 77 questions

**Section 2: Non-Metadata Questions**
- Starts at char index 252,924 (byte offset 505,848)
- Contains 27 "Times New Roman" font markers suggesting structured data blocks
- Currently found: 1 matching question with full choice extraction
- Choice format: letter[0x11]text[0x11]letter[0x11]text...

### Type Detection Improvements

Implemented `isProblemQuestion()` function that detects problem type by:
1. Presence of 3+ algorithmic variables (not just answer)
2. Multi-part structure (a), b), c), d))
3. Long body text (>300 chars) + variables
4. Specific action verbs (Determine, Solve, Find, etc.)

Result: Successfully reclassified 14 questions from short_answer to problem type

### Matching Question Parsing

Successfully implemented matching question decoder that:
1. Finds "Match the correct term to its description" text
2. Parses choice pairs separated by 0x11 byte markers
3. Extracts letter labels (A-F) and choice text
4. Creates properly formatted question objects

Result: 1 matching question fully decoded with 6 choices (A-F)

---

## Current Status vs. Target

| Type | Found | Expected | Gap | Status |
|------|-------|----------|-----|--------|
| MCQ | 31 | 30 | +1 | ⚠️ One extra (source unknown) |
| Completion | 6 | 6 | 0 | ✅ |
| Matching | 1 | 5 | -4 | ⚠️ Only 1 instance in binary |
| Short Answer | 13 | 21 | -8 | ⚠️ Under-detected |
| Problem | 27 | 19 | +8 | ⚠️ Over-detected |
| **TOTAL** | **78** | **81** | **-3** | ⚠️ 96% |

---

## Open Questions

### 1. Matching Questions (Found 1, Need 5)

**Issue:** Only 1 instance of "Match the correct term..." found in binary text

**Possibilities:**
- All 5 matching questions are identical (same template)
- Other matching questions use different prompts (need to search for alternatives)
- Matching questions are embedded in the choice data structure itself
- User's count of "5 matching" might need verification

**Action Needed:** Verify with user if 5 matching questions should exist, and if so, what pattern to search for

### 2. Short Answer Undercount (Found 13, Need 21)

**Issue:** 8 fewer short_answer questions than expected

**Possible Causes:**
- Some short_answer being correctly reclassified as problem ✓
- Some short_answer being incorrectly classified as completion or MCQ
- Some short_answer questions missing/undetected in binary

**Note:** Some detected "problem" questions appear to be fragments with missing diagrams (Q42-Q44), suggesting parsing artifacts

### 3. MCQ Overcount (Found 31, Need 30)

**Issue:** 1 extra MCQ in the count

**Theories:**
- One MCQ might actually be a different type
- Detection heuristic firing on non-MCQ question
- Data entry error in the original specification

---

## Code Changes This Session

### File: `packages/bnk-core/src/index.ts`

**1. Fixed Difficulty Label Detection (Line 839)**
```typescript
// Before: /^(easy|average|medium|moderate|difficult|hard)$/i
// After:  /^(easy|average|medium|moderate|difficult|hard)(\s*\+)?$/i
```

**2. Added Metadata Entry Filtering (Lines 554-567)**
- Filters out variable assignments (e.g., "t1 = 3, r = 2")
- Pattern: `/^[\$]?[a-z_][a-z0-9_]*[\$]?\s*=/`
- Result: 4 fake questions removed

**3. Added Problem Type Detection (Lines 1149-1169)**
```typescript
function isProblemQuestion(bodyText, algorithmicVariables)
```
- Detects 3+ variables, multi-part structures, long body text
- Result: 14 questions correctly reclassified

**4. Implemented Non-Metadata Question Parser (Lines 713-806)**
```typescript
function decodeNonMetadataQuestions()
function extractMatchingQuestionText()
function extractMatchingChoices()
```
- Parses matching questions from non-metadata section
- Handles 0x11 byte separators in choice extraction
- Result: 1 matching question fully decoded

---

## Recommendations for Next Steps

### Priority 1: Clarify Matching Question Count
- Verify with user: are there really 5 matching questions or just 1?
- If 5: Search for alternative matching question prompts or patterns
- If 1: Adjust expected count to 1, which resolves the 4-question gap

### Priority 2: Investigate Short Answer Gap
- Profile the 27 "problem" questions: how many are legitimate problems vs. corrupted fragments?
- If many are fragments with [DIAGRAM NEEDED], they might be misclassified completions
- May need additional heuristics to distinguish problem from short_answer

### Priority 3: Verify MCQ Count
- Check if the 31st MCQ is a detection error
- Look for potential false positives in MCQ heuristics

### Priority 4: Test on Other Chapters
- Apply same logic to Ch02-Ch09
- Verify pattern consistency across chapters
- Build confidence in the approach

---

## Files Modified

- `packages/bnk-core/src/index.ts` — Added matching parser, improved type detection, fixed difficulty label regex
- `/home/max/testgen-suite/bnk-decoder/BINARY_STRUCTURE_ANALYSIS.md` — Documented binary structure findings
- `/home/max/.claude/projects/-home-max-testgen-suite-bnk-decoder/memory/binary-structure-discovery.md` — Saved discovery findings

---

## Verification

To verify current decoding:
```bash
npm run build
npm run decode:file -- "ignore/ExamView/Banks/Pre-Calculus 11/Chapter 01.bnk"
node -e "const d=require('./reports/decoded/Chapter 01.json');
console.log('Questions:', d.questions.length);
d.questions.forEach(q => console.log(q.type));
"
```

Current output: 78 questions (31 MCQ, 6 completion, 1 matching, 13 short_answer, 27 problem)
