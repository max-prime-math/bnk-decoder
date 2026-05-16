import { $typst } from '@myriaddreamin/typst.ts';
import * as typstRendererWrapper from '@myriaddreamin/typst-ts-renderer';
import * as typstCompilerWrapper from '@myriaddreamin/typst-ts-web-compiler';
import rendererWasmUrl from '@myriaddreamin/typst-ts-renderer/wasm?url';
import compilerWasmUrl from '@myriaddreamin/typst-ts-web-compiler/wasm?url';
import type { DecodedQuestion } from '@bnk-decoder/core';

let configuredTypst = false;

export function questionToTypstDocument(question: DecodedQuestion): string {
  const parts = [
    '#set page(width: 6.4in, height: auto, margin: 0.28in)',
    '#set text(font: "Libertinus Serif", size: 11pt)',
    '#set par(leading: 0.65em)',
    '',
    `#text(weight: "bold")[Question ${question.id.replace(/^q-/, '')}]`,
    '',
  ];

  if (question.narrative) {
    parts.push(contentToTypst(question.narrative.text));
    parts.push('');
  }

  parts.push(
    renderQuestionBody(question),
  );
  return parts.join('\n');
}

export async function renderQuestionTypstSvg(question: DecodedQuestion): Promise<string> {
  configureTypstRuntime();
  return $typst.svg({
    mainContent: questionToTypstDocument(question),
  });
}

function configureTypstRuntime() {
  if (configuredTypst) return;
  configuredTypst = true;

  $typst.setCompilerInitOptions({
    getWrapper: () => Promise.resolve(typstCompilerWrapper),
    getModule: () => compilerWasmUrl,
  });
  $typst.setRendererInitOptions({
    getWrapper: () => Promise.resolve(typstRendererWrapper),
    getModule: () => rendererWasmUrl,
  });
}

function renderQuestionBody(question: DecodedQuestion): string {
  const lines = [contentToTypst(question.parts?.stem.text ?? question.body.text)];

  if (question.parts?.items.length) {
    lines.push('');
    lines.push(renderParts(question.parts));
  }

  if (question.choices?.length) {
    lines.push('');
    for (const choice of question.choices) {
      lines.push(`- #text(weight: "bold")[${escapeTypstText(choice.id)}.] ${contentToTypst(choice.body.text)}`);
    }
  }

  if (question.answer?.value) {
    lines.push('', `#block(inset: 8pt, fill: rgb("#f6f0dc"), radius: 4pt)[#text(weight: "bold")[Answer:] ${contentToTypst(question.answer.value)}]`);
  }

  if (question.solution?.text.trim()) {
    lines.push('', `#text(weight: "bold")[Solution]`, contentToTypst(question.solution.text));
  }

  if (question.graphDefinitions?.length) {
    lines.push('', '#text(weight: "bold")[Recovered Graph Data]');
    for (const graph of question.graphDefinitions) {
      const expressions = graph.normalizedExpressions?.length
        ? graph.normalizedExpressions
        : graph.expressions.map((expression) => ({
            typst: expression,
            original: expression,
            substituted: expression,
          }));
      for (const expression of expressions) {
        lines.push(`- $${escapeMath(expression.typst)}$`);
        if (expression.original !== expression.substituted) {
          lines.push(`  #text(size: 8pt, fill: gray)[from ${escapeTypstText(expression.original)}]`);
        }
      }
    }
  }

  return lines.join('\n');
}

function renderParts(parts: NonNullable<DecodedQuestion['parts']>, depth = 1): string {
  const numbering = depth === 1 ? '(a)' : depth === 2 ? '(i)' : '(1)';
  const lines = ['#block['];
  lines.push(`  #set enum(numbering: "${numbering}", indent: 0pt, body-indent: 0.8em)`);
  for (const part of parts.items) {
    lines.push(renderPartItem(part, depth));
  }
  lines.push(']');
  return lines.join('\n');
}

function renderPartItem(part: NonNullable<DecodedQuestion['parts']>['items'][number], depth: number): string {
  const body = contentToTypst(part.body.text);
  const lines = body.trim().split('\n');
  const [first = '', ...rest] = lines;
  const out = [`  + ${first.trimEnd()}`];
  for (const line of rest) {
    out.push(line.trim().length > 0 ? `    ${line}` : '    ');
  }

  if (part.parts?.items.length) {
    out.push(renderParts(part.parts, depth + 1));
  }

  return out.join('\n');
}

