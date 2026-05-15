# v1 Release Status Assessment

**Date:** 2026-05-15  
**Target:** Production-ready decoder for any BNK file  
**Priority:** Pre-Calculus 11 (Grade 11)

---

## Current State

### ✅ What's Working

**Pre-Calculus 11 Corpus:**
- **570 total questions** decoded across 9 chapters
- **239 MCQ** — fully working with answers, choices, clean Typst output
- **30 Completion** — bodies decoded, minimal embedded objects
- **296 Short Answer** — bodies decoded
- **5 True/False** — decoded

**Typst Output:**
- Clean formatting (headers, bullet lists, math wrapping)
- Renders without errors
- Includes answer keys
- Metadata preserved (variables, confidence)

**Recent Improvements:**
- Detects all question types (MCQ, completion, short_answer, true_false)
- Per-character format runs (bold, italic, math mode)
- Math mode wrapping ($...$)
- Version/build badge in web app
- test-generator export format (with algorithmic variables)

---

### ⚠️ Major Blocker: Embedded Objects

**258 embedded objects** still unresolved in Pre-Calculus 11:
- **Diagrams** (≈170): Geometry figures, graphs, sketches
- **Math expressions** (≈60): Complex equations, expressions
- **Generic objects** (≈28): OLE/binary blobs

**Distribution by chapter:**
- Ch01: 9 (mostly diagrams)
- Ch02: 15
- Ch03: 19
- Ch04: 20
- Ch05: 56 (heaviest — graphs and functions)
- Ch06: 37
- Ch07: 28
- Ch08: 51
- Ch09: 23

**Why it matters:**
- Short_answer questions often ask about diagrams: "Refer to the diagram. What is...?"
- Completion questions: "Draw a graph of..." — embedded graph shown
- Geometry questions: Cannot answer without seeing the figure
- Makes Typst output incomplete/unusable

**Current workaround:** Placeholder `[embedded diagram/object]` — unusable for production

---

## Requirements vs Reality

| Requirement | Status | Notes |
|---|---|---|
| Decode ANY BNK file | ⚠️ Partial | Pre-Calc 11 works; other textbooks untested |
| Clean Typst code | ✅ Yes | Well-formatted, renders correctly |
| Renders correctly | ⚠️ 85% | MCQ renders; diagrams missing break visuals |
| Correct metadata | ✅ Yes | Variables, confidence, types all preserved |
| Algorithmic questions | ✅ Yes | 41 questions with variables; test-generator export ready |
| Priority: PC11 | ⚠️ Close | 570 questions decoded, but 258 need diagram handling |

---

## What's Blocking v1

### Tier 1 (Critical Path)

**Embedded Diagram Resolution** — 170 diagram placeholders

- Geometry diagrams (angles, triangles, circles)
- Function graphs
- 2D sketches

**Problem:** No text representation available; stored as binary OLE objects in BNK

**Solutions:**
1. **Text-describe diagrams:** Extract variable descriptions (e.g., triangle with angles/sides) → render as Typst code
2. **ASCII fallback:** Simple ASCII diagrams for basic shapes
3. **Placeholder with metadata:** `[DIAGRAM: triangle ∠A=70° ∠B=60° side a=25cm]`
4. **Mark for manual review:** Flag questions needing image reconstruction

**Effort:** 2–4 sessions to implement + test

---

### Tier 2 (Quality)

**Embedded Math Expressions** — 60 math placeholders

- Equations in OLE format (MathType binary)
- Complex expressions
- Example: Ch05 Q5, Ch09 Q2

**Problem:** MathType binary parsing needed

**Solutions:**
1. **Fallback pattern matching:** Some equations recoverable from variable names
2. **Placeholder strategy:** `[EQUATION: y = a(x−p)² + q]` from variables
3. **Mark as deferred:** Document limitation for v1.1

**Effort:** 1–2 sessions

---

### Tier 3 (Validation)

**Other BNK Formats** — Unknown

- Only Pre-Calc 11 thoroughly tested
- Version 05 format (Calculus) not supported
- Column-count detection hardcoded

**Effort:** 1–2 sessions to scan corpus + identify patterns

---

## Path to v1 Release

### Option A: Diagram-First (Recommended for completeness)

1. **Analyze diagram patterns** — Read 20 diagram-heavy questions, identify common types
2. **Implement text-diagram rendering** — Convert geometric description → Typst/ASCII
3. **Validate on Ch05** (heaviest with graphs) — Ensure graphs/diagrams render
4. **Test on full PC11** — 570 → 85%+ complete
5. **Scan other textbooks** — Verify decoder works broadly
6. **Release v1**

**Timeline:** 3–4 sessions  
**Result:** Production-ready decoder for PC11; confident on most textbooks

### Option B: MVP (Minimum viable for release)

1. **Keep embedded placeholders** — Mark clearly: `[DIAGRAM NEEDED]`
2. **Focus on textbooks without heavy diagrams** — Math Apprenticeship, Foundations
3. **Validate MCQ questions** — ~200+ per file
4. **Release v1 with known limitations** — "Diagrams not yet decoded"
5. **v1.1: Add diagram support**

**Timeline:** 1–2 sessions  
**Result:** Usable for theory/algebra questions; weak on geometry/graphing

### Option C: Hybrid (Diagram metadata approach)

1. **Extract diagram metadata** from variables (sides, angles, coordinates)
2. **Generate descriptive text** from metadata
3. **Include in Typst as comment blocks** + ASCII sketch
4. **Visual diagrams still missing**, but **text descriptions present**
5. **Enable manual diagram insertion** workflow

**Timeline:** 2–3 sessions  
**Result:** Functional for all question types; diagrams marked for manual addition

---

## Recommendation

**Start with Option A (Diagram-First)** because:

1. **PC11 is priority** — 258 embedded objects are critical blocker
2. **High ROI** — Fixing diagrams solves ~45% of remaining issues
3. **Foundation for other formats** — Diagram patterns will repeat across corpus
4. **Complete product** — v1 can be advertised as "fully decoded" not "mostly decoded"

**Immediate next step:**

1. Pick one geometry-heavy chapter (Ch03, Ch06 — triangles/angles)
2. Analyze 5 diagram questions; identify pattern types
3. Implement text-diagram converter for 1–2 types
4. Test on that chapter
5. Decide: Continue? Pivot? Merge with metadata approach?

---

## File Dependencies

- `packages/bnk-core/src/index.ts` — `recoverKnownEmbeddedObjectPatterns()` (extend for diagrams)
- `reports/decoded/Chapter *.json` — Input data (algorithmic variables)
- Test files: Ch03, Ch05, Ch06, Ch08 (highest diagram density)

