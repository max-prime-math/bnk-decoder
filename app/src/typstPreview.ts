import { $typst } from '@myriaddreamin/typst.ts';
import * as typstRendererWrapper from '@myriaddreamin/typst-ts-renderer';
import * as typstCompilerWrapper from '@myriaddreamin/typst-ts-web-compiler';
import rendererWasmUrl from '@myriaddreamin/typst-ts-renderer/wasm?url';
import compilerWasmUrl from '@myriaddreamin/typst-ts-web-compiler/wasm?url';
import type { DecodedQuestion } from '@bnk-decoder/core';

let configuredTypst = false;

export function questionToTypstDocument(question: DecodedQuestion): string {
  return [
    '#set page(width: 6.4in, height: auto, margin: 0.28in)',
    '#set text(font: "Libertinus Serif", size: 11pt)',
    '#set par(leading: 0.65em)',
    '',
    `#text(weight: "bold")[Question ${question.id.replace(/^q-/, '')}]`,
    '',
    renderQuestionBody(question),
  ].join('\n');
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
        lines.push(`- $ ${escapeMath(expression.typst)} $`);
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
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const parts: string[] = [];
  const pattern = /#math\.frac\(([^,]+),\s*([^)]+)\)/g;
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(normalized))) {
    parts.push(renderTextWithMath(normalized.slice(cursor, match.index)));
    parts.push(`$ frac(${escapeMath(match[1])}, ${escapeMath(match[2])}) $`);
    cursor = match.index + match[0].length;
  }

  parts.push(renderTextWithMath(normalized.slice(cursor)));
  return parts.join('');
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
      parts.push(`$ ${escapeMath(span)} $`);
    } else {
      parts.push(escapeTypstText(text.slice(start, end + 1)));
    }
    cursor = end + 1;
  }

  return parts.join('');
}

function isLikelyMathSpan(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  if (/\bif\s*\(|\bchr\s*\(|\bVAR\d/i.test(trimmed)) return false;
  if (/[A-Za-z]_[A-Za-z0-9({]/.test(trimmed)) return true;
  if (/\^/.test(trimmed)) return true;
  if (/#math\./.test(trimmed)) return true;
  if (/^[A-Za-z_][A-Za-z0-9_(){}]*\s*[=<>]/.test(trimmed)) return true;
  if (/^[–−-]?\d+\/\d+$/.test(trimmed)) return true;
  if (/^[–−]\d/.test(trimmed) && /^[–−]\d+(\.\d+)?$/.test(trimmed)) return true;
  if (/\\[A-Za-z]+/.test(trimmed)) return true;
  return false;
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
