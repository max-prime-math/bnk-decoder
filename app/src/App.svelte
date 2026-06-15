<script lang="ts">
  import {
    decodeBnkFile,
    toLatex,
    toPortableJson,
    toPortableQuestionPackage,
    toTestGeneratorCustomClasses,
    toTestGeneratorQuestions,
    toTypst,
    type DecodeResult,
    type DecodedGraphDefinition,
    type GraphSamplePoint,
    type TestGeneratorCurriculumOptions,
  } from '@bnk-decoder/core';
  import { questionToTypstDocument, renderQuestionTypstSvg } from './typstPreview';
  import {
    deleteStoredBank,
    getStoredBank,
    listStoredBanks,
    putStoredBank,
    type BankCurriculumMetadata,
    type StoredBankRecord,
  } from './bankStore';

  type StoredBankSummary = Omit<StoredBankRecord, 'bytes'>;
  type BankCurriculumForm = {
    className: string;
    unitName: string;
    sectionName: string;
  };
  type CurriculumField = keyof BankCurriculumForm;

  let fileName = $state('');
  let busy = $state(false);
  let error = $state('');
  let result = $state<DecodeResult | null>(null);
  let selectedQuestionId = $state<string | null>(null);
  let selectedBankId = $state<string | null>(null);
  let banks = $state<StoredBankSummary[]>([]);
  let selectedQuestionByBank = $state<Record<string, string | null>>({});
  let questionFilter = $state<'all' | 'algorithmic' | 'graphical' | 'hybrid'>('all');
  let renderPreview = $state(false);
  let renderBusy = $state(false);
  let renderError = $state('');
  let renderedTypstSvg = $state('');
  let bankCurriculum = $state<BankCurriculumForm>(emptyBankCurriculum());

  let filteredQuestions = $derived(
    (result?.questions ?? []).filter((question) => matchesQuestionFilter(question, questionFilter)),
  );
  let selectedQuestion = $derived(
    filteredQuestions.find((question) => question.id === selectedQuestionId) ?? filteredQuestions[0] ?? null,
  );
  let selectedQuestionTypst = $derived(selectedQuestion ? questionToTypstDocument(selectedQuestion) : '');

  $effect(() => {
    const onKeydown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return;

      if ((event.key === 'ArrowDown' || event.key === 'j') && filteredQuestions.length) {
        event.preventDefault();
        selectRelativeQuestion(1);
      } else if ((event.key === 'ArrowUp' || event.key === 'k') && filteredQuestions.length) {
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
    download(
      exportName('pqp.json'),
      JSON.stringify(toPortableQuestionPackage(result, testGeneratorCurriculumOptions()), null, 2),
      'application/json',
    );
  }

  function exportTestGenerator() {
    if (!result) return;
    download(
      exportName('test-generator-import.json'),
      JSON.stringify(toTestGeneratorPackage(result), null, 2),
      'application/json',
    );
  }

  function exportName(ext: string) {
    const base = fileName.replace(/\.[^.]+$/, '') || 'decoded-bank';
    return `${base}.${ext}`;
  }

  function toTestGeneratorPackage(decoded: DecodeResult) {
    const curriculum = testGeneratorCurriculumOptions();
    return {
      format: 'test-generator-question-bank',
      version: 2,
      exportedAt: new Date().toISOString(),
      source: {
        kind: 'bnk',
        label: fileName || decoded.source.filename || 'decoded-bank.bnk',
        originFiles: decoded.source.filename ? [decoded.source.filename] : [],
      },
      producer: {
        app: 'bnk-decoder',
        exportedAt: new Date().toISOString(),
      },
      diagnostics: decoded.diagnostics,
      questions: toTestGeneratorQuestions(decoded, curriculum),
      customClasses: toTestGeneratorCustomClasses(decoded, curriculum),
      images: decoded.assets
        .filter((asset) => asset.kind === 'image')
        .map((asset) => {
          const filename = asset.filename ?? `${asset.id}.${imageExtension(asset.mimeType) || 'bin'}`;
          const { stem, ext } = splitFilename(filename);
          return {
            name: stem || asset.id,
            ext: ext || imageExtension(asset.mimeType),
            mime: asset.mimeType,
            size: asset.bytes.byteLength,
            data: bytesToBase64(asset.bytes),
          };
        })
        .filter((image) => image.name && image.ext && image.data),
    };
  }

  function splitFilename(name: string) {
    const last = name.split(/[/\\]/).pop() ?? name;
    const index = last.lastIndexOf('.');
    if (index <= 0) return { stem: last, ext: '' };
    return { stem: last.slice(0, index), ext: last.slice(index + 1).toLowerCase() };
  }

  function imageExtension(mimeType?: string) {
    switch (mimeType) {
      case 'image/png': return 'png';
      case 'image/jpeg': return 'jpg';
      case 'image/gif': return 'gif';
      case 'image/bmp': return 'bmp';
      case 'image/svg+xml': return 'svg';
      case 'image/webp': return 'webp';
      default: return '';
    }
  }

  function bytesToBase64(bytes: Uint8Array) {
    let binary = '';
    const chunkSize = 8192;
    for (let index = 0; index < bytes.length; index += chunkSize) {
      const chunk = bytes.subarray(index, Math.min(index + chunkSize, bytes.length));
      binary += String.fromCharCode(...chunk);
    }
    return btoa(binary);
  }

  function emptyBankCurriculum(): BankCurriculumForm {
    return {
      className: '',
      unitName: '',
      sectionName: '',
    };
  }

  function normalizeBankCurriculum(curriculum?: BankCurriculumMetadata): BankCurriculumForm {
    return {
      className: curriculum?.className?.trim() ?? '',
      unitName: curriculum?.unitName?.trim() ?? '',
      sectionName: curriculum?.sectionName?.trim() ?? '',
    };
  }

  function inferredBankCurriculum(decoded: DecodeResult): BankCurriculumForm {
    return {
      className: commonMetadataText(decoded.questions.map((question) => question.metadata.className)) ?? '',
      unitName: commonMetadataText(decoded.questions.map((question) => question.metadata.unitName)) ?? '',
      sectionName: commonMetadataText(decoded.questions.map((question) => question.metadata.topic))
        ?? commonMetadataText(decoded.questions.map((question) => question.metadata.sectionName))
        ?? '',
    };
  }

  function commonMetadataText(values: Array<string | undefined>): string | undefined {
    const normalized = values
      .map((value) => value?.replace(/\s+/g, ' ').trim())
      .filter((value): value is string => Boolean(value));
    const unique = [...new Set(normalized.map((value) => value.toLowerCase()))];
    return unique.length === 1 ? normalized[0] : undefined;
  }

  function testGeneratorCurriculumOptions(): TestGeneratorCurriculumOptions {
    const curriculum: TestGeneratorCurriculumOptions = {};
    const className = bankCurriculum.className.trim();
    const unitName = bankCurriculum.unitName.trim();
    const sectionName = bankCurriculum.sectionName.trim();
    if (className) curriculum.className = className;
    if (unitName) curriculum.unitName = unitName;
    if (sectionName) curriculum.sectionName = sectionName;
    return curriculum;
  }

  function updateBankCurriculum(field: CurriculumField, value: string) {
    const next = {
      ...bankCurriculum,
      [field]: value,
    };
    bankCurriculum = next;
    void persistBankCurriculum(next);
  }

  async function persistBankCurriculum(curriculum: BankCurriculumForm) {
    if (!selectedBankId) return;
    const bank = await getStoredBank(selectedBankId);
    if (!bank) return;
    await putStoredBank({
      ...bank,
      curriculum,
    });
    banks = banks.map((item) => (
      item.id === bank.id
        ? { ...item, curriculum }
        : item
    ));
  }

  function selectRelativeQuestion(delta: number) {
    if (!filteredQuestions.length) return;
    const currentIndex = Math.max(
      0,
      filteredQuestions.findIndex((question) => question.id === selectedQuestion?.id),
    );
    const nextIndex = (currentIndex + delta + filteredQuestions.length) % filteredQuestions.length;
    const nextId = filteredQuestions[nextIndex].id;
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
  type GraphSeriesStyle = {
    strokeWidth: number;
    dashArray?: string;
    pointRadius?: number;
  };
  const graphWidth = 260;
  const graphHeight = 160;
  const graphColors = ['#b54a2f', '#276f7a', '#7761a7', '#6f7c2d', '#a4527c'];

  function graphHasSamples(graph: DecodedGraphDefinition) {
    return Boolean(graph.normalizedExpressions?.some((expression) => expression.samplePoints?.length));
  }

  function graphBounds(graph: DecodedGraphDefinition): GraphBounds {
    const points = graph.normalizedExpressions?.flatMap((expression) => expression.samplePoints ?? []) ?? [];
    return computeGraphBounds(points);
  }

  function graphX(x: number, bounds: GraphBounds) {
    return ((x - bounds.minX) / (bounds.maxX - bounds.minX)) * graphWidth;
  }

  function graphY(y: number, bounds: GraphBounds) {
    return graphHeight - ((y - bounds.minY) / (bounds.maxY - bounds.minY)) * graphHeight;
  }

  function graphSegments(points: GraphSamplePoint[], bounds?: GraphBounds) {
    const segments: GraphSamplePoint[][] = [];
    let current: GraphSamplePoint[] = [];
    const spanY = bounds ? Math.max(1, bounds.maxY - bounds.minY) : 12;
    const jumpThreshold = Math.max(8, spanY * 0.65);
    for (const point of points) {
      if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) {
        if (current.length > 1) segments.push(current);
        current = [];
        continue;
      }
      const previous = current.at(-1);
      if (
        previous
        && (
          Math.abs(point.x - previous.x) > 0.51
          || Math.abs(point.y - previous.y) > jumpThreshold
        )
      ) {
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

  function hasAlgorithmData(question: NonNullable<DecodeResult['questions']>[number]) {
    return Boolean(
      question.algorithmicVariables?.length
      || question.algorithmModel?.definitions.length
      || question.algorithmEvaluation?.entries.length,
    );
  }

  function hasGraphData(question: NonNullable<DecodeResult['questions']>[number]) {
    return Boolean(
      question.graphDefinitions?.length
      || question.graphModel?.objects.length
      || question.graphTypst?.text.trim(),
    );
  }

  function hasNarrativeData(question: NonNullable<DecodeResult['questions']>[number]) {
    return Boolean(question.narrative?.text.trim());
  }

  function questionFeatureLabels(question: NonNullable<DecodeResult['questions']>[number]) {
    return [
      ...(hasNarrativeData(question) ? ['narrative'] : []),
      ...(hasAlgorithmData(question) ? ['algorithm'] : []),
      ...(hasGraphData(question) ? ['graph'] : []),
    ];
  }

  function matchesQuestionFilter(
    question: NonNullable<DecodeResult['questions']>[number],
    filter: typeof questionFilter,
  ) {
    if (filter === 'algorithmic') return hasAlgorithmData(question);
    if (filter === 'graphical') return hasGraphData(question);
    if (filter === 'hybrid') return hasAlgorithmData(question) || hasGraphData(question);
    return true;
  }

  function questionCountForFilter(filter: typeof questionFilter) {
    return (result?.questions ?? []).filter((question) => matchesQuestionFilter(question, filter)).length;
  }

  function algorithmDefinitionCount(question: NonNullable<DecodeResult['questions']>[number]) {
    return question.algorithmModel?.definitions.length ?? 0;
  }

  function algorithmResolvedCount(question: NonNullable<DecodeResult['questions']>[number]) {
    return question.algorithmEvaluation?.entries.filter((entry) => entry.status === 'resolved').length ?? 0;
  }

  function algorithmSequenceCount(question: NonNullable<DecodeResult['questions']>[number]) {
    return question.algorithmModel?.sequence.length ?? 0;
  }

  function graphObjectCount(question: NonNullable<DecodeResult['questions']>[number]) {
    return question.graphModel?.objects.length ?? question.graphDefinitions?.length ?? 0;
  }

  function graphVariableCount(question: NonNullable<DecodeResult['questions']>[number]) {
    return question.graphModel?.variables ? Object.keys(question.graphModel.variables).length : 0;
  }

  function graphExpressionSummary(question: NonNullable<DecodeResult['questions']>[number]) {
    const expressions = question.graphModel?.rawExpressions?.length
      ? question.graphModel.rawExpressions
      : question.graphDefinitions?.flatMap((graph) => graph.expressions) ?? [];
    return expressions.slice(0, 3).join(', ');
  }

  type GraphSeries = {
    id: string;
    label: string;
    color: string;
    kind: string;
    style: GraphSeriesStyle;
    points: GraphSamplePoint[];
  };

  function graphSeries(question: NonNullable<DecodeResult['questions']>[number]): GraphSeries[] {
    const series: GraphSeries[] = [];
    let colorIndex = 0;
    const objectKinds = question.graphModel?.objects.map((object) => object.kind) ?? [];
    for (const graph of question.graphDefinitions ?? []) {
      const expressions = graph.normalizedExpressions ?? [];
      expressions.forEach((expression, expressionIndex) => {
        const points = expression.samplePoints ?? [];
        if (points.length < 2) return;
        const kind = objectKinds[series.length] ?? 'unknown';
        series.push({
          id: `${graph.id}-${expressionIndex + 1}`,
          label: expression.substituted || expression.original || graph.id,
          color: graphColor(colorIndex++),
          kind,
          style: graphSeriesStyle(kind),
          points,
        });
      });
    }
    return series;
  }

  function graphOverviewBounds(question: NonNullable<DecodeResult['questions']>[number]): GraphBounds | null {
    const points = graphSeries(question).flatMap((series) => series.points);
    if (!points.length) return null;
    return computeGraphBounds(points);
  }

  function computeGraphBounds(points: GraphSamplePoint[]): GraphBounds {
    const finite = points.filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y));
    if (!finite.length) {
      return { minX: -1, maxX: 1, minY: -1, maxY: 1 };
    }

    const xs = finite.map((point) => point.x).sort((a, b) => a - b);
    const ys = finite.map((point) => point.y).sort((a, b) => a - b);
    const yTrimCount = ys.length >= 12 ? Math.floor(ys.length * 0.08) : 0;
    const trimmedYs = ys.slice(yTrimCount, ys.length - yTrimCount || ys.length);

    const minX = Math.min(-1, 0, xs[0]);
    const maxX = Math.max(1, 0, xs[xs.length - 1]);
    const minY = Math.min(-1, 0, trimmedYs[0] ?? ys[0]);
    const maxY = Math.max(1, 0, trimmedYs[trimmedYs.length - 1] ?? ys[ys.length - 1]);
    const xPadding = Math.max(1, (maxX - minX) * 0.08);
    const yPadding = Math.max(1, (maxY - minY) * 0.08);

    return {
      minX: minX - xPadding,
      maxX: maxX + xPadding,
      minY: minY - yPadding,
      maxY: maxY + yPadding,
    };
  }

  function graphSeriesStyle(kind: string): GraphSeriesStyle {
    if (kind === 'relation') return { strokeWidth: 2.2, dashArray: '7 4' };
    if (kind === 'point') return { strokeWidth: 1.6, pointRadius: 3.8 };
    if (kind === 'text') return { strokeWidth: 1.4, dashArray: '2 4' };
    return { strokeWidth: 2.4 };
  }

  function graphSupportSummary(question: NonNullable<DecodeResult['questions']>[number]) {
    const items: Array<{ label: string; detail: string; tone: SupportTone }> = [];
    const objectCount = graphObjectCount(question);
    const variableCount = graphVariableCount(question);
    const sampledSeries = graphSeries(question).length;

    if (sampledSeries > 0) {
      items.push({
        label: 'Sampled preview ready',
        detail: `${sampledSeries} sampled expression${sampledSeries === 1 ? '' : 's'} rendered in the overview pane.`,
        tone: 'good',
      });
    }

    if (objectCount > 0) {
      items.push({
        label: 'Recovered graph structure',
        detail: `${objectCount} graph object${objectCount === 1 ? '' : 's'} preserved in the structured model.`,
        tone: 'good',
      });
    }

    if (variableCount > 0) {
      items.push({
        label: 'Graph variables linked',
        detail: `${variableCount} variable${variableCount === 1 ? '' : 's'} available for graph expressions or labels.`,
        tone: 'info',
      });
    }

    if (question.graphTypst?.text.trim()) {
      items.push({
        label: 'Typst snapshot present',
        detail: 'A Typst graph snapshot was generated and can be inspected directly in the GUI.',
        tone: 'info',
      });
    }

    if (!sampledSeries && hasGraphData(question)) {
      items.push({
        label: 'Partial graph recovery',
        detail: 'Graph structure is present, but there were not enough sampled points for an overlaid visual preview yet.',
        tone: 'warn',
      });
    }

    return items;
  }

  function hasGraphOverview(question: NonNullable<DecodeResult['questions']>[number]) {
    return graphSeries(question).length > 0 && graphOverviewBounds(question) !== null;
  }

  function resolvedAlgorithmPairs(question: NonNullable<DecodeResult['questions']>[number]) {
    const values = new Map<string, string>();

    for (const entry of question.algorithmEvaluation?.entries ?? []) {
      if (entry.status === 'resolved' && entry.name && entry.value) {
        values.set(entry.name, entry.value);
      }
    }

    for (const definition of question.algorithmModel?.definitions ?? []) {
      if (!values.has(definition.name) && definition.name && definition.sampleValue) {
        values.set(definition.name, definition.sampleValue);
      }
    }

    return [...values.entries()]
      .filter(([name, value]) => /^[A-Za-z_][A-Za-z0-9_]*$/.test(name) && value.trim().length > 0)
      .sort((a, b) => b[0].length - a[0].length);
  }

  function escapeRegex(text: string) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function materializeAlgorithmText(text: string, question: NonNullable<DecodeResult['questions']>[number]) {
    let output = text;
    for (const [name, value] of resolvedAlgorithmPairs(question)) {
      output = output.replace(
        new RegExp(`(?<![A-Za-z0-9_])${escapeRegex(name)}(?![A-Za-z0-9_])`, 'g'),
        value,
      );
    }
    return output;
  }

  function algorithmMaterializationSections(question: NonNullable<DecodeResult['questions']>[number]) {
    const sections: Array<{ label: string; text: string }> = [];
    const body = materializeAlgorithmText(question.body.text, question);
    if (body.trim()) sections.push({ label: 'Body', text: body });

    for (const choice of question.choices ?? []) {
      const text = materializeAlgorithmText(choice.body.text, question).trim();
      if (text) sections.push({ label: `Choice ${choice.id}`, text });
    }

    if (question.solution?.text.trim()) {
      sections.push({
        label: 'Solution',
        text: materializeAlgorithmText(question.solution.text, question),
      });
    }

    return sections;
  }

  type SupportTone = 'good' | 'info' | 'warn';

  function algorithmSupportSummary(question: NonNullable<DecodeResult['questions']>[number]) {
    const items: Array<{ label: string; detail: string; tone: SupportTone }> = [];
    const scope = question.algorithmModel?.scope.kind;
    if (scope === 'question') {
      items.push({ label: 'Question scope', detail: 'Recovered from the local question pre-display block.', tone: 'good' });
    } else if (scope === 'matching-group') {
      items.push({ label: 'Matching-group scope', detail: 'Recovered from the shared matching prelude. This path is first-pass but binary-backed.', tone: 'info' });
    } else if (scope === 'narrative') {
      items.push({ label: 'Narrative scope', detail: 'Narrative algorithm scope is modeled, but not yet broadly evidenced in the local corpus.', tone: 'warn' });
    }

    const unresolved = question.algorithmEvaluation?.entries.filter((entry) => entry.status === 'unresolved').length ?? 0;
    if (unresolved > 0) {
      items.push({ label: 'Unresolved values', detail: `${unresolved} sample value${unresolved === 1 ? '' : 's'} could not be resolved.`, tone: 'warn' });
    } else if (algorithmResolvedCount(question) > 0) {
      items.push({ label: 'Sample values ready', detail: `${algorithmResolvedCount(question)} resolved value${algorithmResolvedCount(question) === 1 ? '' : 's'} available for inspection.`, tone: 'good' });
    }

    const unknownDefinitions = question.algorithmModel?.definitions.filter((definition) => definition.kind === 'unknown').length ?? 0;
    if (unknownDefinitions > 0 || question.decodeDiagnostics?.some((diagnostic) => diagnostic.code === 'ALGORITHM_SUPPORT_TOKEN')) {
      items.push({ label: 'Opaque support tokens', detail: 'Some recovered algorithm tokens are preserved but not fully interpreted yet.', tone: 'warn' });
    }

    const userFunctions = question.algorithmModel?.definitions.filter((definition) => definition.kind === 'user-function').length ?? 0;
    if (userFunctions > 0) {
      items.push({ label: 'User-defined functions', detail: `${userFunctions} function-style definition${userFunctions === 1 ? '' : 's'} recovered; full execution is not implemented yet.`, tone: 'warn' });
    }

    if (algorithmSequenceCount(question) > 0) {
      items.push({ label: 'Raw sequence preserved', detail: `${algorithmSequenceCount(question)} ordered pre-display token${algorithmSequenceCount(question) === 1 ? '' : 's'} preserved for debugging.`, tone: 'info' });
    }

    if (!items.length && hasAlgorithmData(question)) {
      items.push({ label: 'Algorithm data present', detail: 'Recovered algorithm artifacts are available, but this question has little evaluable structure yet.', tone: 'info' });
    }

    return items;
  }

  function algorithmStatusTone(status: 'resolved' | 'unresolved') {
    return status === 'resolved' ? 'good' : 'muted';
  }

  function diagnosticTone(level: 'info' | 'warning' | 'error') {
    if (level === 'error') return 'error';
    if (level === 'warning') return 'warn';
    return 'info';
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
      bankCurriculum = emptyBankCurriculum();
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
      bankCurriculum = bank.curriculum
        ? normalizeBankCurriculum(bank.curriculum)
        : inferredBankCurriculum(decoded);
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
      bankCurriculum = emptyBankCurriculum();
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

        <div class="curriculum-editor">
          <div class="curriculum-editor-header">
            <strong>Test Generator curriculum</strong>
            <small>Export fields</small>
          </div>
          <label>
            <span>Class</span>
            <input
              value={bankCurriculum.className}
              placeholder="Grade 12 Pre-Calculus"
              oninput={(event) => updateBankCurriculum('className', event.currentTarget.value)}
            />
          </label>
          <label>
            <span>Unit</span>
            <input
              value={bankCurriculum.unitName}
              placeholder="Unit 1: Functions"
              oninput={(event) => updateBankCurriculum('unitName', event.currentTarget.value)}
            />
          </label>
          <label>
            <span>Section</span>
            <input
              value={bankCurriculum.sectionName}
              placeholder="Section 1.1: Transformations"
              oninput={(event) => updateBankCurriculum('sectionName', event.currentTarget.value)}
            />
          </label>
        </div>

        <div class="filters">
          <div class="filters-header">
            <strong>Question filter</strong>
            <small>{filteredQuestions.length} shown</small>
          </div>
          <div class="filter-grid">
            <button class:active={questionFilter === 'all'} onclick={() => (questionFilter = 'all')}>
              All
              <small>{questionCountForFilter('all')}</small>
            </button>
            <button class:active={questionFilter === 'algorithmic'} onclick={() => (questionFilter = 'algorithmic')}>
              Algorithm
              <small>{questionCountForFilter('algorithmic')}</small>
            </button>
            <button class:active={questionFilter === 'graphical'} onclick={() => (questionFilter = 'graphical')}>
              Graph
              <small>{questionCountForFilter('graphical')}</small>
            </button>
            <button class:active={questionFilter === 'hybrid'} onclick={() => (questionFilter = 'hybrid')}>
              Either
              <small>{questionCountForFilter('hybrid')}</small>
            </button>
          </div>
        </div>

        <div class="actions">
          <button class="primary" onclick={exportLatex}>Export LaTeX</button>
          <button onclick={exportTypst}>Export Typst</button>
          <button onclick={exportJson}>Export JSON</button>
          <button onclick={exportPqp}>Export PQP</button>
          <button onclick={exportTestGenerator}>Export for test-generator</button>
        </div>

        <div class="question-list" aria-label="Decoded questions">
          {#if filteredQuestions.length}
            {#each filteredQuestions as question, index}
              <button
                id={`question-${question.id}`}
                class:active={selectedQuestion?.id === question.id}
                onclick={() => {
                  selectedQuestionId = question.id;
                  if (selectedBankId) selectedQuestionByBank = { ...selectedQuestionByBank, [selectedBankId]: question.id };
                }}
              >
                <span>
                  Question {index + 1}
                  {#if questionFeatureLabels(question).length}
                    <small class="feature-line">{questionFeatureLabels(question).join(' · ')}</small>
                  {/if}
                </span>
                <small>{question.type} · {question.confidence}</small>
              </button>
            {/each}
          {:else}
            <button
              disabled
              class="empty-filter"
            >
              <span>No questions match this filter.</span>
            </button>
          {/if}
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
              {#if questionFeatureLabels(selectedQuestion).length}
                <div class="feature-chips">
                  {#each questionFeatureLabels(selectedQuestion) as label}
                    <span class="feature-chip">{label}</span>
                  {/each}
                </div>
              {/if}
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

            {#if hasAlgorithmData(selectedQuestion) || hasGraphData(selectedQuestion)}
              <section class="insight-grid">
                {#if hasAlgorithmData(selectedQuestion)}
                  <section class="insight-pane">
                    <div class="pane-header">
                      <div>
                        <p class="pane-eyebrow">Algorithm</p>
                        <h3>Algorithm Pane</h3>
                      </div>
                      <div class="metric-row">
                        <div class="metric-card">
                          <span>Scope</span>
                          <strong>{selectedQuestion.algorithmModel?.scope.kind ?? 'question'}</strong>
                        </div>
                        <div class="metric-card">
                          <span>Defs</span>
                          <strong>{algorithmDefinitionCount(selectedQuestion)}</strong>
                        </div>
                        <div class="metric-card">
                          <span>Resolved</span>
                          <strong>{algorithmResolvedCount(selectedQuestion)}</strong>
                        </div>
                        <div class="metric-card">
                          <span>Raw Seq</span>
                          <strong>{algorithmSequenceCount(selectedQuestion)}</strong>
                        </div>
                      </div>
                    </div>

                    {#if selectedQuestion.algorithmModel?.definitions.length}
                      <div class="structured-table">
                        <div class="structured-head">
                          <span>Name</span>
                          <span>Kind</span>
                          <span>Rule</span>
                          <span>Sample</span>
                        </div>
                        {#each selectedQuestion.algorithmModel.definitions as definition}
                          <div class="structured-row">
                            <strong>{definition.name}</strong>
                            <span>{definition.kind}</span>
                            <code>{definition.rawExpression ?? '—'}</code>
                            <span>{definition.sampleValue ?? '—'}</span>
                          </div>
                        {/each}
                      </div>
                    {/if}

                    {#if selectedQuestion.algorithmEvaluation?.entries.length}
                      <div class="status-strip">
                        {#each selectedQuestion.algorithmEvaluation.entries as entry}
                          <div class={`status-pill ${algorithmStatusTone(entry.status)}`}>
                            <strong>{entry.name}</strong>
                            <span>{entry.value ?? entry.status}</span>
                          </div>
                        {/each}
                      </div>
                    {/if}

                    {#if algorithmSupportSummary(selectedQuestion).length}
                      <div class="support-list">
                        {#each algorithmSupportSummary(selectedQuestion) as item}
                          <div class={`support-card ${item.tone}`}>
                            <strong>{item.label}</strong>
                            <span>{item.detail}</span>
                          </div>
                        {/each}
                      </div>
                    {/if}

                    {#if algorithmMaterializationSections(selectedQuestion).length}
                      <details class="pane-details" open>
                        <summary>Sample materialization</summary>
                        <div class="materialization-list">
                          {#each algorithmMaterializationSections(selectedQuestion) as section}
                            <div class="materialization-card">
                              <strong>{section.label}</strong>
                              <pre>{section.text}</pre>
                            </div>
                          {/each}
                        </div>
                      </details>
                    {/if}

                    {#if selectedQuestion.algorithmModel?.sequence.length}
                      <details class="pane-details">
                        <summary>Raw sequence</summary>
                        <div class="sequence-list">
                          {#each selectedQuestion.algorithmModel.sequence as entry}
                            <div class="sequence-item">
                              <strong>{entry.order}</strong>
                              <span>{entry.kind}</span>
                              <code>{entry.text}</code>
                              <small>{entry.definitionName ?? entry.ownerKind}</small>
                            </div>
                          {/each}
                        </div>
                      </details>
                    {/if}
                  </section>
                {/if}

                {#if hasGraphData(selectedQuestion)}
                  <section class="insight-pane">
                    <div class="pane-header">
                      <div>
                        <p class="pane-eyebrow">Graph</p>
                        <h3>Graph Pane</h3>
                      </div>
                      <div class="metric-row">
                        <div class="metric-card">
                          <span>Family</span>
                          <strong>{selectedQuestion.graphModel?.family ?? 'unknown'}</strong>
                        </div>
                        <div class="metric-card">
                          <span>Objects</span>
                          <strong>{graphObjectCount(selectedQuestion)}</strong>
                        </div>
                        <div class="metric-card">
                          <span>Vars</span>
                          <strong>{graphVariableCount(selectedQuestion)}</strong>
                        </div>
                      </div>
                    </div>

                    {#if hasGraphOverview(selectedQuestion)}
                      <div class="overview-graph-card">
                        <div class="graph-card-header">
                          <strong>Overview</strong>
                          <small>{graphSeries(selectedQuestion).length} sampled layer{graphSeries(selectedQuestion).length === 1 ? '' : 's'}</small>
                        </div>
                        <svg class="graph-overview" viewBox={`0 0 ${graphWidth} ${graphHeight}`} role="img" aria-label="Combined graph overview">
                          <rect x="0" y="0" width={graphWidth} height={graphHeight} />
                          <line class="graph-axis" x1="0" x2={graphWidth} y1={graphY(0, graphOverviewBounds(selectedQuestion)!)} y2={graphY(0, graphOverviewBounds(selectedQuestion)!)} />
                          <line class="graph-axis" y1="0" y2={graphHeight} x1={graphX(0, graphOverviewBounds(selectedQuestion)!)} x2={graphX(0, graphOverviewBounds(selectedQuestion)!)} />
                          {#each graphSeries(selectedQuestion) as series}
                            {#each graphSegments(series.points, graphOverviewBounds(selectedQuestion)!) as segment}
                              <polyline
                                points={graphPolyline(segment, graphOverviewBounds(selectedQuestion)!)}
                                stroke={series.color}
                                stroke-width={series.style.strokeWidth}
                                stroke-dasharray={series.style.dashArray}
                              />
                            {/each}
                            {#if series.style.pointRadius}
                              {#each series.points as point}
                                <circle
                                  cx={graphX(point.x, graphOverviewBounds(selectedQuestion)!)}
                                  cy={graphY(point.y, graphOverviewBounds(selectedQuestion)!)}
                                  r={series.style.pointRadius}
                                  fill={series.color}
                                />
                              {/each}
                            {/if}
                          {/each}
                        </svg>
                        <div class="graph-legend">
                          {#each graphSeries(selectedQuestion) as series}
                            <div class="legend-item">
                              <span class="legend-swatch" style={`background:${series.color}`}></span>
                              <span>{series.label}</span>
                              <small>{series.kind}</small>
                            </div>
                          {/each}
                        </div>
                      </div>
                    {/if}

                    {#if selectedQuestion.graphDefinitions?.length}
                      <div class="graph-gallery">
                        {#each selectedQuestion.graphDefinitions as graph}
                          <div class="graph-card">
                            <div class="graph-card-header">
                              <strong>{graph.id}</strong>
                              <small>{graph.source}</small>
                            </div>
                            {#if graphHasSamples(graph)}
                              {@const bounds = graphBounds(graph)}
                              <svg class="graph-preview" viewBox={`0 0 ${graphWidth} ${graphHeight}`} role="img" aria-label={`Preview of ${graph.id}`}>
                                <rect x="0" y="0" width={graphWidth} height={graphHeight} />
                                <line class="graph-axis" x1="0" x2={graphWidth} y1={graphY(0, bounds)} y2={graphY(0, bounds)} />
                                <line class="graph-axis" y1="0" y2={graphHeight} x1={graphX(0, bounds)} x2={graphX(0, bounds)} />
                                {#each graph.normalizedExpressions ?? [] as expression, expressionIndex}
                                  {#each graphSegments(expression.samplePoints ?? [], bounds) as segment}
                                    <polyline
                                      points={graphPolyline(segment, bounds)}
                                      stroke={graphColor(expressionIndex)}
                                    />
                                  {/each}
                                {/each}
                              </svg>
                            {/if}
                            <p class="graph-summary">
                              {(graph.normalizedExpressions ?? []).length
                                ? graph.normalizedExpressions?.map((expression) => expression.substituted).join(', ')
                                : graph.expressions.join(', ')}
                            </p>
                          </div>
                        {/each}
                      </div>
                    {/if}

                    {#if selectedQuestion.graphModel?.variables && Object.keys(selectedQuestion.graphModel.variables).length}
                      <div class="status-strip">
                        {#each Object.entries(selectedQuestion.graphModel.variables) as [name, value]}
                          <div class="status-pill info">
                            <strong>{name}</strong>
                            <span>{value}</span>
                          </div>
                        {/each}
                      </div>
                    {/if}

                    {#if graphSupportSummary(selectedQuestion).length}
                      <div class="support-list">
                        {#each graphSupportSummary(selectedQuestion) as item}
                          <div class={`support-card ${item.tone}`}>
                            <strong>{item.label}</strong>
                            <span>{item.detail}</span>
                          </div>
                        {/each}
                      </div>
                    {/if}

                    {#if selectedQuestion.graphModel?.objects.length}
                      <details class="pane-details">
                        <summary>Recovered graph objects</summary>
                        <div class="structured-table">
                          <div class="structured-head structured-head-3">
                            <span>Object</span>
                            <span>Kind</span>
                            <span>Expression</span>
                          </div>
                          {#each selectedQuestion.graphModel.objects as object}
                            <div class="structured-row structured-row-3">
                              <strong>{object.id}</strong>
                              <span>{object.kind}</span>
                              <code>{object.expression ?? object.typstMath ?? '—'}</code>
                            </div>
                          {/each}
                        </div>
                      </details>
                    {/if}

                    {#if selectedQuestion.graphTypst?.text}
                      <details class="pane-details">
                        <summary>Graph Typst snapshot</summary>
                        <pre>{selectedQuestion.graphTypst.text}</pre>
                      </details>
                    {/if}

                    {#if graphExpressionSummary(selectedQuestion)}
                      <div class="pane-note">
                        <strong>Expressions</strong>
                        <span>{graphExpressionSummary(selectedQuestion)}</span>
                      </div>
                    {/if}
                  </section>
                {/if}
              </section>
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

            {#if selectedQuestion.decodeDiagnostics?.length}
              <h3>Decode Diagnostics</h3>
              <div class="diagnostic-list">
                {#each selectedQuestion.decodeDiagnostics as diagnostic}
                  <div class={`diagnostic-card ${diagnosticTone(diagnostic.level)}`}>
                    <strong>{diagnostic.level} · {diagnostic.code}</strong>
                    <span>{diagnostic.message}</span>
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

  .filters {
    display: grid;
    gap: 0.6rem;
    margin-bottom: 1rem;
  }

  .filters-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.5rem;
  }

  .filter-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.45rem;
  }

  .filter-grid button {
    display: grid;
    gap: 0.1rem;
    justify-items: start;
    text-align: left;
  }

  .filter-grid button.active {
    border-color: var(--accent);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent) 18%, transparent);
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

  .curriculum-editor {
    display: grid;
    gap: 0.55rem;
    margin-bottom: 1rem;
    padding: 0.75rem;
    border: 1px solid var(--line);
    border-radius: 7px;
    background: #f8f6ef;
  }

  .curriculum-editor-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.5rem;
  }

  .curriculum-editor label {
    display: grid;
    gap: 0.25rem;
  }

  .curriculum-editor label span {
    color: var(--muted);
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
  }

  .curriculum-editor input {
    width: 100%;
    min-width: 0;
    border: 1px solid var(--line);
    border-radius: 7px;
    background: var(--paper);
    color: var(--ink);
    padding: 0.5rem 0.6rem;
  }

  .curriculum-editor input:focus {
    outline: 2px solid color-mix(in srgb, var(--accent) 35%, transparent);
    border-color: var(--accent);
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

  .question-list button span {
    display: grid;
    gap: 0.15rem;
  }

  .question-list button.active {
    border-color: var(--accent);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent) 18%, transparent);
  }

  .feature-line {
    color: var(--accent-strong);
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .empty-filter {
    opacity: 0.7;
    cursor: default;
  }

  small {
    color: var(--muted);
  }

  .feature-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    margin-top: 0.45rem;
  }

  .feature-chip {
    display: inline-flex;
    align-items: center;
    padding: 0.18rem 0.5rem;
    border-radius: 999px;
    background: color-mix(in srgb, var(--accent) 14%, white);
    color: var(--accent-strong);
    font-size: 0.74rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
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

  .diagnostic-list {
    display: grid;
    gap: 0.5rem;
  }

  .diagnostic-card {
    display: grid;
    gap: 0.15rem;
    padding: 0.65rem;
    border: 1px solid var(--line);
    border-radius: 7px;
  }

  .diagnostic-card.info {
    background: #f8f6ef;
  }

  .diagnostic-card.warn {
    background: #fff6df;
    border-color: #e2c06b;
  }

  .diagnostic-card.error {
    background: #fff0ee;
    border-color: #db8d82;
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

  .insight-grid {
    display: grid;
    gap: 1rem;
    margin: 1rem 0 1.5rem;
  }

  .insight-pane {
    display: grid;
    gap: 0.85rem;
    padding: 0.95rem;
    border: 1px solid var(--line);
    border-radius: 10px;
    background: linear-gradient(180deg, #fffdf8 0%, #f7f3e8 100%);
  }

  .pane-header {
    display: grid;
    gap: 0.7rem;
  }

  .pane-eyebrow {
    color: var(--accent-strong);
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .metric-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(84px, 1fr));
    gap: 0.5rem;
  }

  .metric-card {
    display: grid;
    gap: 0.12rem;
    padding: 0.55rem 0.65rem;
    border: 1px solid var(--line);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.72);
  }

  .metric-card span {
    color: var(--muted);
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .metric-card strong {
    font-size: 0.95rem;
  }

  .structured-table {
    display: grid;
    gap: 0.35rem;
  }

  .structured-head,
  .structured-row {
    display: grid;
    grid-template-columns: minmax(72px, 0.8fr) minmax(72px, 0.7fr) minmax(0, 2fr) minmax(0, 1fr);
    gap: 0.5rem;
    align-items: start;
  }

  .structured-head {
    padding: 0 0.2rem;
    color: var(--muted);
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .structured-row {
    padding: 0.6rem 0.7rem;
    border: 1px solid var(--line);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.82);
  }

  .structured-head-3,
  .structured-row-3 {
    grid-template-columns: minmax(72px, 0.8fr) minmax(72px, 0.7fr) minmax(0, 2.3fr);
  }

  .structured-row code,
  .sequence-item code {
    overflow-wrap: anywhere;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    color: #7c3718;
  }

  .status-strip {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
  }

  .support-list {
    display: grid;
    gap: 0.45rem;
  }

  .support-card {
    display: grid;
    gap: 0.15rem;
    padding: 0.6rem 0.7rem;
    border: 1px solid var(--line);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.78);
  }

  .support-card.good {
    border-color: #86ba8d;
    background: #eef9ef;
  }

  .support-card.info {
    border-color: #c9c0aa;
    background: #faf7ef;
  }

  .support-card.warn {
    border-color: #d8b061;
    background: #fff6df;
  }

  .status-pill {
    display: grid;
    gap: 0.1rem;
    min-width: 110px;
    padding: 0.5rem 0.65rem;
    border-radius: 8px;
    border: 1px solid var(--line);
    background: rgba(255, 255, 255, 0.78);
  }

  .status-pill.good {
    border-color: #86ba8d;
    background: #eef9ef;
  }

  .status-pill.muted,
  .status-pill.info {
    border-color: #c9c0aa;
    background: #faf7ef;
  }

  .sequence-list {
    display: grid;
    gap: 0.35rem;
    margin-top: 0.6rem;
  }

  .sequence-item {
    display: grid;
    grid-template-columns: 36px minmax(90px, 0.8fr) minmax(0, 2fr) minmax(90px, 0.8fr);
    gap: 0.5rem;
    align-items: start;
    padding: 0.55rem 0.65rem;
    border: 1px solid var(--line);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.72);
  }

  .graph-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 0.75rem;
  }

  .overview-graph-card {
    display: grid;
    gap: 0.6rem;
    padding: 0.75rem;
    border: 1px solid var(--line);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.84);
  }

  .graph-overview {
    width: min(100%, 520px);
    height: auto;
    border: 1px solid var(--line);
    border-radius: 8px;
    background: #fffdf7;
  }

  .graph-overview rect {
    fill: #fffdf7;
  }

  .graph-legend {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem 0.7rem;
  }

  .legend-item {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    min-width: 0;
    padding: 0.25rem 0.45rem;
    border-radius: 999px;
    background: #f6f2e8;
    font-size: 0.82rem;
  }

  .legend-item span:last-child {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .legend-swatch {
    width: 0.78rem;
    height: 0.78rem;
    border-radius: 999px;
    box-shadow: inset 0 0 0 1px rgb(0 0 0 / 10%);
    flex: 0 0 auto;
  }

  .graph-card {
    display: grid;
    gap: 0.45rem;
    padding: 0.75rem;
    border: 1px solid var(--line);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.8);
  }

  .graph-card-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.5rem;
  }

  .graph-summary {
    color: var(--ink);
    font-size: 0.92rem;
    line-height: 1.35;
  }

  .pane-details {
    border: 1px solid var(--line);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.64);
    padding: 0.65rem 0.75rem;
  }

  .pane-details summary {
    cursor: pointer;
    font-weight: 600;
  }

  .pane-note {
    display: grid;
    gap: 0.15rem;
    padding: 0.65rem 0.75rem;
    border-left: 3px solid var(--accent);
    background: rgba(255, 255, 255, 0.64);
  }

  .materialization-list {
    display: grid;
    gap: 0.6rem;
    margin-top: 0.6rem;
  }

  .materialization-card {
    display: grid;
    gap: 0.25rem;
  }

  .materialization-card pre {
    margin: 0;
    background: rgba(255, 255, 255, 0.78);
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
