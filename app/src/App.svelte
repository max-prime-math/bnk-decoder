<script lang="ts">
  import {
    decodeBnkFile,
    toLatex,
    toPortableJson,
    toPortableQuestionPackage,
    toTestGeneratorQuestions,
    toTypst,
    type DecodeResult,
    type DecodedGraphDefinition,
    type GraphSamplePoint,
  } from '@bnk-decoder/core';
  import { questionToTypstDocument, renderQuestionTypstSvg } from './typstPreview';
  import { deleteStoredBank, getStoredBank, listStoredBanks, putStoredBank, type StoredBankRecord } from './bankStore';

  type StoredBankSummary = Omit<StoredBankRecord, 'bytes'>;

  let fileName = $state('');
  let busy = $state(false);
  let error = $state('');
  let result = $state<DecodeResult | null>(null);
  let selectedQuestionId = $state<string | null>(null);
  let selectedBankId = $state<string | null>(null);
  let banks = $state<StoredBankSummary[]>([]);
  let selectedQuestionByBank = $state<Record<string, string | null>>({});
  let renderPreview = $state(false);
  let renderBusy = $state(false);
  let renderError = $state('');
  let renderedTypstSvg = $state('');

  let selectedQuestion = $derived(
    result?.questions.find((question) => question.id === selectedQuestionId) ?? result?.questions[0] ?? null,
  );
  let selectedQuestionTypst = $derived(selectedQuestion ? questionToTypstDocument(selectedQuestion) : '');

  $effect(() => {
    const onKeydown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return;

      if ((event.key === 'ArrowDown' || event.key === 'j') && result?.questions.length) {
        event.preventDefault();
        selectRelativeQuestion(1);
      } else if ((event.key === 'ArrowUp' || event.key === 'k') && result?.questions.length) {
        event.preventDefault();
        selectRelativeQuestion(-1);
      } else if (event.key === 'h') {
        event.preventDefault();
        selectRelativeBank(-1);
      } else if (event.key === 'l') {
        event.preventDefault();
        selectRelativeBank(1);
      }
    };

    window.addEventListener('keydown', onKeydown);
    return () => window.removeEventListener('keydown', onKeydown);
  });

  $effect(() => {
    if (!selectedQuestionId) return;
    document.getElementById(`question-${selectedQuestionId}`)?.scrollIntoView({
      block: 'nearest',
    });
  });

  $effect(() => {
    loadStoredBanks();
  });

  $effect(() => {
    if (!selectedBankId) return;
    void loadSelectedBank(selectedBankId);
  });

  $effect(() => {
    const question = selectedQuestion;
    if (!renderPreview || !question) {
      renderedTypstSvg = '';
      renderError = '';
      renderBusy = false;
      return;
    }

    let cancelled = false;
    renderBusy = true;
    renderError = '';

    renderQuestionTypstSvg(question)
      .then((svg) => {
        if (cancelled) return;
        renderedTypstSvg = svg;
      })
      .catch((err) => {
        if (cancelled) return;
        renderedTypstSvg = '';
        renderError = err instanceof Error ? err.message : 'Typst could not render this question.';
      })
      .finally(() => {
        if (!cancelled) renderBusy = false;
      });

    return () => {
      cancelled = true;
    };
  });

  async function handleFiles(files: FileList | null) {
    const batch = Array.from(files ?? []);
    if (!batch.length) return;
    busy = true;
    error = '';
    renderedTypstSvg = '';
    renderError = '';

    try {
      const stored = [];
      for (const file of batch) {
        const bytes = await file.arrayBuffer();
        const record: StoredBankRecord = {
          id: file.name,
          filename: file.name,
          uploadedAt: Date.now(),
          size: file.size,
          bytes,
        };
        await putStoredBank(record);
        stored.push(record.id);
      }
      await loadStoredBanks();
      selectedBankId = stored.at(-1) ?? selectedBankId;
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

  function exportPqp() {
    if (!result) return;
    download(exportName('pqp.json'), JSON.stringify(toPortableQuestionPackage(result), null, 2), 'application/json');
  }

  function exportTestGenerator() {
    if (!result) return;
    download(exportName('test-gen.json'), JSON.stringify(toTestGeneratorQuestions(result), null, 2), 'application/json');
  }

  function exportName(ext: string) {
    const base = fileName.replace(/\.[^.]+$/, '') || 'decoded-bank';
    return `${base}.${ext}`;
  }

  function selectRelativeQuestion(delta: number) {
    if (!result?.questions.length) return;
    const currentIndex = Math.max(
      0,
      result.questions.findIndex((question) => question.id === selectedQuestion?.id),
    );
    const nextIndex = (currentIndex + delta + result.questions.length) % result.questions.length;
    const nextId = result.questions[nextIndex].id;
    selectedQuestionId = nextId;
    if (selectedBankId) selectedQuestionByBank = { ...selectedQuestionByBank, [selectedBankId]: nextId };
  }

  function selectRelativeBank(delta: number) {
    if (!banks.length) return;
    const currentIndex = Math.max(0, banks.findIndex((bank) => bank.id === selectedBankId));
    const nextIndex = (currentIndex + delta + banks.length) % banks.length;
    selectedBankId = banks[nextIndex]?.id ?? null;
  }

  function isTypingTarget(target: EventTarget | null) {
    if (!(target instanceof HTMLElement)) return false;
    const tag = target.tagName.toLowerCase();
    return tag === 'input' || tag === 'textarea' || tag === 'select' || target.isContentEditable;
  }

  type GraphBounds = { minX: number; maxX: number; minY: number; maxY: number };
  const graphWidth = 260;
  const graphHeight = 160;
  const graphColors = ['#b54a2f', '#276f7a', '#7761a7', '#6f7c2d', '#a4527c'];

  function graphHasSamples(graph: DecodedGraphDefinition) {
    return Boolean(graph.normalizedExpressions?.some((expression) => expression.samplePoints?.length));
  }

  function graphBounds(graph: DecodedGraphDefinition): GraphBounds {
    const points = graph.normalizedExpressions?.flatMap((expression) => expression.samplePoints ?? []) ?? [];
    const xs = points.map((point) => point.x);
    const ys = points.map((point) => point.y);
    const minX = Math.min(-1, 0, ...xs);
    const maxX = Math.max(1, 0, ...xs);
    const minY = Math.min(-1, 0, ...ys);
    const maxY = Math.max(1, 0, ...ys);
    const yPadding = Math.max(1, (maxY - minY) * 0.08);
    return { minX, maxX, minY: minY - yPadding, maxY: maxY + yPadding };
  }

  function graphX(x: number, bounds: GraphBounds) {
    return ((x - bounds.minX) / (bounds.maxX - bounds.minX)) * graphWidth;
  }

  function graphY(y: number, bounds: GraphBounds) {
    return graphHeight - ((y - bounds.minY) / (bounds.maxY - bounds.minY)) * graphHeight;
  }

  function graphSegments(points: GraphSamplePoint[]) {
    const segments: GraphSamplePoint[][] = [];
    let current: GraphSamplePoint[] = [];
    for (const point of points) {
      const previous = current.at(-1);
      if (previous && Math.abs(point.x - previous.x) > 0.51) {
        if (current.length > 1) segments.push(current);
        current = [];
      }
      current.push(point);
    }
    if (current.length > 1) segments.push(current);
    return segments;
  }

  function graphPolyline(points: GraphSamplePoint[], bounds: GraphBounds) {
    return points.map((point) => `${graphX(point.x, bounds).toFixed(2)},${graphY(point.y, bounds).toFixed(2)}`).join(' ');
  }

  function graphColor(index: number) {
    return graphColors[index % graphColors.length];
  }

  async function loadStoredBanks() {
    try {
      const stored = await listStoredBanks();
      banks = stored;
      if (!selectedBankId && stored.length) selectedBankId = stored[0].id;
      if (selectedBankId && !stored.some((bank) => bank.id === selectedBankId)) {
        selectedBankId = stored[0]?.id ?? null;
      }
    } catch (err) {
      error = err instanceof Error ? err.message : 'Unable to load stored banks.';
    }
  }

  async function loadSelectedBank(bankId: string) {
    const bank = await getStoredBank(bankId);
    if (!bank) {
      result = null;
      fileName = '';
      selectedQuestionId = null;
      return;
    }

    busy = true;
    error = '';
    fileName = bank.filename;
    renderedTypstSvg = '';
    renderError = '';

    try {
      const decoded = await decodeBnkFile(bank.bytes.slice(0), { filename: bank.filename });
      result = decoded;
      const preferredQuestionId = selectedQuestionByBank[bankId]
        ?? decoded.questions[0]?.id
        ?? null;
      selectedQuestionId = decoded.questions.some((question) => question.id === preferredQuestionId)
        ? preferredQuestionId
        : decoded.questions[0]?.id ?? null;
    } catch (err) {
      result = null;
      error = err instanceof Error ? err.message : 'Unable to decode this BNK file.';
    } finally {
      busy = false;
    }
  }

  async function removeBank(bankId: string) {
    await deleteStoredBank(bankId);
    selectedQuestionByBank = Object.fromEntries(
      Object.entries(selectedQuestionByBank).filter(([id]) => id !== bankId),
    );
    if (selectedBankId === bankId) {
      selectedBankId = null;
      result = null;
      fileName = '';
      selectedQuestionId = null;
    }
    await loadStoredBanks();
  }
</script>

<main class="shell">
  <section class="toolbar">
    <div>
      <p class="eyebrow">Standalone ExamView workflow</p>
      <h1>BNK Decoder</h1>
    </div>

    <label class="upload">
      <input type="file" multiple accept=".bnk,.tst,.zip,application/octet-stream" onchange={(event) => handleFiles(event.currentTarget.files)} />
      Add BNK Files
    </label>
  </section>

  {#if error}
    <div class="notice error">{error}</div>
  {/if}

  <section class="workspace">
    <aside class="sidebar">
      <div class="summary">
        <span>{fileName || 'No bank selected'}</span>
        {#if busy}
          <strong>Decoding...</strong>
        {:else if result}
          <strong>{result.stats.questionCount} questions</strong>
        {/if}
      </div>

      <div class="bank-library" aria-label="Stored banks">
        <div class="bank-library-header">
          <strong>Banks</strong>
          <small>{banks.length}</small>
        </div>
        {#if banks.length}
          <div class="bank-list">
            {#each banks as bank}
              <div class="bank-item" class:active={bank.id === selectedBankId}>
                <button class="bank-select" onclick={() => (selectedBankId = bank.id)}>
                  <span>{bank.filename}</span>
                  <small>{Math.max(1, Math.round(bank.size / 1024))} KB</small>
                </button>
                <button class="bank-delete" aria-label={`Delete ${bank.filename}`} onclick={() => removeBank(bank.id)}>Delete</button>
              </div>
            {/each}
          </div>
        {:else}
          <div class="empty compact">
            <strong>No stored banks.</strong>
            <span>Uploads persist in this browser until you delete or overwrite them.</span>
          </div>
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
          <button onclick={exportPqp}>Export PQP</button>
          <button onclick={exportTestGenerator}>Export for test-generator</button>
        </div>

        <div class="question-list" aria-label="Decoded questions">
          {#each result.questions as question, index}
            <button
              id={`question-${question.id}`}
              class:active={selectedQuestion?.id === question.id}
              onclick={() => {
                selectedQuestionId = question.id;
                if (selectedBankId) selectedQuestionByBank = { ...selectedQuestionByBank, [selectedBankId]: question.id };
              }}
            >
              <span>Question {index + 1}</span>
              <small>{question.type} · {question.confidence}</small>
            </button>
          {/each}
        </div>
      {:else}
        <div class="empty">
          <strong>Ready for bank files.</strong>
          <span>Uploads persist in this browser. Select a stored bank to decode it again.</span>
        </div>
      {/if}
    </aside>

    <section class="preview">
      {#if result}
        <div class="preview-header">
          <div>
            {#if selectedQuestion}
              <p class="eyebrow">{selectedQuestion.type} · {selectedQuestion.confidence} confidence</p>
              <h2>{selectedQuestion.id}</h2>
            {:else}
              <p class="eyebrow">Decoded bank</p>
              <h2>{fileName || 'Decoded bank'}</h2>
            {/if}
          </div>
          <button
            class="render-toggle"
            class:active={renderPreview}
            disabled={!selectedQuestion}
            onclick={() => (renderPreview = !renderPreview)}
          >
            {renderPreview ? 'Hide Typst Preview' : 'Render Typst Preview'}
          </button>
        </div>

        {#if selectedQuestion}
          <article>
            {#if renderPreview}
              <section class="rendered-preview" aria-live="polite">
                <div class="rendered-preview-header">
                  <h3>Rendered Typst Preview</h3>
                  {#if renderBusy}
                    <small>Rendering...</small>
                  {/if}
                </div>

                {#if renderError}
                  <div class="notice error">
                    <strong>Typst render failed.</strong>
                    <span>{renderError}</span>
                  </div>
                  <details>
                    <summary>Generated Typst source</summary>
                    <pre class="typst-source">{selectedQuestionTypst}</pre>
                  </details>
                {:else if renderedTypstSvg}
                  <div class="rendered-page">
                    {@html renderedTypstSvg}
                  </div>
                {:else}
                  <div class="render-placeholder">Preparing Typst renderer...</div>
                {/if}
              </section>
            {/if}

            {#if selectedQuestion.narrative}
              <div class="notice">
                <strong>Narrative</strong>
                <span>{selectedQuestion.narrative.text}</span>
              </div>
            {/if}

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

            {#if selectedQuestion.inlineObjects?.length}
              <h3>Inline Objects</h3>
              <div class="variable-list inline-object-list">
                {#each selectedQuestion.inlineObjects as object}
                  <div>
                    <strong>{object.id} · {object.kind}</strong>
                    <span>{object.placeholder}</span>
                    <small>{object.context}</small>
                  </div>
                {/each}
              </div>
            {/if}

            {#if selectedQuestion.algorithmicVariables?.length}
              <h3>Algorithmic Variables</h3>
              <div class="variable-list">
                {#each selectedQuestion.algorithmicVariables as variable}
                  <div>
                    <strong>{variable.name}</strong>
                    <span>{variable.rule ?? 'unknown rule'}</span>
                    {#if variable.sampleValue}
                      <small>sample: {variable.sampleValue}</small>
                    {/if}
                  </div>
                {/each}
              </div>
            {/if}

            {#if selectedQuestion.graphDefinitions?.length}
              <h3>Graph Definitions</h3>
              <div class="variable-list">
                {#each selectedQuestion.graphDefinitions as graph}
                  <div>
                    <strong>{graph.id}</strong>
                    {#if graphHasSamples(graph)}
                      {@const bounds = graphBounds(graph)}
                      <svg class="graph-preview" viewBox={`0 0 ${graphWidth} ${graphHeight}`} role="img" aria-label={`Preview of ${graph.id}`}>
                        <rect x="0" y="0" width={graphWidth} height={graphHeight} />
                        <line class="graph-axis" x1="0" x2={graphWidth} y1={graphY(0, bounds)} y2={graphY(0, bounds)} />
                        <line class="graph-axis" y1="0" y2={graphHeight} x1={graphX(0, bounds)} x2={graphX(0, bounds)} />
                        {#each graph.normalizedExpressions ?? [] as expression, expressionIndex}
                          {#each graphSegments(expression.samplePoints ?? []) as segment}
                            <polyline
                              points={graphPolyline(segment, bounds)}
                              stroke={graphColor(expressionIndex)}
                            />
                          {/each}
                        {/each}
                      </svg>
                    {/if}
                    <span>
                      {(graph.normalizedExpressions ?? []).length
                        ? graph.normalizedExpressions?.map((expression) => {
                            const count = expression.samplePoints?.length ?? 0;
                            return count ? `${expression.substituted} (${count} sampled points)` : expression.substituted;
                          }).join(', ')
                        : graph.expressions.join(', ')}
                    </span>
                    {#if graph.variables && Object.keys(graph.variables).length}
                      <small>
                        variables: {Object.entries(graph.variables).map(([name, value]) => `${name}=${value}`).join(', ')}
                      </small>
                    {/if}
                    <small>{graph.source}</small>
                  </div>
                {/each}
              </div>
            {/if}

            {#if selectedQuestion.raw?.length}
              <h3>Preserved Raw Fragment</h3>
              <pre>{selectedQuestion.raw[0].hexPreview}</pre>
            {/if}
          </article>
        {:else}
          <div class="empty">
            <strong>No decoded questions yet.</strong>
            <span>The parser preserved diagnostics for follow-up work.</span>
          </div>
        {/if}
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

<div class="version-badge">v{__APP_VERSION__} <span class="build">#{__BUILD_HASH__}</span></div>

<style>
  .shell {
    height: 100vh;
    overflow: hidden;
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
    height: calc(100vh - 8.4rem);
    padding-top: 1rem;
  }

  .sidebar,
  .preview,
  .diagnostics {
    min-height: 0;
    border: 1px solid var(--line);
    border-radius: 8px;
    background: var(--paper);
  }

  .sidebar,
  .diagnostics {
    padding: 1rem;
  }

  .sidebar {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .preview,
  .diagnostics {
    overflow: auto;
    overscroll-behavior: contain;
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

  .bank-library {
    display: grid;
    gap: 0.6rem;
    margin-top: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--line);
  }

  .bank-library-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.5rem;
  }

  .bank-list {
    display: grid;
    gap: 0.45rem;
    max-height: 13rem;
    overflow-y: auto;
    padding-right: 0.2rem;
  }

  .bank-item {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 0.45rem;
    align-items: stretch;
  }

  .bank-item.active .bank-select {
    border-color: var(--accent);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent) 18%, transparent);
  }

  .bank-select {
    display: grid;
    gap: 0.15rem;
    justify-items: start;
    text-align: left;
    min-width: 0;
  }

  .bank-select span {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .bank-delete {
    padding-inline: 0.7rem;
    color: var(--danger);
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
    flex: 0 0 auto;
  }

  .question-list {
    display: grid;
    align-content: start;
    flex: 1 1 auto;
    gap: 0.45rem;
    margin-top: 1rem;
    min-height: 0;
    overflow-y: auto;
    padding-right: 0.25rem;
    overscroll-behavior: contain;
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
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .preview-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    border-bottom: 1px solid var(--line);
  }

  .render-toggle.active {
    background: var(--ink);
    border-color: var(--ink);
    color: var(--paper);
  }

  article {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
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

  .variable-list {
    display: grid;
    gap: 0.5rem;
  }

  .variable-list div {
    display: grid;
    gap: 0.15rem;
    padding: 0.65rem;
    border: 1px solid var(--line);
    border-radius: 7px;
    background: #f8f6ef;
  }

  .variable-list span {
    overflow-wrap: anywhere;
  }

  .inline-object-list strong {
    color: #8a3f19;
  }

  .graph-preview {
    width: min(100%, 420px);
    height: auto;
    border: 1px solid var(--line);
    border-radius: 7px;
    background: #fffdf7;
  }

  .graph-preview rect {
    fill: #fffdf7;
  }

  .graph-preview .graph-axis {
    stroke: #c8bfa8;
    stroke-width: 1;
  }

  .graph-preview polyline {
    fill: none;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .rendered-preview {
    display: grid;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .rendered-preview-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .rendered-preview h3 {
    margin: 0;
  }

  .rendered-page {
    max-height: 72vh;
    overflow: auto;
    padding: 0.75rem;
    border: 1px solid var(--line);
    border-radius: 9px;
    background: #ebe3ce;
  }

  .rendered-page :global(svg) {
    display: block;
    width: min(100%, 6.4in);
    max-width: 100%;
    height: auto;
    margin: 0 auto;
    border-radius: 5px;
    box-shadow: 0 8px 28px rgb(54 44 24 / 14%);
    background: white;
  }

  .render-placeholder {
    padding: 1rem;
    border: 1px dashed var(--line);
    border-radius: 8px;
    color: var(--muted);
    background: #f8f6ef;
  }

  .typst-source {
    margin-top: 0.6rem;
    font-size: 0.82rem;
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
    .shell {
      height: auto;
      overflow: visible;
    }

    .workspace {
      grid-template-columns: 1fr;
      height: auto;
    }

    .sidebar,
    .preview,
    .diagnostics {
      height: auto;
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

  .version-badge {
    position: fixed;
    bottom: 0.5rem;
    left: 0.75rem;
    font-size: 0.7rem;
    color: #999;
    background: var(--paper, #fff);
    padding: 0.1rem 0.35rem;
    border-radius: 4px;
    pointer-events: none;
    user-select: none;
  }

  .version-badge .build {
    opacity: 0.6;
  }
</style>
