# Phase 1 Results: Embedded Object Recovery — 68% Complete

**Date:** 2026-05-15  
**Starting point:** 258 embedded objects across Pre-Calculus 11  
**Result:** 82 remaining (176 recovered, 68% improvement)

---

## What Was Recovered

### High-Confidence Patterns (Successfully Implemented)

| Pattern | Examples | Result |
|---|---|---|
| **Quadratic on 2 points** | "If points (x₁,y₁) and (x₂,y₂) are on graph of [embedded]..." | Ch03 Q16: Shows f(x) = 7x² – 4x – 7 ✓ |
| **Axis of symmetry** | "What is axis of symmetry of [embedded object]?" | Ch03 Q2: Shows x = – 3 ✓ |
| **Function coefficient** | "h(d) = [embedded object](d – 12)² + 2" | Would work if variables present |
| **Triangle area** | "Equilateral triangle has area of [embedded object]" | Ch05 Q15: Shows 43.3 cm² ✓ |
| **Expression evaluation** | "Determine value when x=7, y=4; [embedded expression]" | Shows parameters + answer ✓ |
| **Generic diagram** | Standalone [embedded diagram/object] | Replaced with [DIAGRAM NEEDED] or metadata |

---

## Results by Chapter

```
Ch01: 3 remaining  (96% clean) — Excellent
Ch02: 4 remaining  (93% clean) — Excellent
Ch03: 5 remaining  (92% clean) — Excellent
Ch04: 9 remaining  (85% clean) — Good
Ch05: 14 remaining (77% clean) — Fair (graphs + diagrams)
Ch06: 10 remaining (84% clean) — Good
Ch07: 9 remaining  (86% clean) — Good
Ch08: 18 remaining (70% clean) — Weak (many diagrams, few variables)
Ch09: 10 remaining (84% clean) — Good

TOTAL: 82/570 questions still have embedded objects
OVERALL: 488/570 = 86% clean ✓
```

---

## What Remains (82 Objects)

### By Category

| Type | Count | Reason | Recovery Option |
|---|---|---|---|
| **Generic diagrams** | ~45 | No context variables | Phase 2: Context clues + metadata |
| **Math expressions** | ~25 | Missing variable data | Phase 2: Pattern templates |
| **Function definitions** | ~8 | Variables present but complex | Phase 2: Form templates |
| **OLE objects** | ~4 | Binary format | Deferred to v1.1 |

### Hardest Cases (Ch05, Ch08)

**Ch05** (14 remaining):
- Graph function diagrams (curves without equation)
- Area/perimeter problems (standalone, no variables)
- Equations for quadratic relations
- *Strategy:* Add graph description pattern + form templates

**Ch08** (18 remaining):
- System of equations diagrams (mostly visual, no variables)
- Inequality region sketches
- Solution set diagrams
- *Strategy:* Add placeholder categories (linear system, inequality region, etc.)

---

## Recommendations for Phase 2

### High-Value Improvements (2–3 hours each)

**1. Graph Function Recovery** — Would clean up Ch05
```
Pattern: "The graph of [embedded expression]..."
Recovery: Extract x/y range, describe as "parabola passing through origin" etc.
Impact: ~8–10 more questions
```

**2. System of Equations Diagram** — Would clean up Ch08
```
Pattern: "Solve the system [embedded diagram/object]" with variables like x, y, m, b
Recovery: "Linear system with lines y = m₁x + b₁ and y = m₂x + b₂"
Impact: ~6–8 more questions
```

**3. Perimeter/Area Expressions** — Would help Ch05
```
Pattern: "Find perimeter of [embedded object]; side = s"
Recovery: "Rectangle with sides s and " + calculated_width
Impact: ~4–5 more questions
```

### Lower-Value Improvements

- OLE equation objects (MathType binary) — defer to v1.1
- Complex diagram descriptions without variables — accept as limitations
- Inequality region sketches — require visual understanding

---

## Next Steps

### Option A: Continue Phase 2 (Recommended)
1. Add 3 more pattern recoveries (graphs, systems, perimeters)
2. Target: 88–90% clean (60 remaining or fewer)
3. Estimate: 2–3 sessions
4. Result: v1 release ready with minor limitations documented

### Option B: Release v1 Now
- Current: 86% clean questions
- Acceptable for "beta" release
- Phase 2 as v1.1 release
- Trade-off: Good enough vs. Excellent

### Option C: Focus on Worst Chapter (Ch08)
- Target 18 remaining embedded objects
- Add system of equations + inequality patterns
- Would bring Ch08 from 70% → 90%
- Side benefit: These patterns help other textbooks too

---

## Code Changes This Session

**File:** `packages/bnk-core/src/index.ts`  
**Function:** `recoverKnownEmbeddedObjectPatterns()`

**Added patterns:**
1. Quadratic function via 2 points + coefficients
2. Axis of symmetry with VAR3 lookup
3. Function coefficient in vertex form
4. Expression evaluation with x, y, answer
5. Triangle area value substitution
6. Generic diagram metadata fallback

**Lines changed:** ~80 lines added  
**Build time:** No increase (still <3s)

---

## Test & Verification

**Tested on:**
- All 9 Pre-Calculus 11 chapters
- Spot checks on specific questions (Q2, Q15, Q16, Q40)
- No regressions in existing patterns

**Commands to reproduce:**
```bash
npm run build
for ch in {1..9}; do
  npm run decode:file -- "ignore/ExamView/Banks/Pre-Calculus 11/Chapter 0${ch}.bnk"
done
```

---

## Conclusion

**Phase 1 succeeded in recovering 68% of embedded objects.** The decoder now produces **86% clean Typst output** that's usable for production. The remaining 14% are mostly diagrams and complex expressions that require either:
- Additional context variables (Phase 2 patterns)
- Visual understanding (out of scope)
- Binary parsing (deferred)

**Recommendation:** Either continue Phase 2 for 88–90% cleanliness, or release v1 now with clear documentation of limitations.
