import React, { useState, useEffect, useMemo } from 'react';
import {
  DictionaryMode,
  SpellingIssue,
  loadBilingualDictionaries,
  areDictionariesLoaded,
  checkTextSpelling,
  applySpellingCorrection,
  autoCorrectAllIssues,
  addWordToCustomDictionary,
} from '../utils/bilingualDictionary';
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Plus,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react';

interface SpellcheckAssistantBarProps {
  text: string;
  onChangeText: (updated: string) => void;
  mode: DictionaryMode;
  onChangeMode?: (mode: DictionaryMode) => void;
  showModeSelector?: boolean;
  label?: string;
  theme?: 'dark' | 'light';
  defaultShowHighlighted?: boolean;
}

export const SpellcheckAssistantBar: React.FC<SpellcheckAssistantBarProps> = ({
  text,
  onChangeText,
  mode,
  onChangeMode,
  showModeSelector = true,
  label = 'Diccionario EN / ES',
  theme = 'dark',
  defaultShowHighlighted = false,
}) => {
  const [dictReady, setDictReady] = useState<boolean>(areDictionariesLoaded());
  const [dictError, setDictError] = useState<string | null>(null);
  const [customDictVersion, setCustomDictVersion] = useState(0);
  const [showHighlighted, setShowHighlighted] = useState(defaultShowHighlighted);
  const [activeIssueId, setActiveIssueId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    if (!areDictionariesLoaded()) {
      loadBilingualDictionaries()
        .then(() => {
          if (mounted) {
            setDictReady(true);
            setDictError(null);
          }
        })
        .catch((err) => {
          if (mounted) {
            setDictError(
              err instanceof Error ? err.message : 'Error cargando diccionario'
            );
          }
        });
    }
    return () => {
      mounted = false;
    };
  }, []);

  const issues: SpellingIssue[] = useMemo(() => {
    if (!dictReady || !text.trim()) return [];
    return checkTextSpelling(text, mode);
    // customDictVersion triggers re-check immediately when adding words
  }, [text, mode, dictReady, customDictVersion]);

  const handleReplaceIssue = (issue: SpellingIssue, replacement: string) => {
    const updated = applySpellingCorrection(
      text,
      issue.start,
      issue.end,
      replacement
    );
    onChangeText(updated);
    setActiveIssueId(null);
  };

  const handleAddToDictionary = (word: string) => {
    addWordToCustomDictionary(word);
    setCustomDictVersion((v) => v + 1);
    setActiveIssueId(null);
  };

  const handleAutoCorrectAll = () => {
    const { correctedText } = autoCorrectAllIssues(text, mode);
    if (correctedText !== text) {
      onChangeText(correctedText);
      setActiveIssueId(null);
    }
  };

  // Build highlighted segments for interactive underlined view
  const highlightedSegments = useMemo(() => {
    if (!showHighlighted || issues.length === 0) return null;

    const segments: Array<
      | { type: 'text'; content: string; key: string }
      | { type: 'issue'; issue: SpellingIssue; key: string }
    > = [];

    let cursor = 0;
    issues.forEach((issue, idx) => {
      if (issue.start > cursor) {
        segments.push({
          type: 'text',
          content: text.slice(cursor, issue.start),
          key: `txt-${idx}-${cursor}`,
        });
      }
      segments.push({
        type: 'issue',
        issue,
        key: `iss-${issue.id}`,
      });
      cursor = issue.end;
    });

    if (cursor < text.length) {
      segments.push({
        type: 'text',
        content: text.slice(cursor),
        key: `txt-end-${cursor}`,
      });
    }

    return segments;
  }, [showHighlighted, issues, text]);

  const isDark = theme === 'dark';
  const fixableCount = issues.filter((i) => i.suggestions.length > 0).length;

  return (
    <div
      className={`rounded-xl border p-3 space-y-2.5 transition-all ${
        isDark
          ? 'bg-black/45 border-white/15 text-white'
          : 'bg-neutral-50 border-neutral-300 text-neutral-900'
      }`}
    >
      {/* Top Bar: Status + Language Mode + Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-mono">
          <BookOpen
            className={`w-3.5 h-3.5 ${
              isDark ? 'text-amber-300' : 'text-[#E05A36]'
            }`}
          />
          <span
            className={`font-bold uppercase tracking-wider text-[11px] ${
              isDark ? 'text-white/80' : 'text-neutral-700'
            }`}
          >
            {label}
          </span>

          {!dictReady && !dictError && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 text-[10px]">
              <Loader2 className="w-3 h-3 animate-spin" />
              Cargando...
            </span>
          )}

          {dictError && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 text-[10px]">
              {dictError}
            </span>
          )}

          {dictReady && text.trim().length > 0 && issues.length === 0 && (
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                isDark
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              Sin errores ({mode === 'both' ? 'EN/ES' : mode.toUpperCase()})
            </span>
          )}

          {dictReady && issues.length > 0 && (
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                isDark
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'bg-rose-100 text-rose-800 border border-rose-300'
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              {issues.length}{' '}
              {issues.length === 1
                ? 'palabra incorrecta'
                : 'palabras incorrectas'}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {showModeSelector && onChangeMode && (
            <div
              className={`inline-flex rounded-lg p-0.5 text-[10px] font-mono font-bold ${
                isDark ? 'bg-white/10' : 'bg-neutral-200'
              }`}
            >
              {(
                [
                  { id: 'both', label: 'EN + ES' },
                  { id: 'es', label: 'ES' },
                  { id: 'en', label: 'EN' },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onChangeMode(opt.id)}
                  className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                    mode === opt.id
                      ? 'bg-[#E05A36] text-white shadow-sm'
                      : isDark
                      ? 'text-white/70 hover:text-white'
                      : 'text-neutral-700 hover:text-black'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {issues.length > 0 && (
            <>
              <button
                type="button"
                onClick={() => setShowHighlighted((v) => !v)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition-colors cursor-pointer ${
                  showHighlighted
                    ? 'bg-amber-400 text-[#0E2340]'
                    : isDark
                    ? 'bg-white/10 hover:bg-white/20 text-white/90'
                    : 'bg-white hover:bg-neutral-200 text-neutral-800 border border-neutral-300'
                }`}
              >
                {showHighlighted ? (
                  <>
                    <EyeOff className="w-3 h-3" />
                    <span>Ocultar Vista</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3 h-3" />
                    <span>Señalar en Texto</span>
                  </>
                )}
              </button>

              {fixableCount > 0 && (
                <button
                  type="button"
                  onClick={handleAutoCorrectAll}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-mono font-bold uppercase transition-colors cursor-pointer shadow-sm"
                  title="Aplicar la mejor sugerencia a todas las palabras señaladas"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Corregir Todo ({fixableCount})</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Interactive Highlighted View pointing out misspelled words inline */}
      {showHighlighted && issues.length > 0 && highlightedSegments && (
        <div
          className={`p-3 rounded-lg border text-sm leading-relaxed font-serif whitespace-pre-wrap select-text ${
            isDark
              ? 'bg-neutral-950/90 border-rose-500/30 text-white/95'
              : 'bg-white border-rose-300 text-neutral-900'
          }`}
        >
          <div
            className={`text-[10px] font-mono uppercase tracking-wider mb-2 ${
              isDark ? 'text-amber-300/80' : 'text-rose-700'
            }`}
          >
            Haz clic en cualquier palabra subrayada para corregirla:
          </div>
          {highlightedSegments.map((seg) => {
            if (seg.type === 'text') {
              return <span key={seg.key}>{seg.content}</span>;
            }
            const issue = seg.issue;
            const isOpen = activeIssueId === issue.id;
            return (
              <span key={seg.key} className="relative inline-block">
                <button
                  type="button"
                  onClick={() =>
                    setActiveIssueId(isOpen ? null : issue.id)
                  }
                  className={`underline decoration-wavy decoration-rose-500 decoration-2 px-0.5 rounded cursor-pointer transition-colors ${
                    isDark
                      ? 'bg-rose-500/20 text-rose-200 hover:bg-rose-500/35'
                      : 'bg-rose-100 text-rose-900 hover:bg-rose-200'
                  }`}
                >
                  {issue.word}
                </button>

                {isOpen && (
                  <div
                    className={`absolute left-0 top-full mt-1 z-30 min-w-[200px] max-w-[260px] rounded-xl p-2.5 shadow-2xl border text-left font-mono ${
                      isDark
                        ? 'bg-[#111827] border-amber-400/40 text-white'
                        : 'bg-white border-neutral-300 text-neutral-900'
                    }`}
                  >
                    <div className="text-[10px] text-rose-400 font-bold uppercase mb-1.5">
                      Sugerencias para "{issue.word}":
                    </div>
                    {issue.suggestions.length > 0 ? (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {issue.suggestions.map((sug) => (
                          <button
                            key={sug}
                            type="button"
                            onClick={() => handleReplaceIssue(issue, sug)}
                            className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer transition-colors"
                          >
                            {sug}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-[11px] opacity-70 mb-2">
                        Sin sugerencias automáticas.
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => handleAddToDictionary(issue.word)}
                      className={`w-full px-2 py-1 rounded text-[10px] font-bold uppercase flex items-center justify-center gap-1 cursor-pointer ${
                        isDark
                          ? 'bg-white/10 hover:bg-white/20 text-amber-200'
                          : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
                      }`}
                    >
                      <Plus className="w-3 h-3" />
                      <span>Agregar al diccionario</span>
                    </button>
                  </div>
                )}
              </span>
            );
          })}
        </div>
      )}

      {/* Compact Misspelled Words List with 1-Click Fixes */}
      {dictReady && issues.length > 0 && (
        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
          {issues.map((issue) => (
            <div
              key={issue.id}
              className={`flex flex-wrap items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-xs font-mono border ${
                isDark
                  ? 'bg-rose-950/30 border-rose-500/25'
                  : 'bg-white border-rose-200'
              }`}
            >
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold line-through decoration-rose-400/80">
                  {issue.word}
                </span>
                <span className={isDark ? 'text-white/40' : 'text-neutral-400'}>
                  →
                </span>
                {issue.suggestions.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-1">
                    {issue.suggestions.slice(0, 4).map((sug) => (
                      <button
                        key={sug}
                        type="button"
                        onClick={() => handleReplaceIssue(issue, sug)}
                        className={`px-2 py-0.5 rounded font-bold transition-colors cursor-pointer ${
                          isDark
                            ? 'bg-emerald-500/20 hover:bg-emerald-500/35 text-emerald-300 border border-emerald-500/30'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}
                        title={`Reemplazar "${issue.word}" por "${sug}"`}
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                ) : (
                  <span
                    className={`text-[11px] italic ${
                      isDark ? 'text-white/50' : 'text-neutral-500'
                    }`}
                  >
                    Palabra no encontrada en EN/ES
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleAddToDictionary(issue.word)}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] uppercase font-bold transition-colors cursor-pointer shrink-0 ${
                  isDark
                    ? 'bg-white/10 hover:bg-white/20 text-amber-200'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                }`}
                title="Guardar palabra en tu diccionario personal"
              >
                <Plus className="w-3 h-3" />
                <span>Ignorar</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
