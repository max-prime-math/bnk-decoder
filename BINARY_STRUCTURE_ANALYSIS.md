# ExamView v06 Binary Structure Analysis

**Date:** 2026-05-15  
**File Under Analysis:** Chapter 01.bnk (Pre-Calculus 11)  
**Status:** Dual-section structure identified; matching/problem section not yet decoded

---

## Executive Summary

The ExamView v06 binary format contains **two completely separate question sections** with different structural layouts:

| Section | Structure | Count | Status | Example |
|---------|-----------|-------|--------|---------|
| **Standard** | Difficulty + Section metadata | 57 | ✅ Decoded | MCQ with "Easy", "Section 1.2" |
| **Non-Metadata** | No difficulty/section prefix | 24 | ❌ Not decoded | "Match the correct term..." |

Current decoder finds **77/81 questions** (95% — missing 24 matching/problem questions)

---

## Section 1: Standard Questions (Metadata-Structured)

### Binary Format

Each question chunk follows this pattern:

```
[difficulty label] → [Section X.Y] → [Reference] → [Topic] → [Title] → [Question body] → [Padding]
```

### Difficulty Labels (81 total chunks)

The regex pattern identifies where chunks start:
```
/^(easy|average|medium|moderate|difficult|hard)(\s*\+)?$/i
```

**Count by difficulty:**
- Easy: 24
- Average: 41
- Difficult: 11
- Difficult +: 5
- Hard: 0
- **Total: 81 chunks**

### Example Chunk Structure

**Char Index 252,403 (Byte Offset 504,806):**
```
Difficulty: "Average"
Section: "Section 1.5"
Reference: "RF 10"
Topic: "Infinite Geometric Series"
Keywords: "explicit formula | sum | infinite geometric series"
Question: "One side of an equilateral triangle is 10 cm. The midpoints..."
Padding: ~1000 bytes of 0x00
[Next chunk starts]
```

### Current Decoding Results

Of the 81 chunks:
- **MCQ**: 31 decoded (1 extra — needs investigation)
- **Completion**: 6 decoded ✓
- **Short Answer**: 40 decoded (includes 19 misclassified problem questions)
- **Matching**: 0 decoded (missing — in different section)
- **Problem**: 0 decoded (missing — in different section)

---

## Section 2: Non-Metadata Questions (Matching & Problem)

### Discovery Details

**Location:** Char index ~270,368 (Byte offset ~540,736)

**Distance from last standard question:** ~18,000 characters (~36 KB gap)

### Binary Structure

At the start of the non-metadata section:

**Byte 540,736:**
```
54 00 69 00 6d 00 65 00 73 00 20 00 4e 00 65 00  "Times New Roman"
77 00 20 00 52 00 6f 00 6d 00 61 00 6e 00 00 00
[padding bytes]
04 00 00 00 ae 06 00 00 01 00 00 00 b5 00 00 00  [binary marker]
[more binary data]
4d 00 61 00 74 00 63 00 68 00 20 00 74 00 68 00  "Match the correct term..."
65 00 20 00 63 00 6f 00 72 00 72 00 65 00 63 00
...
```

### Key Characteristics

1. **No difficulty label** — Questions appear without "Easy" / "Average" prefix
2. **No Section metadata** — No "Section X.Y" header
3. **Direct text content** — Question body starts immediately after binary markers
4. **Choice separator**: `0x11` byte (decimal 17) appears between matching choices

### Content Example

```
"Match the correct term to its description below.
A. arithmetic series
[0x11 separator]
D. divergent series
[0x11 separator]
B. geometric sequence
[0x11 separator]
E. geometric series
[0x11 separator]
C. arithmetic sequence
[0x11 separator]
F. infinite geometric series"
```

---

## Binary Markers & Patterns

### Section Boundary Marker

At the end of standard questions section (byte ~539,000):
- Large block of null bytes (0x00) — padding/separator
- Font string: `Times New Roman\x00` (binary: `54 00 69 00...`)
- Binary marker sequence: `04 00 00 00 ae 06 00 00...`

### Question Boundaries in Non-Metadata Section

Matching questions appear to use:
- `0x11` byte (17 decimal) as separator between choice items
- Possible length prefix (4-byte integers before text blocks?)
- Font specification: "Times New Roman"

---

## Decoding Gaps

### Missing Question Types

| Type | Expected | Found | Gap |
|------|----------|-------|-----|
| Matching | 5 | 0 | ❌ Not in standard section |
| Problem | 19 | 0 | ❌ Misclassified as short_answer |
| **TOTAL MISSING** | **24** | - | - |

### Type Misclassification

