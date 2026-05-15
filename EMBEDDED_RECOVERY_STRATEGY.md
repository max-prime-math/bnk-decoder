# Embedded Object Recovery Strategy

**Goal:** Replace 258 `[embedded ...]` placeholders with recoverable content

**Approach:** Context-based pattern matching + variable inference

---

## Breakdown of Embedded Objects

| Category | Count | Recoverable? | Strategy |
|---|---|---|---|
| **Generic Diagrams** | 65 | ⚠️ Hard | Text description from variables |
| **Math Expressions** | 60 | ⚠️ Partial | Reconstruct from variables |
| **Graphs** | 9 | ✅ Good | Describe function/coordinates |
| **Quadratic Functions** | 7 | ✅ Good | Template: f(x) = ax² + bx + c |
| **Triangles** | 2 | ✅ Good | Describe sides/angles |
| **Other Objects** | 52 | ⚠️ Hard | Placeholder + metadata |

---

## Recovery Strategies by Type

### 1. Quadratic Functions (7 questions)

**Pattern:** "...quadratic function [embedded math expression]..."  
**Available:** a, b, c, x₁, x₂, y₁, y₂ (point coordinates)

**Recovery Approach:**
- Template: `f(x) = {a}x² + {b}x + {c}`
- Or: `f(x) = {a}(x - {h})² + {k}` if vertex form variables exist
- Substitute variable values
- Example: If a=2, b=-3, c=4 → `f(x) = 2x² - 3x + 4`

**Implementation:**
```ts
function recoverQuadraticExpression(body: string, vars: AlgorithmicVariable[]): string {
  if (!body.includes('quadratic') || !body.includes('[embedded')) return body;
  
  const varMap = new Map(vars.map(v => [v.name, v.sampleValue || v.rule]));
  const a = varMap.get('a');
  const b = varMap.get('b');
  const c = varMap.get('c');
  
  if (a && b && c) {
    const expr = `f(x) = ${a}x² + ${b}x + ${c}`;
    return body.replace('[embedded math expression]', expr);
  }
  return body;
}
```

**Test Cases:** Ch03 Q16, Ch08 Q41

---

### 2. Graphs (9 questions)

**Pattern:** "...graph of [embedded ...]..."  
**Available:** x, y, coordinates, function description

**Recovery Approach:**
- Extract coordinate variables (x₁, y₁, x₂, y₂, etc.)
- List points: "Graph passing through (x₁, y₁), (x₂, y₂)"
- If function type mentioned, add function description
- Example: "Linear graph through (2, 5) and (4, 9)" 

**Implementation:**
```ts
function recoverGraphDescription(body: string, vars: AlgorithmicVariable[]): string {
  if (!body.includes('graph') || !body.includes('[embedded')) return body;
  
  const coords: [number, number][] = [];
  for (let i = 1; i <= 10; i++) {
    const x = vars.find(v => v.name === `x${i}`)?.sampleValue;
    const y = vars.find(v => v.name === `y${i}`)?.sampleValue;
    if (x && y) coords.push([parseFloat(x), parseFloat(y)]);
  }
  
  if (coords.length > 0) {
    const points = coords.map(([x, y]) => `(${x}, ${y})`).join(', ');
    const desc = `graph passing through ${points}`;
    return body.replace(/\[embedded [^\]]+\]/, desc);
  }
  return body;
}
```

**Test Cases:** Ch05 graph questions

---

### 3. Triangles (2 questions)

**Pattern:** "...triangle has...area/side/angle...of [embedded ...]..."  
**Available:** s (side), Area, ∠A, ∠B, ∠C, etc.

**Recovery Approach:**
- Extract side lengths and angles
- Build description: "Equilateral triangle with side 10 cm, area 43.3 cm²"
- Or: "Triangle with ∠A = 70°, ∠B = 60°, side c = 25 cm"

**Implementation:**
```ts
function recoverTriangleDescription(body: string, vars: AlgorithmicVariable[]): string {
  if (!body.includes('triangle') || !body.includes('[embedded')) return body;
  
  const varMap = new Map(vars.map(v => [v.name, v.sampleValue || v.rule]));
  const parts = [];
  
  const sides = ['a', 'b', 'c', 's'].filter(n => varMap.has(n));
  const angles = ['angleA', 'angleB', 'angleC'].filter(n => varMap.has(n));
  const area = varMap.get('Area') || varMap.get('area');
  
  if (sides.length > 0) parts.push(`sides: ${sides.map(n => varMap.get(n)).join(', ')}`);
  if (angles.length > 0) parts.push(`angles: ${angles.map(n => varMap.get(n)).join(', ')}`);
  if (area) parts.push(`area: ${area}`);
  
  const desc = `[Triangle: ${parts.join('; ')}]`;
  return body.replace(/\[embedded [^\]]+\]/, desc);
}
```

