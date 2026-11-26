import React, { useState, useEffect, useMemo } from 'react';
import { TravelLetter } from '../types';
import {
  DictionaryMode,
  loadBilingualDictionaries,
  areDictionariesLoaded,
  lookupWordInDictionaries,
  checkTextSpelling,
  getCustomDictionaryWords,
  addWordToCustomDictionary,
  removeWordFromCustomDictionary,
} from '../utils/bilingualDictionary';
import { SpellcheckAssistantBar } from './SpellcheckAssistantBar';
import {
  BookOpen,
  Search,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  Copy,
  Check,
  Edit3,
  Heart,
  Loader2,
  Languages,
} from 'lucide-react';

interface BilingualDictionaryPanelProps {
  letters: TravelLetter[];
  onEditLetter: (letter: TravelLetter) => void;
}

export const BilingualDictionaryPanel: React.FC<BilingualDictionaryPanelProps> = ({
  letters,
  onEditLetter,
}) => {
  const [dictReady, setDictReady] = useState<boolean>(areDictionariesLoaded());
  const [dictError, setDictError] = useState<string | null>(null);

  // Word Lookup state
  const [lookupQuery, setLookupQuery] = useState('');
  const [customWords, setCustomWords] = useState<string[]>(() =>
    getCustomDictionaryWords()
  );

  // Proofreader scratchpad state
  const [proofMode, setProofMode] = useState<DictionaryMode>('both');
  const [proofText, setProofText] = useState('');
  const [copiedProof, setCopiedProof] = useState(false);

  // Audit mode for saved letters
  const [auditMode, setAuditMode] = useState<DictionaryMode>('both');

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
              err instanceof Error ? err.message : 'Error cargando diccionarios'
            );
          }
        });
    }
    return () => {
      mounted = false;
    };
  }, []);

  const lookupResult = useMemo(() => {
    if (!dictReady) return null;
    return lookupWordInDictionaries(lookupQuery);
  }, [lookupQuery, dictReady, customWords]);

  const auditedLetters = useMemo(() => {
    if (!dictReady) return [];
    return letters.map((letter) => {
      const titleIssues = checkTextSpelling(letter.title || '', auditMode);
      const bodyIssues = checkTextSpelling(letter.content || '', auditMode);
      const allIssues = [...titleIssues, ...bodyIssues];
      return {
        letter,
        titleIssues,
        bodyIssues,
        totalIssues: allIssues.length,
        uniqueMisspelled: Array.from(
          new Map(allIssues.map((i) => [i.word.toLowerCase(), i])).values()
        ),
      };
    });
  }, [letters, auditMode, dictReady, customWords]);

  const totalFlaggedLetters = auditedLetters.filter((a) => a.totalIssues > 0).length;

  const handleAddCustomWord = (word: string) => {
    const updated = addWordToCustomDictionary(word);
    setCustomWords(updated);
  };

  const handleRemoveCustomWord = (word: string) => {
    const updated = removeWordFromCustomDictionary(word);
    setCustomWords(updated);
  };

  const handleCopyProofText = async () => {
    if (!proofText.trim()) return;
    try {
      await navigator.clipboard.writeText(proofText);
      setCopiedProof(true);
      setTimeout(() => setCopiedProof(false), 2000);
    } catch {
      // ignore clipboard errors
    }
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="text-xs font-mono font-bold text-[#0E2340] uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Languages className="w-4 h-4 text-[#E05A36]" />
            <span>DICCIONARIO BILINGÜE INGLÉS & ESPAÑOL · CORRECTOR ORTOGRÁFICO</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-display tracking-tight text-neutral-900">
            Diccionario EN / ES y Detector de Errores
          </h1>
          <p className="text-sm text-neutral-600 mt-1 max-w-2xl font-sans">
            Verifica palabras en inglés y español, detecta palabras mal escritas o incorrectas en tus textos y revisa automáticamente tus cartas de amor guardadas.
          </p>
        </div>

        <div className="shrink-0">
          {!dictReady && !dictError ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 text-xs font-mono font-bold">
              <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
              <span>Cargando diccionarios EN + ES...</span>
            </div>
          ) : dictError ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 text-red-900 border border-red-300 text-xs font-mono font-bold">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>{dictError}</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-mono font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Diccionarios English + Español Activos</span>
            </div>
          )}
        </div>
      </div>

      {/* Top Grid: Word Lookup + Personal Dictionary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 1. Word Checker (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-neutral-300 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-[#E05A36]" />
            <h2 className="text-lg font-bold font-display text-neutral-900">
              Buscador y Verificador de Palabras (EN / ES)
            </h2>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={lookupQuery}
              onChange={(e) => setLookupQuery(e.target.value)}
              placeholder="Escribe cualquier palabra en inglés o español (ej. forever, corazón, missspelled)..."
              spellCheck={true}
              className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-300 rounded-xl text-sm font-mono focus:outline-none focus:border-[#0E2340]"
            />
          </div>

          {lookupResult && lookupResult.status !== 'empty' && (
            <div className="p-4 rounded-xl border bg-neutral-50 border-neutral-200 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold font-display text-neutral-900">
                    "{lookupResult.word}"
                  </span>
                  {lookupResult.status === 'misspelled' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 text-xs font-mono font-bold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Palabra incorrecta / no encontrada
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-mono font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {lookupResult.status === 'both'
                        ? 'Válida en Inglés y Español'
                        : lookupResult.status === 'en'
                        ? 'Válida en Inglés (English)'
                        : lookupResult.status === 'es'
                        ? 'Válida en Español'
                        : 'En tu diccionario personal'}
                    </span>
                  )}
                </div>

                {lookupResult.status === 'misspelled' && (
                  <button
                    type="button"
                    onClick={() => handleAddCustomWord(lookupResult.word)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-xs font-mono font-bold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar al diccionario</span>
                  </button>
                )}
              </div>

              {/* Language Badges */}
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                <span
                  className={`px-2.5 py-1 rounded-lg border ${
                    lookupResult.isValidEn
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                      : 'bg-neutral-100 border-neutral-200 text-neutral-500'
                  }`}
                >
                  English: {lookupResult.isValidEn ? '✓ Correcta' : '✗ No coincide'}
                </span>
                <span
                  className={`px-2.5 py-1 rounded-lg border ${
                    lookupResult.isValidEs
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                      : 'bg-neutral-100 border-neutral-200 text-neutral-500'
                  }`}
                >
                  Español: {lookupResult.isValidEs ? '✓ Correcta' : '✗ No coincide'}
                </span>
              </div>

              {/* Suggestions */}
              {(lookupResult.combinedSuggestions.length > 0 ||
                lookupResult.suggestionsEn.length > 0 ||
                lookupResult.suggestionsEs.length > 0) && (
                <div className="pt-2 border-t border-neutral-200 space-y-2">
                  {lookupResult.suggestionsEs.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
                      <span className="text-neutral-500 font-bold">
                        Sugerencias ES:
                      </span>
                      {lookupResult.suggestionsEs.map((s) => (
                        <button
                          key={`es-${s}`}
                          type="button"
                          onClick={() => setLookupQuery(s)}
                          className="px-2 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold cursor-pointer"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}

                  {lookupResult.suggestionsEn.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
                      <span className="text-neutral-500 font-bold">
                        Sugerencias EN:
                      </span>
                      {lookupResult.suggestionsEn.map((s) => (
                        <button
                          key={`en-${s}`}
                          type="button"
                          onClick={() => setLookupQuery(s)}
                          className="px-2 py-0.5 rounded bg-blue-100 hover:bg-blue-200 text-blue-900 font-bold cursor-pointer"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 2. Personal Dictionary (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-neutral-300 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#0E2340]" />
                <h2 className="text-lg font-bold font-display text-neutral-900">
                  Diccionario Personal ({customWords.length})
                </h2>
              </div>
            </div>
            <p className="text-xs text-neutral-600 font-sans">
              Nombres propios, apodos especiales o palabras que el corrector siempre debe aceptar como válidas.
            </p>

            {customWords.length === 0 ? (
              <div className="p-4 rounded-xl bg-neutral-50 border border-dashed border-neutral-300 text-xs font-mono text-neutral-500 text-center">
                Aún no has agregado palabras personalizadas. Cuando el corrector señale un nombre o apodo, presiona "+ Ignorar" o agrégalo arriba.
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
                {customWords.map((word) => (
                  <span
                    key={word}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-100 border border-neutral-300 text-xs font-mono font-bold text-neutral-800"
                  >
                    <span>{word}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomWord(word)}
                      className="text-neutral-400 hover:text-red-600 cursor-pointer"
                      title={`Eliminar "${word}"`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Full Text Proofreader */}
      <div className="bg-white border border-neutral-300 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold font-display text-neutral-900">
              Corrector de Textos Completo (Inglés & Español)
            </h2>
            <p className="text-xs text-neutral-600 font-sans">
              Escribe o pega cualquier mensaje o carta. Las palabras mal escritas o incorrectas se señalarán automáticamente con opciones para corregirlas en un clic.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyProofText}
              disabled={!proofText.trim()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-black disabled:opacity-40 text-white text-xs font-mono font-bold uppercase cursor-pointer"
            >
              {copiedProof ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Texto</span>
                </>
              )}
            </button>

            {proofText && (
              <button
                type="button"
                onClick={() => setProofText('')}
                className="px-3 py-1.5 rounded-lg bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-xs font-mono font-bold uppercase cursor-pointer"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        <textarea
          rows={5}
          value={proofText}
          onChange={(e) => setProofText(e.target.value)}
          spellCheck={true}
          placeholder="Escribe o pega aquí texto en español, inglés o bilingüe para detectar y corregir palabras mal escritas..."
          className="w-full p-4 bg-neutral-50 border border-neutral-300 rounded-xl text-sm sm:text-base font-serif leading-relaxed text-neutral-900 focus:outline-none focus:border-[#0E2340]"
        />

        <SpellcheckAssistantBar
          text={proofText}
          onChangeText={setProofText}
          mode={proofMode}
          onChangeMode={setProofMode}
          theme="light"
          label="Revisión Ortográfica EN / ES"
          defaultShowHighlighted={true}
        />
      </div>

      {/* 4. Saved Letters Audit */}
      <div className="bg-white border border-neutral-300 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-200">
          <div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-600 fill-rose-600" />
              <h2 className="text-lg sm:text-xl font-bold font-display text-neutral-900">
                Revisión de Cartas Guardadas ({letters.length})
              </h2>
            </div>
            <p className="text-xs text-neutral-600 font-sans mt-0.5">
              {totalFlaggedLetters === 0
                ? 'Todas tus cartas guardadas pasaron la revisión ortográfica sin palabras incorrectas.'
                : `Se detectaron palabras por revisar en ${totalFlaggedLetters} ${
                    totalFlaggedLetters === 1 ? 'carta' : 'cartas'
                  }.`}
            </p>
          </div>

          <div className="inline-flex rounded-lg p-0.5 bg-neutral-200 text-xs font-mono font-bold">
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
                onClick={() => setAuditMode(opt.id)}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  auditMode === opt.id
                    ? 'bg-[#0E2340] text-white'
                    : 'text-neutral-700 hover:text-black'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {letters.length === 0 ? (
          <div className="py-8 text-center text-xs font-mono text-neutral-500">
            No hay cartas guardadas en la base de datos para revisar.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {auditedLetters.map(({ letter, totalIssues, uniqueMisspelled }) => (
              <div
                key={letter.id}
                className={`p-4 rounded-xl border flex flex-col justify-between gap-3 ${
                  totalIssues > 0
                    ? 'bg-rose-50/50 border-rose-300'
                    : 'bg-emerald-50/40 border-emerald-200'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold font-display text-neutral-900 text-base">
                      {letter.title}
                    </h3>
                    {totalIssues > 0 ? (
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 text-[10px] font-mono font-bold shrink-0">
                        {totalIssues} {totalIssues === 1 ? 'error' : 'errores'}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-mono font-bold shrink-0">
                        ✓ Correcta
                      </span>
                    )}
                  </div>

                  {uniqueMisspelled.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 text-xs font-mono">
                      {uniqueMisspelled.slice(0, 8).map((iss) => (
                        <span
                          key={iss.id}
                          className="px-2 py-0.5 rounded bg-white border border-rose-200 text-rose-700"
                        >
                          <strong className="line-through">{iss.word}</strong>
                          {iss.suggestions[0] ? (
                            <span className="text-emerald-700 ml-1">
                              → {iss.suggestions[0]}
                            </span>
                          ) : null}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => onEditLetter(letter)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0E2340] hover:bg-black text-white text-xs font-mono font-bold uppercase cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{totalIssues > 0 ? 'Corregir Carta' : 'Editar Carta'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
