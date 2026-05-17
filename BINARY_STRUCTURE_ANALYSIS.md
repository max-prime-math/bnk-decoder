# ExamView v06 Binary Structure Analysis

**Date:** 2026-05-15  
**File Under Analysis:** Chapter 01.bnk (Pre-Calculus 11)  
**Status:** Dual-section structure identified; narrative catalog and question linkage decoded; matching/problem section remains separate

---

## Executive Summary

The ExamView v06 binary format contains **two completely separate question sections** with different structural layouts:

| Section | Structure | Count | Status | Example |
|---------|-----------|-------|--------|---------|
| **Standard** | Difficulty + Section metadata | 57 | ✅ Decoded | MCQ with "Easy", "Section 1.2" |
| **Non-Metadata** | No difficulty/section prefix | 24 | ❌ Not decoded | "Match the correct term..." |

Current decoder finds **77/81 questions** (95% — missing 24 matching/problem questions)

The narrative layer is now also understood:
- The payload contains a dedicated `narr1`..`narr6` narrative catalog
- Each catalog entry is stored as a binary object preceded by the shared tag `0xfff3c370`
- Each question record carries a 32-bit ordinal immediately before its second `0xfff3c370` tag
- Ordinals `1..6` map to `narr1..narr6`; `-1` means no narrative

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

## Section 3: Narrative Catalog and Question Linkage

### Discovery Details

The shared prompt text for some question runs is not inferred from body text or parts. It is stored separately in the BNK payload and linked by ordinal.

### Binary Structure

In the inflated v06 payload, the narrative catalog appears as a sequence of narrative objects:

- `narr1` -> arithmetic sequence prompt
- `narr2` -> geometric/arithmetic/neither prompt
- `narr3` -> geometric sequence prompt
- `narr4` -> arithmetic series prompt
- `narr5` -> sum of arithmetic series prompt
- `narr6` -> recursion formula prompt

Each narrative object is stored as a text span associated with the same binary tag used by other v06 objects: `0xfff3c370`.

### Question Linkage

For narrative-bearing records, the question chunk contains:

1. A 32-bit ordinal selector
2. The second `0xfff3c370` tag
3. The ordinary question body stream

Observed mapping:

- `1` -> `narr1`
- `2` -> `narr2`
- `3` -> `narr3`
- `4` -> `narr4`
- `5` -> `narr5`
- `6` -> `narr6`
- `-1` -> no narrative

### Verified Behavior

- Questions `q-45` through `q-48` share the same geometric/arithmetic/neither narrative
- Questions `q-49` through `q-52` share the geometric-sequence narrative
- Questions `q-53` through `q-55` share the arithmetic-series narrative
- Question `q-56` gets the standalone sum-of-arithmetic-series narrative
- Standalone questions such as `q-59`, `q-67`, and `q-68` remain narrative-free

### Algorithm Scope Status

Current evidence from the v06 corpus:

- The `narr1`..`narr6` objects in `Chapter 01.bnk` appear to be pure shared prompt text.
- A broader corpus scan did not find `narrN` handles adjacent to obvious algorithm syntax such as `range(`, `isunique(`, `scramble`, or predicate expressions.
- So narrative-owned algorithms are not yet proven in the available banks, even though the ExamView feature model allows them.

---

## Section 4: Matching-Group Algorithm Prelude

### Discovery Details

Some matching questions in the non-metadata v06 section carry a full algorithm block immediately before the matching prompt.

This is the first confirmed non-question scope for algorithm state in the available corpus.

### Verified Example

In `Pre-Calculus 12/Chapter 03.bnk`, the matching question:

- `Match the correct term with the correct part of the statement.`

is preceded by an ordered algorithm block containing:

- variables `a` through `p`
- expression rules such as `a+b+c+d`, `f-k*l`, `g-k*m`, `h-k*n`
- sample values
- a long predicate condition using `abs(...)` and inequality tests
- `scramble`

The block sits directly ahead of the matching prompt in the same non-metadata string cluster, which makes `matching-group` the correct scope label for this algorithm state.

### Decoder Implication

- Standard question chunks still use the ordinary pre-display algorithm block.
- Matching questions need a separate prelude scan in the non-metadata section.
- The matching question itself should carry the shared algorithm group with scope `matching-group`.
- Linked item questions should not each get independent copies unless later evidence shows that ExamView materializes them that way.

### Current Status

- `bnk-decoder` now attaches a first-pass `algorithmModel` with `scope.kind = "matching-group"` to matching questions when this prelude is detected.
- The exact low-level record boundary for the matching prelude is not fully decoded yet; the current implementation uses a conservative extracted-string window ahead of the prompt.

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
