import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { inflateSync } from 'node:zlib';
import init, { TypstCompilerBuilder } from '@myriaddreamin/typst-ts-web-compiler';
import { readAlgorithmBlockAt } from '../../packages/bnk-core/src/algorithms.ts';
import { equationToTypst } from '../../packages/bnk-core/src/equations.ts';
import { readQuestionRecords } from '../../packages/bnk-core/src/records.ts';

const require = createRequire(import.meta.url);
await init({ module_or_path: readFileSync(require.resolve('@myriaddreamin/typst-ts-web-compiler/wasm')) });
const builder = new TypstCompilerBuilder();
builder.set_dummy_access_model();
for (const font of ['arial.ttf', 'times.ttf']) await builder.add_raw_font(readFileSync(`C:/Windows/Fonts/${font}`));
await builder.add_raw_font(readFileSync('.tools/fonts/NewCMMath-Regular.otf'));
const compiler = await builder.build();

function record(path, number) {
  const payload = inflateSync(readFileSync(path).subarray(16));
  const item = readQuestionRecords(payload).records.find(record => record.number === number);
  const variables = new Map(readAlgorithmBlockAt(payload, ...item.prefix.algorithm).map(entry => [entry.name, entry]));
  return { item, variables };
}
function findEquation(source, formatCode) {
  return source.item.blocks.flatMap(block => block.objects).find(object => object.kind === 'equation'
    && JSON.stringify(object.nodes).includes(`"type":"format","code":${formatCode}`));
}
function findTemplate(source, kind, variant) {
  return source.item.blocks.flatMap(block => block.objects).find(object => object.kind === 'equation'
    && object.nodes.some(node => node.type === 'template' && node.kind === kind && node.variant === variant));
}

const mean = record('ExamView/Banks/MathWorks 12/00-Reviewing Prior Concepts/Ch3-Review Prior Concepts.bnk', 31);
const meanRendered = equationToTypst(findEquation(mean, 0x17).nodes, mean.variables);
assert.deepEqual(meanRendered.errors, []);
assert.match(meanRendered.math, /overline\(x\) & =/);

const fractions = record('ExamView/Banks/Math Makes Sense 9/Unit 03/MMS9_3.4.bnk', 25);
const cancelledRendered = equationToTypst(findEquation(fractions, 0x0f).nodes, fractions.variables);
assert.deepEqual(cancelledRendered.errors, []);
assert.match(cancelledRendered.math, /cancel\(3\)/);

const synthetic = equationToTypst([
  { type: 'char', code: 65, style: -11 }, { type: 'format', code: 0x10 },
  { type: 'space', width: 5 },
  { type: 'char', code: 66, style: -11 }, { type: 'format', code: 0x11 },
  { type: 'space', width: 5 },
  { type: 'char', code: 121, style: -11 }, { type: 'format', code: 0x0e },
  { type: 'char', code: 100, style: -11 }, { type: 'format', code: 0x0e },
]);
assert.deepEqual(synthetic.errors, []);

const tolerances = record('ExamView/Banks/MathWorks 12/Ch2-Limits to Measurement/2.2 Tolerances.bnk', 3);
const toleranceRendered = equationToTypst(findTemplate(tolerances, 2, 2).nodes, tolerances.variables);
assert.deepEqual(toleranceRendered.errors, []);
const repeating = record('ExamView/Banks/Math Makes Sense 9/Unit 03/MMS9_3.1.bnk', 7);
const repeatingRendered = equationToTypst(findTemplate(repeating, 5, 0).nodes, repeating.variables);
assert.deepEqual(repeatingRendered.errors, []);
const system = record('ExamView/Banks/Pre-Calculus 11/Chapter 01.bnk', 66);
const systemRendered = equationToTypst(findTemplate(system, 5, 2).nodes, system.variables);
assert.deepEqual(systemRendered.errors, []);
const elimination = record('ExamView/Banks/Foundations of Math 10/Chapter 07/MMS10_7.5.bnk', 22);
const eliminationRendered = equationToTypst(findTemplate(elimination, 6, 0).nodes, elimination.variables);
assert.deepEqual(eliminationRendered.errors, []);
const domain = record('ExamView/Banks/Pre-Calculus 11/Chapter 03.bnk', 41);
const domainRendered = equationToTypst(findTemplate(domain, 0, 24).nodes, domain.variables);
assert.deepEqual(domainRendered.errors, []);
const division = record('ExamView/Banks/Pre-Calculus 12/Chapter 03.bnk', 36);
const divisionRendered = equationToTypst(findTemplate(division, 1, 8).nodes, division.variables);
assert.deepEqual(divisionRendered.errors, []);
const factors = record('ExamView/Banks/Foundations of Math 10/Chapter 03/MMS10_3.6.bnk', 22);
const factorsRendered = equationToTypst(findTemplate(factors, 8, 0).nodes, factors.variables);
assert.deepEqual(factorsRendered.errors, []);
const syntheticDivision = record('ExamView/Banks/Pre-Calculus 12/Chapter 03.bnk', 37);
const syntheticDivisionRendered = equationToTypst(findTemplate(syntheticDivision, 8, 0).nodes, syntheticDivision.variables);
assert.deepEqual(syntheticDivisionRendered.errors, []);

const source = `#set text(font: "Arial", size: 10pt)\n$ ${meanRendered.math} $\n#pagebreak()\n$ ${cancelledRendered.math} $\n#pagebreak()\n$ ${synthetic.math} $\n#pagebreak()\n$ ${toleranceRendered.math} $\n#pagebreak()\n$ ${repeatingRendered.math} $\n#pagebreak()\n$ ${systemRendered.math} $\n#pagebreak()\n$ ${eliminationRendered.math} $\n#pagebreak()\n$ ${domainRendered.math} $\n#pagebreak()\n$ ${divisionRendered.math} $\n#pagebreak()\n$ ${factorsRendered.math} $\n#pagebreak()\n$ ${syntheticDivisionRendered.math} $\n`;
compiler.add_source('/equation-formats.typ', source);
const world = compiler.snapshot(undefined, '/equation-formats.typ');
const result = world.compile(0, 3);
const artifact = result.hasError ? undefined : world.get_artifact(1, 3).result;
const report = { sourceBanks: 9, nativeOracleQuestions: [31, 25, 3, 7, 66, 22, 41, 36, 22, 37], hasError: result.hasError,
  diagnostics: result.diagnostics ?? [], pdfBytes: artifact?.length ?? 0 };
writeFileSync('reports/rea-examview/equation-format-typst.json', `${JSON.stringify(report, null, 2)}\n`);
if (artifact) writeFileSync('reports/rea-examview/equation-format-typst.pdf', artifact);
world.free(); compiler.free();
assert.equal(result.hasError, false, JSON.stringify(report.diagnostics));
assert.ok(artifact?.length > 1000);
console.log(`Equation format Typst verification passed (${artifact.length} PDF bytes).`);