The `inferVersion06QuestionType()` function has no logic to:
1. Detect matching questions (would need to look for "Match" prompt + choice pairs)
2. Distinguish problem questions from short_answer (default fallback applies)

### Root Cause

`findVersion06QuestionChunks()` ONLY searches for chunks with:
```
difficulty label + ("Section X.Y" OR "Lesson..." OR other metadata patterns)
```

This excludes all questions stored in the non-metadata section.

---

## Implementation Requirements

To decode matching & problem questions, we need:

### 1. Identify Section Boundary

- [ ] Find exact byte offset where standard section ends
- [ ] Identify marker that begins non-metadata section
- [ ] Possibly use: last difficulty label + next font string "Times New Roman"

### 2. Parse Non-Metadata Questions

- [ ] Scan the non-metadata section sequentially
- [ ] Use binary markers (`0x11` separators) to identify question boundaries
- [ ] Extract question body and choice items

### 3. Question Type Detection

```typescript
function detectQuestionTypeInNonMetadataSection(text: string): QuestionType {
  if (text.includes("Match")) return "matching";
  if (hasMultiplePartsMarkers(text)) return "problem"; // a), b), c), d)
  return "short_answer"; // fallback
}
```

### 4. Choice Extraction

- [ ] Parse `0x11`-separated items as choice options
- [ ] Extract choice labels (A, B, C, D, E, F for matching)
- [ ] Handle variable substitution for problem questions

---

## Section Boundary Identified

**Section Transition Point:** Char index 252,924 (Byte offset 505,848)

From char 252,403 (Last "Average" difficulty) to 252,924 (First "Times New Roman"):
- This is the end of the last standard question (geometry series question about triangles)
- Then immediately followed by non-metadata section marker

**Non-Metadata Section Structure:**

27 "Times New Roman" font markers create a pattern:
```
Gap pattern: 1172, 72, 174, 98, 800, 98, 800, 98, 800, ... (repeats 98/800)
Counts: 98-char gap appears 9 times, 800-char gap appears 8 times
```

This suggests:
- 3 header blocks (gaps: 1172, 72, 174)
- 8 content blocks with consistent metadata+content structure
- Each block: ~98 chars metadata (font + binary data) + ~800 chars content

**Known Content:**
- Char 270,353: "Match the correct term to its description below" (Matching question #1)
- Choices: arithmetic series, geometric sequence, arithmetic sequence, geometric series, divergent series, infinite geometric series
- Content repeats at end of payload (suggests all 5 matching questions may be identical)

---

## Current Issue with Type Classification

**Finding:** The 40 "short_answer" questions include both actual short_answer AND the 19 "problem" type questions

- Short answer candidates (>300 chars body): 11 questions
- Multi-part questions (a,b,c,d markers): 1 question
- Definition-type completions (short text, no variables): 28 questions

**Root Cause:** `inferVersion06QuestionType()` returns 'short_answer' as the default fallback for anything that's not MCQ or completion.

**Solution Strategy:**
1. Distinguish "problem" type: questions with multiple variable sets OR long multi-part bodies with algorithmic variables
2. Distinguish "matching" type: questions in non-metadata section with choice pairs
3. Add detection logic before the default fallback

---

## Next Actions

**Priority 1: Matching Question Parser** ⚠️ CRITICAL
- [ ] Implement `parseMatchingQuestions()` for non-metadata section
- [ ] Scan font markers (27 total) as question boundaries
- [ ] Extract choice pairs separated by binary markers
- [ ] Expected: 5 matching questions

**Priority 2: Improve Type Detection**
- [ ] Add logic to detect "problem" vs "short_answer" in standard section
- [ ] Criteria: multiple algorithmic variables present, OR multi-part structure
- [ ] Expected: reclassify 19 of the 40 short_answer as "problem"

**Priority 3: Integration**
- [ ] Call matching parser in `decodeVersion06QuestionCandidates()`
- [ ] Merge matching questions with standard questions
- [ ] Update ID sequence (q-1 through q-81)
- [ ] Verify total count: 30 MCQ + 6 completion + 5 matching + 21 short_answer + 19 problem = 81

**Test Cases:**
- Ch01 Q77-81: The 5 matching questions (should be "Match the correct term...")
- Ch01 Q51-69: The 19 problem questions (currently misclassified as short_answer)

---

## References

- **Memory:** [[binary-structure-discovery]]
- **Code File:** `packages/bnk-core/src/index.ts` (findVersion06QuestionChunks, decodeVersion06QuestionChunk)
- **Test File:** Chapter 01.bnk (47.7 KB compressed, 542.3 KB inflated)
