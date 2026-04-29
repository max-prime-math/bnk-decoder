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
  const lines = [contentToTypst(question.body.text)];

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

function contentToTypst(text: string): string {
  const parts: string[] = [];
  const pattern = /#math\.frac\(([^,]+),\s*([^)]+)\)/g;
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text))) {
    parts.push(escapeTypstText(text.slice(cursor, match.index)));
    parts.push(`$ frac(${escapeMath(match[1])}, ${escapeMath(match[2])}) $`);
    cursor = match.index + match[0].length;
  }

  parts.push(escapeTypstText(text.slice(cursor)));
  return parts.join('');
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