**Test Cases:** Ch05 Q15

---

### 4. Math Expressions (subset, 30 recoverable)

**Pattern:** Variable references in expressions  
**Available:** x, y, a, b, c, ANS, etc.

**Recovery Approach:**
- Analyze question context: "Determine value of expression when x=7, y=4"
- Infer expression template from variable names
- Can't fully recover unknown expressions, but can note variables
- Example: `[Expression with x=7, y=4; Answer=1/113]`

**Implementation:**
```ts
function recoverExpressionMetadata(body: string, vars: AlgorithmicVariable[]): string {
  if (!body.includes('[embedded expression')) return body;
  
  const params = vars.filter(v => /^[xy]$/.test(v.name) || v.name.match(/^(a|b|c)$/))
                      .map(v => `${v.name}=${v.sampleValue}`)
                      .join(', ');
  const ans = vars.find(v => /^ANS/.test(v.name))?.sampleValue;
  
  let replacement = `[Expression: ${params}`;
  if (ans) replacement += `; Answer=${ans}`;
  replacement += ']';
  
  return body.replace('[embedded expression]', replacement);
}
```

---

### 5. Generic Diagrams & Objects (99 remaining)

**Problem:** No semantic information available  
**Solution:** Multi-tier fallback

**Tier 1 - Pattern Matching:**
- Look for question text clues (mentions of specific shapes, concepts)
- Extract any related variables
- Generate descriptive placeholder

**Tier 2 - Metadata Placeholder:**
```
[DIAGRAM NEEDED: 
 Context: Geometry - angles and lines
 Related variables: angleA=70°, angleB=60°, sideBC=25cm
 Question type: description/analysis
]
```

**Tier 3 - Flag for Manual Review:**
- Mark question with confidence 'low'
- Add diagnostic note

**Implementation:**
```ts
function describeEmbeddedDiagram(body: string, vars: AlgorithmicVariable[], context: string): string {
  if (!body.includes('[embedded diagram')) return body;
  
  // Extract question concept
  const concepts = [];
  if (context.toLowerCase().includes('triangle')) concepts.push('triangles');
  if (context.toLowerCase().includes('angle')) concepts.push('angles');
  if (context.toLowerCase().includes('line')) concepts.push('lines');
  if (context.toLowerCase().includes('function')) concepts.push('functions');
  
  const varDesc = vars.slice(0, 5).map(v => `${v.name}=${v.sampleValue}`).join(', ');
  
  const desc = `[DIAGRAM: ${concepts.join(', ')} ${varDesc ? '(' + varDesc + ')' : ''}]`;
  return body.replace(/\[embedded diagram\/object\]/, desc);
}
```

---

## Implementation Plan

### Phase 1: High-Confidence Recoveries (20 questions)
1. **Quadratic functions** (7) — Template substitution
2. **Triangles** (2) — Variable-based description
3. **Graphs** (9) — Coordinate extraction
4. **Simple expressions** (2) — Answer + parameters

**Expected gain:** +20 → 238 complete questions

**Effort:** 2-3 hours  
**File:** `packages/bnk-core/src/index.ts` → extend `recoverKnownEmbeddedObjectPatterns()`

### Phase 2: Context-Based Descriptions (99 questions)
1. Analyze diagram questions for concept patterns
2. Implement `describeEmbeddedDiagram()` with concept detection
3. Map variable names to geometric/algebraic concepts
4. Generate metadata placeholders

**Expected gain:** +99 → 337 complete (with descriptive placeholders)

**Effort:** 4-5 hours

### Phase 3: Validation & Polish (159 remaining)
1. Test on full Pre-Calc 11 corpus
2. Identify remaining stubborn cases
3. Document format + examples
4. Update Typst output for new placeholder format

**Expected gain:** 85%+ of questions rendered with meaningful content

---

## Success Metrics

| Metric | Current | Target | Status |
|---|---|---|---|
| Questions with [embedded ...] | 258 | <50 | ⏳ |
| Renderable content | 312/570 | >480/570 | ⏳ |
| Complete Typst per chapter | 3/9 | 7/9 | ⏳ |
| v1 Readiness | 55% | 85% | ⏳ |

---

## Next: Start Phase 1

Priority order:
1. Implement `recoverQuadraticExpression()` — 7 questions
2. Implement `recoverGraphDescription()` — 9 questions
3. Implement `recoverTriangleDescription()` — 2 questions
4. Test on Ch03, Ch05, Ch08
5. Measure improvement
6. Decide: Continue → Phase 2 or iterate?
