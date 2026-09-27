// Manitoba Pre-Calculus 40S curriculum map shared by the PQP converters: class, units and
// outcome codes (sections). Moved unchanged from mathpix-to-pqp.mjs.
import { existsSync, readFileSync } from 'node:fs';

export function loadManitobaClass(curriculumClassesPath) {
  try {
    if (curriculumClassesPath && existsSync(curriculumClassesPath)) {
      const parsed = JSON.parse(readFileSync(curriculumClassesPath, 'utf8'));
      const classes = Array.isArray(parsed.classes) ? parsed.classes : [];
      const found = classes.find((item) => item?.id === 'pre-calculus-40s');
      if (found) return found;
    }
  } catch {
    // Fall back to the embedded Manitoba 40S map below.
  }
  return fallbackManitobaClass();
}

export function fallbackManitobaClass() {
  return {
    id: 'pre-calculus-40s',
    name: 'Pre-Calculus 40S',
    units: [
      {
        id: 'trigonometry',
        name: 'Trigonometry',
        sections: [
          { id: '12P.T.1', name: 'Demonstrate an understanding of angles in standard position, expressed in degrees and radians.' },
          { id: '12P.T.2', name: 'Develop and apply the equation of the unit circle.' },
          { id: '12P.T.3', name: 'Solve problems, using the six trigonometric ratios for angles expressed in radians and degrees.' },
          { id: '12P.T.4', name: 'Graph and analyze the trigonometric functions sine, cosine, and tangent to solve problems.' },
          { id: '12P.T.5', name: 'Solve, algebraically and graphically, first- and second-degree trigonometric equations with the domain expressed in degrees and radians.' },
          { id: '12P.T.6', name: 'Prove trigonometric identities, using reciprocal identities, quotient identities, Pythagorean identities, sum or difference identities (restricted to sine, cosine, and tangent), and double-angle identities (restricted to sine, cosine, and tangent).' },
        ],
      },
      {
        id: 'relations-and-functions',
        name: 'Relations and Functions',
        sections: [
          { id: '12P.R.1', name: 'Demonstrate an understanding of operations on, and compositions of, functions.' },
          { id: '12P.R.2', name: 'Demonstrate an understanding of the effects of horizontal and vertical translations on the graphs of functions and their related equations.' },
          { id: '12P.R.3', name: 'Demonstrate an understanding of the effects of horizontal and vertical compressions and stretches on the graphs of functions and their related equations.' },
          { id: '12P.R.4', name: 'Apply translations, compressions, and stretches to the graphs and equations of functions.' },
          { id: '12P.R.5', name: 'Demonstrate an understanding of the effects of reflections on the graphs of functions and their related equations, including reflections through the x-axis, y-axis, and line y = x.' },
          { id: '12P.R.6', name: 'Demonstrate an understanding of inverses of relations.' },
          { id: '12P.R.7', name: 'Demonstrate an understanding of logarithms.' },
          { id: '12P.R.8', name: 'Demonstrate an understanding of the product, quotient, and power laws of logarithms.' },
          { id: '12P.R.9', name: 'Graph and analyze exponential and logarithmic functions.' },
          { id: '12P.R.10', name: 'Solve problems that involve exponential and logarithmic equations.' },
          { id: '12P.R.11', name: 'Demonstrate an understanding of factoring polynomials of degree greater than 2 (limited to polynomials of degree ≤ 5 with integral coefficients).' },
          { id: '12P.R.12', name: 'Graph and analyze polynomial functions (limited to polynomial functions of degree ≤ 5).' },
          { id: '12P.R.13', name: 'Graph and analyze radical functions (limited to functions involving one radical).' },
          { id: '12P.R.14', name: 'Graph and analyze rational functions (limited to numerators and denominators that are monomials, binomials, or trinomials).' },
        ],
      },
      {
        id: 'permutations-combinations-binomial-theorem',
        name: 'Permutations, Combinations, and Binomial Theorem',
        sections: [
          { id: '12P.P.1', name: 'Apply the fundamental counting principle to solve problems.' },
          { id: '12P.P.2', name: 'Determine the number of permutations of n elements taken r at a time to solve problems.' },
          { id: '12P.P.3', name: 'Determine the number of combinations of n different elements taken r at a time to solve problems.' },
          { id: '12P.P.4', name: 'Expand powers of a binomial in a variety of ways, including using the binomial theorem (restricted to exponents that are natural numbers).' },
        ],
      },
    ],
  };
}

export function buildOutcomeLookup(curriculumClass) {
  const lookup = new Map();
  for (const unit of curriculumClass.units ?? []) {
    for (const section of unit.sections ?? []) {
      lookup.set(section.id, {
        unitId: unit.id,
        unitName: unit.name,
        sectionId: section.id,
        sectionName: section.name,
      });
    }
  }
  return lookup;
}
