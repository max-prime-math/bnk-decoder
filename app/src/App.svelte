<script lang="ts">
  import {
    decodeBnkFile,
    toLatex,
    toPortableJson,
    toTypst,
    type DecodeResult,
  } from '@bnk-decoder/core';

  let fileName = $state('');
  let busy = $state(false);
  let error = $state('');
  let result = $state<DecodeResult | null>(null);
  let selectedQuestionId = $state<string | null>(null);

  let selectedQuestion = $derived(
    result?.questions.find((question) => question.id === selectedQuestionId) ?? result?.questions[0] ?? null,
  );

  async function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    busy = true;
    error = '';
    fileName = file.name;
    selectedQuestionId = null;

    try {
      result = await decodeBnkFile(await file.arrayBuffer(), { filename: file.name });
    } catch (err) {
      result = null;
      error = err instanceof Error ? err.message : 'Unable to decode this BNK file.';
    } finally {
      busy = false;
    }
  }

  function download(name: string, text: string, type: string) {
    const blob = new Blob([text], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    link.click();
    URL.revokeObjectURL(url);
  }

  function exportLatex() {
    if (!result) return;
    download(exportName('tex'), toLatex(result, { includeDiagnostics: true }), 'text/x-tex');
  }

  function exportTypst() {
    if (!result) return;
    download(exportName('typ'), toTypst(result, { includeDiagnostics: true }), 'text/plain');
  }

  function exportJson() {
    if (!result) return;
    download(exportName('json'), JSON.stringify(toPortableJson(result), null, 2), 'application/json');
  }

  function exportName(ext: string) {
    const base = fileName.replace(/\.[^.]+$/, '') || 'decoded-bank';
    return `${base}.${ext}`;
  }
</script>

<main class="shell">
  <section class="toolbar">
    <div>
      <p class="eyebrow">Standalone ExamView workflow</p>
      <h1>BNK Decoder</h1>
    </div>

    <label class="upload">
      <input type="file" accept=".bnk,.tst,.zip,application/octet-stream" onchange={(event) => handleFiles(event.currentTarget.files)} />
      Choose BNK File
    </label>
  </section>

  {#if error}
    <div class="notice error">{error}</div>
  {/if}

  <section class="workspace">
    <aside class="sidebar">
      <div class="summary">
        <span>{fileName || 'No file loaded'}</span>
        {#if busy}
          <strong>Decoding...</strong>
        {:else if result}
          <strong>{result.stats.questionCount} questions</strong>
        {/if}
      </div>

      {#if result}
        <div class="stats">
          <div><span>Assets</span><strong>{result.stats.assetCount}</strong></div>
          <div><span>Diagnostics</span><strong>{result.stats.diagnosticCount}</strong></div>
          <div><span>Raw fragments</span><strong>{result.stats.unsupportedFragmentCount}</strong></div>
        </div>

        <div class="actions">
          <button class="primary" onclick={exportLatex}>Export LaTeX</button>
          <button onclick={exportTypst}>Export Typst</button>
          <button onclick={exportJson}>Export JSON</button>
        </div>

        <div class="question-list" aria-label="Decoded questions">
          {#each result.questions as question, index}
            <button
              class:active={selectedQuestion?.id === question.id}
              onclick={() => (selectedQuestionId = question.id)}
            >
              <span>Question {index + 1}</span>
              <small>{question.type} · {question.confidence}</small>
            </button>
          {/each}
        </div>
      {:else}
        <div class="empty">
          <strong>Ready for a bank file.</strong>
          <span>Decoded questions, assets, and parser diagnostics will appear here.</span>
        </div>
      {/if}
    </aside>

    <section class="preview">
      {#if selectedQuestion}
        <div class="preview-header">
          <div>
            <p class="eyebrow">{selectedQuestion.type} · {selectedQuestion.confidence} confidence</p>
            <h2>{selectedQuestion.id}</h2>
          </div>
          {#if selectedQuestion.assets.length}
            <span>{selectedQuestion.assets.length} assets</span>
          {/if}
        </div>

        <article>
          <h3>Body</h3>
          <pre>{selectedQuestion.body.text}</pre>

          {#if selectedQuestion.choices?.length}
            <h3>Choices</h3>
            {#each selectedQuestion.choices as choice}
              <p><strong>{choice.id}.</strong> {choice.body.text}</p>
            {/each}
          {/if}

          {#if selectedQuestion.answer}
            <h3>Answer</h3>
            <p>{selectedQuestion.answer.value}</p>
          {/if}

          {#if selectedQuestion.solution}
            <h3>Solution</h3>
            <pre>{selectedQuestion.solution.text}</pre>
          {/if}

          {#if selectedQuestion.raw?.length}
            <h3>Preserved Raw Fragment</h3>
            <pre>{selectedQuestion.raw[0].hexPreview}</pre>
          {/if}
        </article>
      {:else if result}
        <div class="empty">
          <strong>No decoded questions yet.</strong>
          <span>The parser preserved diagnostics for follow-up work.</span>
        </div>
      {:else}
        <div class="empty">
          <strong>Load a file to begin.</strong>
          <span>This app uses the same shared core package that test-generator imports.</span>
        </div>
      {/if}
    </section>

    <aside class="diagnostics">
      <h2>Diagnostics</h2>
      {#if result?.diagnostics.length}
        {#each result.diagnostics as diagnostic}
          <div class="diagnostic" class:error={diagnostic.level === 'error'}>
            <strong>{diagnostic.code}</strong>
            <span>{diagnostic.message}</span>
          </div>
        {/each}
      {:else}
        <p>No diagnostics.</p>
      {/if}
    </aside>
  </section>
</main>

<style>
  .shell {
    min-height: 100vh;
    padding: 1.25rem;
  }

  .toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--line);
  }

  h1,
  h2,
  h3,
  p {
    margin: 0;
  }

  h1 {
    font-size: clamp(2rem, 5vw, 4.25rem);
    line-height: 0.95;
    font-family: Georgia, "Times New Roman", serif;
    font-weight: 500;
  }

  h2 {
    font-size: 1.15rem;
  }

  h3 {
    margin-top: 1.4rem;
    margin-bottom: 0.4rem;
    font-size: 0.82rem;
    color: var(--muted);
    text-transform: uppercase;
  }

  .eyebrow {
    color: var(--accent-strong);
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
  }

  .upload {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 42px;
    padding: 0.6rem 1rem;
    border-radius: 7px;
    background: var(--accent);
    color: white;
    cursor: pointer;
    font-weight: 700;
  }

  .upload input {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
  }

  .workspace {
    display: grid;
    grid-template-columns: minmax(240px, 320px) minmax(0, 1fr) minmax(220px, 300px);
    gap: 1rem;
    padding-top: 1rem;
  }

  .sidebar,
  .preview,
  .diagnostics {
    min-height: calc(100vh - 7rem);
    border: 1px solid var(--line);
    border-radius: 8px;
    background: var(--paper);
  }

  .sidebar,
  .diagnostics {
    padding: 1rem;
  }

  .summary {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--line);
  }

  .summary span,
  .empty span,
  .diagnostic span {
    color: var(--muted);
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
    margin: 1rem 0;
  }

  .stats div {
    padding: 0.55rem;
    border: 1px solid var(--line);
    border-radius: 7px;
  }

  .stats span,
  .stats strong {
    display: block;
  }

  .stats span {
    color: var(--muted);
    font-size: 0.72rem;
  }

  .actions {
    display: grid;
    gap: 0.5rem;
  }

  .question-list {
    display: grid;
    gap: 0.45rem;
    margin-top: 1rem;
  }

  .question-list button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: left;
  }

  .question-list button.active {
    border-color: var(--accent);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent) 18%, transparent);
  }

  small {
    color: var(--muted);
  }

  .preview {
    overflow: hidden;
  }

  .preview-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    border-bottom: 1px solid var(--line);
  }

  article {
    padding: 1rem;
  }

  pre {
    max-width: 100%;
    overflow: auto;
    padding: 0.8rem;
    border: 1px solid var(--line);
    border-radius: 7px;
    background: #f8f6ef;
    white-space: pre-wrap;
  }

  .diagnostics h2 {
    margin-bottom: 1rem;
  }

  .diagnostic {
    display: grid;
    gap: 0.25rem;
    padding: 0.75rem 0;
    border-top: 1px solid var(--line);
  }

  .diagnostic.error strong,
  .notice.error {
    color: var(--danger);
  }

  .notice {
    margin-top: 1rem;
    padding: 0.75rem;
    border: 1px solid currentColor;
    border-radius: 7px;
    background: var(--paper);
  }

  .empty {
    display: grid;
    gap: 0.45rem;
    padding: 1rem;
  }

  @media (max-width: 1000px) {
    .workspace {
      grid-template-columns: 1fr;
    }

    .sidebar,
    .preview,
    .diagnostics {
      min-height: auto;
    }
  }

  @media (max-width: 640px) {
    .shell {
      padding: 0.8rem;
    }

    .toolbar {
      align-items: stretch;
      flex-direction: column;
    }
  }
</style>
