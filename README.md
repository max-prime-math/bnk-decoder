# BNK Decoder

Standalone Svelte app and shared TypeScript packages for decoding ExamView BNK files.

## Packages

- `packages/bnk-core`: framework-neutral decode/export/adapters API.
- `packages/question-model`: shared question and draft question types.
- `app`: standalone BNK decoder UI.

## PQP for test-generator

Working PQP files currently come from ExamView's own printout of a bank, not from
decoding the BNK binary directly. The BNK decoder still misses too much embedded
math and graph content.

1. Export the bank from ExamView as a PDF and as RTF (the RTF is the answer-key oracle).
2. Run the PDF through Mathpix and keep the LaTeX `.zip` for each chapter.
3. Convert the zips to PQP:

   ```sh
   npm run pqp:mathpix -- <zip-dir> <out-dir> [overrides.json]
   npm run pqp:algorithms -- <out-dir> <bnk-dir>   # attach ExamView algorithms where safe
   npm run pqp:precalc12   # both steps for Pre-Calculus 12 -> reports/pqp/pre-calculus-12
   ```

   The algorithm step reads the BNK's algorithm blocks and graph objects and attaches them
   only when test-generator's **Calculate values** is proven to produce correct versions,
   including redrawn graphs; see "Attaching Algorithms to PQP" in `docs/format-notes.md`.
   These packages use test-generator's value slots, ExamView functions and graph templates
   (the `algorithm-slots` branch).

4. Check the result before importing:

   ```sh
   npm run check:pqp -- reports/pqp/pre-calculus-12 ignore/Examples
   ```

   This compiles every stem, choice and solution as Typst, compares section counts and
   MCQ/completion answer keys with the RTF exports, and runs the files through
   test-generator's importer (set `TEST_GENERATOR_DIR` if it isn't at `../test-generator`).
   For algorithmic questions it also generates versions with test-generator's own engine
   and checks that they resolve, recompute correctly, and compile with their redrawn graphs.

5. In test-generator, import each `Chapter NN.pqp.json`, then upload that chapter's images
   from `assets/Chapter NN/` when prompted.

`data/pqp-overrides/` holds hand-reviewed fixes for the few questions whose OCR is
too scrambled to parse. Each entry records why it exists.

## Development

```sh
npm install
npm run dev
npm run check
npm run build
```

