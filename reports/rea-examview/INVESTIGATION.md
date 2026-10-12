# ExamView BNK investigation — 2026-10-11

The native converter now accepts one v05 or v06 BNK file and produces a self-contained
PQP file without PDF, Mathpix, or a course configuration. ExamView supplies the faithful
rendered snapshot while the structural reader adds safely matched TestGen algorithms.
Parsing a bank and faithfully rendering every question remain separate results; the
converter reports every omission and exits 2 for a partial native conversion.

## Artifact and evidence

Target: `ExamView/evpro.exe`, ExamView 7.5.0.0082, native x86 PE.
SHA256: `c58619d66fefb3e16ae5675c86ba04971f0a73d0f64b3bd630892999dabcd8f0`.
REA 6.3.0, Ghidra 12.1.4. The retained [native evidence bundle](native-evidence.json)
contains pseudocode, address references, provider identity, coverage, and limitations.
These are static observations of shipped code, corroborated against BNK bytes; they
are not runtime observations of ExamView executing or original recovered source.

Portable Ghidra and Temurin JDK 21 were downloaded into ignored `.tools/`, with hashes
checked against their release metadata. Sources: [Ghidra release](https://github.com/NationalSecurityAgency/ghidra/releases/tag/Ghidra_12.1.4_build)
and [Adoptium](https://adoptium.net/temurin/releases/?version=21). `scripts/rea-session.mjs`
provides a workspace-local REA MCP session using those runtimes; Codex registration
was separately applied with approval. No ExamView executable bytes were changed.

## Findings and their boundaries

| Finding | Executable evidence | Corroboration and interpretation |
| --- | --- | --- |
| Bank data is compressed after a 16-byte signature | `0x47edc0`, `0x4859b0`; `ev_479be88de5ec7ffead8a62282266e01fbbf1c91d4e39fb4275ae690cfada8127`, `ev_742600e8875d1e17c3796902e7d3342294060c75353a7c8e441f22df230d2450` | Native writer uses a compression stream; zlib inflation yields the known header and records. |
| Inflated bank header is 4092 bytes; counts select sequential question, narrative, matching records | `0x47edc0`, reader `0x47f680`; `ev_28726043d84248d87af6d5e3f2e1c3deac9083ef5e713212777138980c24f72c` | Header counts at `0xf58/0xf5c/0xf60`; no question-signature scan is needed. |
| Question fixed header is 532 bytes, followed by metadata and algorithm blocks with self-inclusive lengths | `0x47edc0`, `0x47d060`, `0x47c4b0`; `ev_0d478b1793f84e597ac3ea14e5e28c9a6f10449522a0a1b0fe7b731f76b340ee`, `ev_f782602c8372cb6a6db0cfd90f31285780e66c5aa30c9c17c82e546ca4ca87a8` | Metadata consists of variable numbers of terminated UTF16 strings; empty blocks explain the old fixed `+540` offset. Field meanings are retained raw rather than guessed across publishers. |
| Positive question field at `+12` refers to a narrative | `0x4801d0`, `0x40b420`; `ev_32f5c186e350da09ad1b5ecc8871c7ba5c199cc7a0852c74effdf6583b503027`, `ev_662cc3992b7d2762db35771f5c999bba009105e5dd10a898bd78e3cc00858d66` | Controlled bank links question 1 to narrative 1, text “This is a narrative.” Publisher PC11 Ch01 has 81 questions and six narratives. |
| Narrative header is 588 bytes; matching header is 40 bytes; each is followed by an algorithm block and optional rich text | Writer and reader above | Empty algorithm blocks account for old observed offsets `+592` and `+44`. Question matching group IDs are preserved; `0x40b470` performs group lookup. |
| Object subtype 6 is a separate 88-byte payload, not an equation | `0x4be790`, `0x4bc4c0`; `ev_a362180e3fe38b1f8243534a4f75ec3c0697f3ee9ceb65ddcd8b9b3d56931690`, `ev_3a6ace0e5068070a826f8c36300f704cec8753c6eb8546cc38b8e7800e3ac4db` | It holds a fixed UTF16 variable name and trailing raw field. The name resolves structurally to the record's stored algorithm display. |
| Equation token `0x0a` carries a terminated UTF16 variable name | `0x4bc520`; `ev_e90442fd64782d7b47acd4bac6d51e52c79133856e2c679dc8df6cf939678f6d` | Variable references and source ranges are preserved. Stored displays are substituted; expressions are not executed. |
| Subtype 8 equation tokens have a separate font/display footer | `0x4be0d0`; `ev_40466986f5df34ecdd06403cdbd0bde1e18f580251c461c9f3a3ddef4ebd2dd4` | Token end is `body + firstInt32 + 4`; footer lengths and string offsets are validated, and raw footer bytes are retained. All 217 Chapter01 equations have valid footer boundaries. |
| A consecutive subtype-8 run can represent one conditional equation slot | Chapter 04 questions 14/15; footer names and algorithm rules | Each footer name resolves to `if(which=n,true,false)`. When the run contains every value of the complete `rand(n)` selector exactly once and the stored sample activates exactly one branch, the native CLI lowers it to one TestGen string slot. Other visibility layouts fail closed. |
| Reader finishes after declared records without interpreting a remaining inflated tail | `0x47f680`, cleanup `0x485c20`; `ev_e6e7b43c85291c0f6a77d87d394c8dc7426ed4420068e6ba7199c832e37ff4fa` | 49 banks have opaque tails. They are preserved with diagnostics; their meaning remains unknown. |

## Verification

The focused core TypeScript configuration passes. The repository-wide `npm run check`
still depends on unresolved local workspace package aliases. TestGen's production build
passes with its existing Svelte and large-chunk advisories. `scripts/research/test-record-prefix.mjs` checks
five fixtures, source counts, contiguous typed records, narratives, bare publisher
choice labels, malformed lengths/counts/UTF16/footer behavior, and opaque tail retention.

The [corpus report](record-prefix-regression.json) records 372 parsed v06 banks,
13,871 questions, and 20,780 equation objects. The equation grammar audit now has
zero unsupported controls, glyphs, templates, or slot-boundary errors across all
20,780 objects. One corpus bank is v05 and outside the independent reader's
supported version; the native bridge upgrades it through a verified Save As copy.

The single-file smoke script verifies publisher Chapter01 question 1 from BNK bytes:
`f(x)=x²`, `g(x)=x²−9`, choices “9 units” left/right/down/up, and answer C. It also
checks a controlled narrative, nine embedded PNGs including their compressed pixel
streams, existing-output refusal, and bad-header failure without output.
The standalone structural publisher still omits named conditional alternatives in
Chapter01 questions 32/34, and real named written-response equations in Foundations of
Math10 Area questions 13/15 remain excluded with explicit visibility diagnostics. The
native CLI independently lowers the complete selector runs in Chapter 04 questions 14/15;
the resulting 22/22 algorithm models pass 25 TestGen evaluation seeds. The browser
integration test also forces every conditional selector value, compiles every valid branch
with Typst-WASM, and verifies that the sole non-rendered branch is rejected by the recovered
distinct-choice condition.

Across publisher Pre-Calculus12 Chapters01–11: 739 source records, 402 converted
records, 375 PQP questions, 337 omitted records, 19 embedded images. Matching groups
collapse several source records into a single PQP question. Teacher-made samples
convert all 22, 15, and 11 records respectively.

## Outstanding work

Native follow-up now decodes the framing of all 2,883 graph objects, including 26
embedded pictures, without signature scanning or inferred item counts. See
[GRAPH-FINDINGS.md](GRAPH-FINDINGS.md) and [EQUATION-GRAMMAR.md](EQUATION-GRAMMAR.md).
The new graph records retain native bytes and dimensions; independent graph rendering
is still unsupported and causes an explicit omission in the structural CLI.

ExamView's Blackboard command 31606 exports question HTML, native-rendered images,
answers and essay solutions directly from a BNK. Both Chapter01 exports contain 67
native items representing 71 records, with 304 referenced images and no missing assets.
However, some graphical completion answers are absent from XML, and one matching
condition references a nonexistent response. A same-loaded-bank RTF export preserves
the missing answers without OCR. The RTF reader verifies 71
answer records, five separately numbered matching stems, and 308 native WMF images.
The synchronized native bridge is now implemented as `npm run pqp:examview`.
[Full publisher validation](native-publisher-OR4kc6/summary.json) covers 739/739 records
in Chapters01–11, yielding 696 PQP questions and 2,530 embedded images with no omissions.
Every package compiles in Typst; all 300 multiple-choice keys independently match
the paired RTF. Generated package shapes also conform to the repository's actual
`PortableQuestionPackage` TypeScript interface, including canonical type names and
producer timestamps. Source hashes remain unchanged, and original banks are embedded.

Visual review of compiled Chapter01 question35 confirms the native fractional
coefficient and inverse answer `f⁻¹(x) = (4/5)x + 4`. Image alignment now follows
HTML alignment or native RTF vertical shifts; zero-height HTML rows retain natural
content height rather than clipping table content.

Chapter11 contains a missing Euclid Symbol font. Original source glyph U+F0A5 and
native HTML `Euclid Symbol` byte A5 are now decoded as U+221E INFINITY. This
mapping is established by the publisher's original `ignore/examples/Chapter 11.pdf`
(SHA-256 `bc2248c8f83881687a632291ff692e02c549171029e4b28e4e83190a9cbf5610`):
on page 15 its embedded symbol font draws both occurrences as infinity, while
PDF.js reports the same text items as U+F0A5 (items 134 and 138, embedded font
`g_d0_f4`). This is glyph evidence, not an inference from the surrounding
arithmetic. The mapping is deliberately limited to this exact face and byte;
other missing-font glyphs still fail closed or retain controlled GDI fallback
evidence. Static REA searches of `evpro.exe` SHA-256
`c58619d66fefb3e16ae5675c86ba04971f0a73d0f64b3bd630892999dabcd8f0`
found `FSC Symbol` at `0x6069c8`, its two missing/registration messages at
`0xf5fa4c` and `0xf5fb60`, and `fscsymbo.ttf` at `0x606a24`, with no `Euclid`
string in the complete Ghidra string inventory (REA Evidence
`ev_d4686f788c41ea6afd460aae131c79c8717873843f8198b656d9e1c6d47df7b1`,
`ev_7f4257e3393ce8b90376230975bdabf03f19608476f5608dbc24aa4731ee5ef1`,
`ev_6addcc80bea74d804215ae725e4fa8bb4c1267795486ed9039c7b0ed0d7bef40`).
The shipped `fscsymbo.ttf` identifies itself as FSC Symbol and has SHA-256
`523be44b7cb3da234b00f1a6fd161195ec95daf22447ee6eac3f3c1fe8cd3c7c`;
the ExamView install/uninstall inventory contains no Euclid font.

These results establish native snapshot coverage and compilation, not independent
semantic decoding of every graph/math format or every-corpus pixel parity. Independent
graph rendering remains research-only; the native bridge now supports v05 through a
verified Save As upgrade. TestGen now imports inline PQP assets directly, and browser
integration tests compile every original Chapter 03/04 question plus one generated
variant for each attached algorithm with TestGen's Typst-WASM compiler.

## Additional native-export fidelity findings

Native question type 4 is bimodal, confirmed by ExamView's own question editor and
commands 30590/30591. Switching its presentation reorders exported question IDs.
More seriously, short-answer bimodal exports reuse `mc001-1.jpg` across questions,
overwriting earlier images. Area's rectangle question can consequently reference
the final triangle image. Counts and successful compilation did not detect this.
Alternate presentation alignment requires content evidence. Paired RTF now repairs
these images before alignment; missing RTF rationale requires a uniquely matched
independent native export with identical image bytes and dimensions. Earlier Area
and PC11 coverage reports must not be interpreted as verified diagram fidelity.

The [latest publisher validation](native-publisher-dual-YtJbgT/validated-summary.json)
passes 739/739 records, 696 questions, 2,707 assets, 446 alternate presentations,
and 523 independently checked choice keys. All eleven packages compile and satisfy
the PQP interface. [Extended validation](native-extended-hI8DxY/summary.json) passes
242/242 additional records, including the v05 Calculus bank, with both presentations.

Native metafile font quality originally made tiny `m` labels look like solid boxes.
Checked GDI replay now uses a recorded antialias adjustment on temporary metafile
bytes. Original metafiles remain exact. Rejected pixel operations are allowed only
when GDI proves the pixel is outside the clipping region; other errors are fatal.
See the runtime-oracle metafile fidelity and clipping regression reports. These
changes improve legibility without claiming exact native-pixel parity.

Claude added an independent graph evaluator and SVG renderer. Its audited comparison
covers 424 candidates, 387 without explicit errors, 20 errors and 17 unpaired cases.
248 meet a relaxed comparison threshold, whose pairing and raster approximations
do not establish production fidelity. SVG output now rejects errors or approximation
warnings unless a caller explicitly requests a research preview.

- Decode and render graphs and the remaining embedded object codecs.
- Decode completion answers and the remaining encoded algorithm-display formats.
- Extend named-equation visibility beyond complete mutually exclusive `rand(n)` selector
  runs; other named equation layouts still produce an explicit omission.
- Confirm unresolved or conflicting algorithm scope rules without guessing values.
- Independently decode v05; the native Save As route already supports its conversion.
- Extend conservative TestGen algorithm attachment beyond the verified Chapter 03
  17/28 subset. Chapter 04 is now 22/22; remaining Chapter 03 work includes implicit
  coefficients, ambiguous repeated values, and the graph whose decoded curve reaches only
  54% of the native printed ink.
- Compare representative rendered questions/answers against ExamView itself. Structural
  counts and internally clean diagnostics do not establish semantic parity.

There are no bank-specific wording patches or reconstructed formulas in this change.
The native CLI attaches randomized TestGen models only after exact source-record alignment
and unambiguous field-slot verification; every rejected model remains a static native
snapshot with a reason. The standalone UI still uses the previous broader decoder path;
the production-fidelity direct path is `npm run pqp:examview`.