function contentToTypst(text: string): string {
  return renderTextWithMath(markMathInText(text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')));
}

function renderTextWithMath(text: string): string {
  const parts: string[] = [];
  let cursor = 0;

  while (cursor < text.length) {
    const start = text.indexOf('$', cursor);
    if (start === -1) {
      parts.push(escapeTypstText(text.slice(cursor)));
      break;
    }

    const end = text.indexOf('$', start + 1);
    if (end === -1) {
      parts.push(escapeTypstText(text.slice(cursor)));
      break;
    }

    parts.push(escapeTypstText(text.slice(cursor, start)));
    const span = text.slice(start + 1, end).trim();
    if (isLikelyMathSpan(span)) {
      parts.push(`$${escapeMath(span)}$`);
    } else {
      const recovered = markPlainTextMath(span);
      if (recovered !== span) {
        parts.push(recovered);
      } else {
        parts.push(escapeTypstText(text.slice(start, end + 1)));
      }
    }
    cursor = end + 1;
  }

  return parts.join('');
}

function isLikelyMathSpan(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  if (/\bif\s*\(|\bchr\s*\(|\bVAR\d/i.test(trimmed)) return false;
  if (trimmed.startsWith('#math.')) return true;
  if (/^[–−-]?\d+(?:\.\d+)?\/\d+$/.test(trimmed)) return true;
  if (/^[–−-]?\d+(?:\.\d+)?(?:,\d+(?:\.\d+)?)+(?:,?\.{3}|,?…)?$/.test(trimmed)) return true;
  if (/^\(\s*[–−-]?\d+(?:\.\d+)?\s*,\s*[–−-]?\d+(?:\.\d+)?(?:\s*,\s*[–−-]?\d+(?:\.\d+)?)?\s*\)$/.test(trimmed)) return true;
  if (/^[A-Za-z]\d+$/.test(trimmed)) return true;
  if (/^[A-Za-z]_[A-Za-z0-9]+$/.test(trimmed)) return true;
  if (/^[A-Za-z]{1,8}\([^)]+\)$/.test(trimmed)) return true;
  if (/^[A-Za-z][A-Za-z0-9_]*(?:\([^)]+\))?([=<>]=?|[+\-*/^])/.test(trimmed)) return true;
  if (/^[+\-*/^=<>≤≥]+$/.test(trimmed)) return true;
  if (/^(?:sin|cos|tan|sec|csc|cot|asin|acos|atan|arcsin|arccos|arctan|log|ln|lim|max|min|gcd|lcm|sqrt|abs)$/i.test(trimmed)) return true;
  return false;
}

function markMathInText(text: string): string {
  const parts: string[] = [];
  let cursor = 0;

  while (cursor < text.length) {
    const start = text.indexOf('$', cursor);
    if (start === -1) {
      parts.push(markPlainTextMath(text.slice(cursor)));
      break;
    }

    parts.push(markPlainTextMath(text.slice(cursor, start)));

    const end = text.indexOf('$', start + 1);
    if (end === -1) {
      parts.push(markPlainTextMath(text.slice(start)));
      break;
    }

    const span = text.slice(start + 1, end);
    parts.push(isLikelyMathSpan(span) ? `$${normalizeMathSpan(span)}$` : text.slice(start, end + 1));
    cursor = end + 1;
  }

  return parts.join('');
}

function markPlainTextMath(text: string): string {
  const tokens = text.match(/\s+|[A-Za-z]_[A-Za-z0-9]+|[A-Za-z]\d+|\d+(?:\.\d+)?|[A-Za-z]+|[^\sA-Za-z0-9]/g);
  if (!tokens) return text;

  const out: string[] = [];
  for (let index = 0; index < tokens.length;) {
    const token = tokens[index];
    if (/^\s+$/.test(token)) {
      out.push(token);
      index++;
      continue;
    }

    const run = collectMathRun(tokens, index);
    if (!run) {
      out.push(token);
      index++;
      continue;
    }

    out.push(`$${normalizeMathSpan(run.text)}$`);
    index = run.end;
  }

  return out.join('');
}

function collectMathRun(tokens: string[], start: number): { text: string; end: number } | undefined {
  const first = tokens[start];
  if (!isMathStartToken(first, tokens[start + 1] ?? '', tokens.slice(start + 1))) return undefined;

  let end = start + 1;

  while (end < tokens.length) {
    const token = tokens[end];
    if (/^\s+$/.test(token)) {
      const next = tokens[end + 1];
      if (next && isMathContinuationToken(next, tokens[end + 2] ?? '', tokens.slice(end + 1))) {
        end++;
        continue;
      }
      break;
    }

    if (isMathContinuationToken(token, tokens[end + 1] ?? '', tokens.slice(end + 1))) {
      end++;
      continue;
    }

    break;
  }

  return { text: tokens.slice(start, end).join(''), end };
}

function isMathStartToken(token: string, nextToken = '', rest: string[] = []): boolean {
  const trimmed = token.trim();
  if (!trimmed) return false;
  if (isStrongMathToken(trimmed)) return true;
  if (/^[A-Za-z]\d+$/.test(trimmed)) return true;
  if (/^[A-Za-z]_[A-Za-z0-9]+$/.test(trimmed)) return true;
  if (/^[A-Za-z]$/.test(trimmed) && /^[(_^=<>+\-*/]$/.test(nextToken)) return true;
  if (/^\d+(?:\.\d+)?(?:,\s*)?$/.test(trimmed) && rest.some((part) => /^\s*$/.test(part) || /^[,\d]/.test(part))) {
    return true;
  }
  return false;
}

function isMathContinuationToken(token: string, nextToken = '', rest: string[] = []): boolean {
  const trimmed = token.trim();
  if (!trimmed) return false;
  if (isStrongMathToken(trimmed)) return true;
  if (/^[,;:+\-*/^=<>≤≥()…]+$/.test(trimmed)) return true;
  if (/^[A-Za-z]$/.test(trimmed)) return true;
  if (/^[A-Za-z]\d+$/.test(trimmed)) return true;
  if (/^[A-Za-z]_[A-Za-z0-9]+$/.test(trimmed)) return true;
  if (/^\d+(?:\.\d+)?(?:,\s*)?$/.test(trimmed)) return true;
  if (/^[A-Za-z]$/.test(trimmed) && /^[(_^=<>+\-*/]$/.test(nextToken)) return true;
  if (/^(?:sin|cos|tan|sec|csc|cot|asin|acos|atan|arcsin|arccos|arctan|log|ln|lim|max|min|gcd|lcm|sqrt|abs)$/i.test(trimmed)) return true;
  return false;
}

function isStrongMathToken(token: string): boolean {
  const trimmed = token.trim();
  if (!trimmed) return false;
  if (/^[–−-]?\d+(?:\.\d+)?\/\d+$/.test(trimmed)) return true;
  if (/^[–−-]?\d+(?:\.\d+)?(?:,\d+(?:\.\d+)?)+(?:,?\.{3}|,?…)?$/.test(trimmed)) return true;
  if (/^\(\s*[–−-]?\d+(?:\.\d+)?\s*,\s*[–−-]?\d+(?:\.\d+)?(?:\s*,\s*[–−-]?\d+(?:\.\d+)?)?\s*\)$/.test(trimmed)) return true;
  if (/^[A-Za-z]\d+$/.test(trimmed)) return true;
  if (/^[A-Za-z]_[A-Za-z0-9]+$/.test(trimmed)) return true;
  if (/^[A-Za-z]{1,8}\([^)]+\)$/.test(trimmed)) return true;
  if (/^[A-Za-z][A-Za-z0-9_]*(?:\([^)]+\))?([=<>]=?|[+\-*/^])/.test(trimmed)) return true;
  if (/^[+\-*/^=<>≤≥]+$/.test(trimmed)) return true;
  if (/^(?:sin|cos|tan|sec|csc|cot|asin|acos|atan|arcsin|arccos|arctan|log|ln|lim|max|min|gcd|lcm|sqrt|abs)$/i.test(trimmed)) return true;
  return false;
}

function normalizeMathSpan(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/(?<![A-Za-z0-9])([A-Za-z])(\d+)(?![A-Za-z0-9])/g, '$1_$2')
    .replace(/[–−]/g, '-')
    .trim();
}

function escapeTypstText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/#/g, '\\#')
    .replace(/\$/g, '\\$');
}

function escapeMath(text: string): string {
  return text.replace(/[#$]/g, '');
}
