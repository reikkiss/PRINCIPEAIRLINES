import nspell from 'nspell';

export type DictionaryMode = 'both' | 'es' | 'en';

export interface SpellingIssue {
  id: string;
  word: string;
  start: number;
  end: number;
  suggestions: string[];
  enSuggestions: string[];
  esSuggestions: string[];
  message?: string;
  source?: 'online' | 'local';
}

export interface WordLookupResult {
  word: string;
  isValidEn: boolean;
  isValidEs: boolean;
  isCustom: boolean;
  status: 'both' | 'en' | 'es' | 'custom' | 'misspelled' | 'empty';
  suggestionsEn: string[];
  suggestionsEs: string[];
  combinedSuggestions: string[];
}

export interface OnlineEnglishMeaning {
  partOfSpeech: string;
  definitions: Array<{ definition: string; example?: string }>;
}

export interface OnlineSpanishMeaning {
  partOfSpeech: string;
  definitions: string[];
}

export interface OnlineWordLookupResult extends WordLookupResult {
  source: 'online' | 'local';
  enEntry?: {
    phonetic?: string;
    audioUrl?: string;
    meanings: OnlineEnglishMeaning[];
  };
  esEntry?: {
    ipa?: string;
    meanings: OnlineSpanishMeaning[];
    spanishDefs: string[];
  };
}

const CUSTOM_DICT_STORAGE_KEY = 'principe_custom_dictionary_v1';

let enSpellInstance: nspell | null = null;
let esSpellInstance: nspell | null = null;
let loadPromise: Promise<{ en: nspell; es: nspell }> | null = null;
let loadError: string | null = null;

// In-memory caches for online API responses
const onlineSpellCache = new Map<string, SpellingIssue[]>();
const onlineWordCache = new Map<string, OnlineWordLookupResult>();

/**
 * Loads local fallback Hunspell dictionaries asynchronously from /dict/*
 */
export async function loadBilingualDictionaries(): Promise<{ en: nspell; es: nspell }> {
  if (enSpellInstance && esSpellInstance) {
    return { en: enSpellInstance, es: esSpellInstance };
  }

  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = (async () => {
    try {
      const [enAffRes, enDicRes, esAffRes, esDicRes] = await Promise.all([
        fetch('/dict/en.aff'),
        fetch('/dict/en.dic'),
        fetch('/dict/es.aff'),
        fetch('/dict/es.dic'),
      ]);

      if (!enAffRes.ok || !enDicRes.ok || !esAffRes.ok || !esDicRes.ok) {
        throw new Error('No se pudieron cargar los archivos del diccionario EN/ES.');
      }

      const [enAff, enDic, esAff, esDic] = await Promise.all([
        enAffRes.text(),
        enDicRes.text(),
        esAffRes.text(),
        esDicRes.text(),
      ]);

      enSpellInstance = nspell({ aff: enAff, dic: enDic });
      esSpellInstance = nspell({ aff: esAff, dic: esDic });
      loadError = null;

      return { en: enSpellInstance, es: esSpellInstance };
    } catch (err) {
      loadError = err instanceof Error ? err.message : 'Error cargando diccionarios';
      loadPromise = null;
      throw err;
    }
  })();

  return loadPromise;
}

export function areDictionariesLoaded(): boolean {
  return Boolean(enSpellInstance && esSpellInstance);
}

export function getDictionaryLoadError(): string | null {
  return loadError;
}

// ---------------- Personal / Custom Dictionary ----------------

export function getCustomDictionaryWords(): string[] {
  try {
    const raw = localStorage.getItem(CUSTOM_DICT_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((w): w is string => typeof w === 'string' && w.trim().length > 0);
    }
    return [];
  } catch {
    return [];
  }
}

function saveCustomDictionaryWords(words: string[]): void {
  try {
    const unique = Array.from(new Set(words.map((w) => w.trim()).filter(Boolean)));
    localStorage.setItem(CUSTOM_DICT_STORAGE_KEY, JSON.stringify(unique));
  } catch {
    // Ignore storage errors
  }
}

export function addWordToCustomDictionary(word: string): string[] {
  const clean = word.trim();
  if (!clean) return getCustomDictionaryWords();
  const current = getCustomDictionaryWords();
  const lower = clean.toLowerCase();
  if (!current.some((w) => w.toLowerCase() === lower)) {
    const updated = [...current, clean];
    saveCustomDictionaryWords(updated);
    onlineWordCache.delete(lower);
    return updated;
  }
  return current;
}

export function removeWordFromCustomDictionary(word: string): string[] {
  const lower = word.trim().toLowerCase();
  const updated = getCustomDictionaryWords().filter((w) => w.toLowerCase() !== lower);
  saveCustomDictionaryWords(updated);
  onlineWordCache.delete(lower);
  return updated;
}

function isInCustomDictionary(word: string, customWordsSet: Set<string>): boolean {
  return customWordsSet.has(word.toLowerCase());
}

// ---------------- Edit Distance & Suggestion Ranking ----------------

function levenshtein(a: string, b: string): number {
  const la = a.length;
  const lb = b.length;
  if (la === 0) return lb;
  if (lb === 0) return la;

  const dp: number[] = Array.from({ length: lb + 1 }, (_, j) => j);

  for (let i = 1; i <= la; i++) {
    let prev = i - 1;
    dp[0] = i;
    for (let j = 1; j <= lb; j++) {
      const temp = dp[j];
      if (a[i - 1] === b[j - 1]) {
        dp[j] = prev;
      } else {
        dp[j] = 1 + Math.min(prev, dp[j], dp[j - 1]);
      }
      prev = temp;
    }
  }

  return dp[lb];
}

function preserveWordCase(original: string, suggestion: string): string {
  if (!original || !suggestion) return suggestion;
  if (original === original.toUpperCase() && original !== original.toLowerCase()) {
    return suggestion.toUpperCase();
  }
  if (
    original[0] === original[0].toUpperCase() &&
    original[0] !== original[0].toLowerCase() &&
    suggestion[0] === suggestion[0].toLowerCase()
  ) {
    return suggestion.charAt(0).toUpperCase() + suggestion.slice(1);
  }
  return suggestion;
}

function normalizeApostrophe(word: string): string {
  return word.replace(/’/g, "'");
}

function isWordCorrectInSpell(spell: nspell, rawWord: string): boolean {
  const normalized = normalizeApostrophe(rawWord);
  if (spell.correct(normalized)) return true;

  const lower = normalized.toLowerCase();
  if (normalized !== lower && spell.correct(lower)) {
    return true;
  }

  const capitalized = lower.charAt(0).toUpperCase() + lower.slice(1);
  if (normalized !== capitalized && spell.correct(capitalized)) {
    return true;
  }

  if (normalized.includes('-')) {
    const parts = normalized.split('-').filter(Boolean);
    if (parts.length > 1 && parts.every((p) => isWordCorrectInSpell(spell, p))) {
      return true;
    }
  }

  return false;
}

function getSuggestionsFromSpell(spell: nspell, rawWord: string, limit = 5): string[] {
  const normalized = normalizeApostrophe(rawWord);
  let suggestions = spell.suggest(normalized);

  if (suggestions.length === 0 && normalized !== normalized.toLowerCase()) {
    suggestions = spell.suggest(normalized.toLowerCase());
  }

  return suggestions.slice(0, limit).map((s) => preserveWordCase(rawWord, s));
}

function rankCombinedSuggestions(
  originalWord: string,
  enList: string[],
  esList: string[],
  limit = 6
): string[] {
  const seen = new Map<string, string>();
  for (const s of [...esList, ...enList]) {
    const key = s.toLowerCase();
    if (!seen.has(key)) {
      seen.set(key, s);
    }
  }

  const origLower = originalWord.toLowerCase();
  return Array.from(seen.values())
    .sort((a, b) => {
      const distA = levenshtein(origLower, a.toLowerCase());
      const distB = levenshtein(origLower, b.toLowerCase());
      return distA - distB;
    })
    .slice(0, limit);
}

// ---------------- Local Tokenizing & Text Checking (Instant / Offline Fallback) ----------------

const SKIP_SPAN_REGEX = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi;
const WORD_REGEX = /[\p{L}]+(?:['’\-][\p{L}]+)*/gu;

export function checkTextSpelling(
  text: string,
  mode: DictionaryMode = 'both'
): SpellingIssue[] {
  if (!text || !enSpellInstance || !esSpellInstance) return [];

  const customWordsSet = new Set(getCustomDictionaryWords().map((w) => w.toLowerCase()));

  const skipRanges: Array<{ start: number; end: number }> = [];
  let skipMatch: RegExpExecArray | null;
  SKIP_SPAN_REGEX.lastIndex = 0;
  while ((skipMatch = SKIP_SPAN_REGEX.exec(text)) !== null) {
    skipRanges.push({
      start: skipMatch.index,
      end: skipMatch.index + skipMatch[0].length,
    });
  }

  const issues: SpellingIssue[] = [];
  let match: RegExpExecArray | null;
  WORD_REGEX.lastIndex = 0;

  while ((match = WORD_REGEX.exec(text)) !== null) {
    const word = match[0];
    const start = match.index;
    const end = start + word.length;

    if (skipRanges.some((r) => start >= r.start && end <= r.end)) continue;
    if (word.length <= 1) continue;
    if (isInCustomDictionary(word, customWordsSet)) continue;

    const validEn = isWordCorrectInSpell(enSpellInstance, word);
    const validEs = isWordCorrectInSpell(esSpellInstance, word);

    const isValid =
      mode === 'both'
        ? validEn || validEs
        : mode === 'en'
        ? validEn
        : validEs;

    if (!isValid) {
      const enSuggestions =
        mode === 'es' ? [] : getSuggestionsFromSpell(enSpellInstance, word, 5);
      const esSuggestions =
        mode === 'en' ? [] : getSuggestionsFromSpell(esSpellInstance, word, 5);

      const suggestions =
        mode === 'en'
          ? enSuggestions
          : mode === 'es'
          ? esSuggestions
          : rankCombinedSuggestions(word, enSuggestions, esSuggestions, 6);

      issues.push({
        id: `${start}-${end}-${word}`,
        word,
        start,
        end,
        suggestions,
        enSuggestions,
        esSuggestions,
        message: 'Posible error de ortografía',
        source: 'local',
      });
    }
  }

  return issues;
}

// ---------------- Online LanguageTool Spell & Grammar Checker ----------------

interface LanguageToolMatch {
  message: string;
  shortMessage?: string;
  offset: number;
  length: number;
  replacements: Array<{ value: string }>;
  rule?: {
    id?: string;
    issueType?: string;
    category?: { id?: string; name?: string };
  };
}

interface LanguageToolResponse {
  matches?: LanguageToolMatch[];
}

async function fetchLanguageTool(
  text: string,
  language: 'en-US' | 'es',
  signal?: AbortSignal
): Promise<LanguageToolMatch[]> {
  const body = new URLSearchParams({
    text,
    language,
    enabledOnly: 'false',
  });

  const res = await fetch('https://api.languagetool.org/v2/check', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: body.toString(),
    signal,
  });

  if (!res.ok) {
    throw new Error(`LanguageTool HTTP ${res.status}`);
  }

  const data = (await res.json()) as LanguageToolResponse;
  return Array.isArray(data.matches) ? data.matches : [];
}

function isSimpleWordSpan(word: string): boolean {
  return /^[\p{L}]+(?:['’\-][\p{L}]+)*$/u.test(word);
}

/**
 * Checks spelling & grammar using the online LanguageTool API (EN & ES),
 * falling back cleanly to local dictionaries if offline or rate-limited.
 */
export async function checkTextSpellingOnline(
  text: string,
  mode: DictionaryMode = 'both',
  signal?: AbortSignal
): Promise<{ issues: SpellingIssue[]; source: 'online' | 'local' }> {
  const trimmed = text.trim();
  if (!trimmed) {
    return { issues: [], source: 'online' };
  }

  const customWordsSet = new Set(getCustomDictionaryWords().map((w) => w.toLowerCase()));
  const cacheKey = `${mode}::${text}`;
  const cached = onlineSpellCache.get(cacheKey);
  if (cached) {
    // Filter out any newly added custom words
    return {
      issues: cached.filter((i) => !isInCustomDictionary(i.word, customWordsSet)),
      source: 'online',
    };
  }

  try {
    let rawIssues: SpellingIssue[] = [];

    if (mode === 'en' || mode === 'es') {
      const lang = mode === 'en' ? 'en-US' : 'es';
      const matches = await fetchLanguageTool(text, lang, signal);

      rawIssues = matches
        .filter((m) => {
          const span = text.slice(m.offset, m.offset + m.length);
          if (!span.trim() || span.length <= 1) return false;
          if (isInCustomDictionary(span, customWordsSet)) return false;
          // Ignore whitespace-only or capitalization trivial rules if no replacements
          if (m.rule?.id === 'WHITESPACE_RULE') return false;
          return true;
        })
        .map((m) => {
          const word = text.slice(m.offset, m.offset + m.length);
          const reps = m.replacements
            .map((r) => r.value)
            .filter(Boolean)
            .slice(0, 6);
          return {
            id: `lt-${m.offset}-${m.offset + m.length}-${word}`,
            word,
            start: m.offset,
            end: m.offset + m.length,
            suggestions: reps,
            enSuggestions: mode === 'en' ? reps : [],
            esSuggestions: mode === 'es' ? reps : [],
            message: m.shortMessage || m.message,
            source: 'online' as const,
          };
        });
    } else {
      // Bilingual mode ('both'): query BOTH es and en-US in parallel!
      const [esMatches, enMatches] = await Promise.all([
        fetchLanguageTool(text, 'es', signal),
        fetchLanguageTool(text, 'en-US', signal),
      ]);

      // Map of English-flagged spans by offset:length
      const enBySpan = new Map<string, LanguageToolMatch>();
      enMatches.forEach((m) => {
        enBySpan.set(`${m.offset}:${m.length}`, m);
      });

      const esBySpan = new Map<string, LanguageToolMatch>();
      esMatches.forEach((m) => {
        esBySpan.set(`${m.offset}:${m.length}`, m);
      });

      const combinedMap = new Map<string, SpellingIssue>();

      // A spelling issue is valid in bilingual mode ONLY if BOTH Spanish and English consider it misspelled
      for (const esM of esMatches) {
        const key = `${esM.offset}:${esM.length}`;
        const word = text.slice(esM.offset, esM.offset + esM.length);
        if (!word.trim() || word.length <= 1) continue;
        if (isInCustomDictionary(word, customWordsSet)) continue;
        if (esM.rule?.id === 'WHITESPACE_RULE') continue;

        const isSpelling = esM.rule?.issueType === 'misspelling' || esM.rule?.category?.id === 'TYPOS';
        if (!isSpelling) continue;

        const enMatch = enBySpan.get(key);
        const enAlsoFlags =
          Boolean(enMatch) ||
          (isSimpleWordSpan(word) && enSpellInstance ? !isWordCorrectInSpell(enSpellInstance, word) : false);

        if (enAlsoFlags) {
          const esReps = esM.replacements.map((r) => r.value).filter(Boolean).slice(0, 5);
          const enReps = (enMatch?.replacements || []).map((r) => r.value).filter(Boolean).slice(0, 5);
          combinedMap.set(key, {
            id: `lt-${esM.offset}-${esM.offset + esM.length}-${word}`,
            word,
            start: esM.offset,
            end: esM.offset + esM.length,
            suggestions: rankCombinedSuggestions(word, enReps, esReps, 6),
            enSuggestions: enReps,
            esSuggestions: esReps,
            message: 'Palabra incorrecta en inglés y español',
            source: 'online',
          });
        }
      }

      // Also check any English spelling match where Spanish also flags it (covers spans missed by ES pass)
      for (const enM of enMatches) {
        const key = `${enM.offset}:${enM.length}`;
        if (combinedMap.has(key)) continue;
        const word = text.slice(enM.offset, enM.offset + enM.length);
        if (!word.trim() || word.length <= 1) continue;
        if (isInCustomDictionary(word, customWordsSet)) continue;

        const isSpelling = enM.rule?.issueType === 'misspelling' || enM.rule?.category?.id === 'TYPOS';
        if (!isSpelling) continue;

        const esMatch = esBySpan.get(key);
        const esAlsoFlags =
          Boolean(esMatch) ||
          (isSimpleWordSpan(word) && esSpellInstance ? !isWordCorrectInSpell(esSpellInstance, word) : false);

        if (esAlsoFlags) {
          const enReps = enM.replacements.map((r) => r.value).filter(Boolean).slice(0, 5);
          const esReps = (esMatch?.replacements || []).map((r) => r.value).filter(Boolean).slice(0, 5);
          combinedMap.set(key, {
            id: `lt-${enM.offset}-${enM.offset + enM.length}-${word}`,
            word,
            start: enM.offset,
            end: enM.offset + enM.length,
            suggestions: rankCombinedSuggestions(word, enReps, esReps, 6),
            enSuggestions: enReps,
            esSuggestions: esReps,
            message: 'Palabra incorrecta en inglés y español',
            source: 'online',
          });
        }
      }

      rawIssues = Array.from(combinedMap.values()).sort((a, b) => a.start - b.start);
    }

    // Store in cache (keep cache bounded)
    if (onlineSpellCache.size > 100) {
      const firstKey = onlineSpellCache.keys().next().value;
      if (firstKey) onlineSpellCache.delete(firstKey);
    }
    onlineSpellCache.set(cacheKey, rawIssues);

    return { issues: rawIssues, source: 'online' };
  } catch (err) {
    if (signal?.aborted) {
      throw err;
    }
    // Fallback gracefully to local Hunspell dictionaries
    await loadBilingualDictionaries().catch(() => null);
    return { issues: checkTextSpelling(text, mode), source: 'local' };
  }
}

export function applySpellingCorrection(
  text: string,
  start: number,
  end: number,
  replacement: string
): string {
  return text.slice(0, start) + replacement + text.slice(end);
}

export function autoCorrectAllIssues(
  text: string,
  mode: DictionaryMode = 'both',
  knownIssues?: SpellingIssue[]
): { correctedText: string; fixedCount: number } {
  const issues = knownIssues || checkTextSpelling(text, mode);
  if (issues.length === 0) {
    return { correctedText: text, fixedCount: 0 };
  }

  let updated = text;
  let fixedCount = 0;

  const sorted = [...issues].sort((a, b) => b.start - a.start);
  for (const issue of sorted) {
    if (issue.suggestions.length > 0) {
      updated = applySpellingCorrection(
        updated,
        issue.start,
        issue.end,
        issue.suggestions[0]
      );
      fixedCount++;
    }
  }

  return { correctedText: updated, fixedCount };
}

// ---------------- Online Dictionary Lookup (EN + ES Definitions, IPA, Audio & Suggestions) ----------------

export function lookupWordInDictionaries(rawWord: string): WordLookupResult {
  const word = rawWord.trim();
  if (!word) {
    return {
      word: '',
      isValidEn: false,
      isValidEs: false,
      isCustom: false,
      status: 'empty',
      suggestionsEn: [],
      suggestionsEs: [],
      combinedSuggestions: [],
    };
  }

  const customWordsSet = new Set(getCustomDictionaryWords().map((w) => w.toLowerCase()));
  const isCustom = isInCustomDictionary(word, customWordsSet);

  if (!enSpellInstance || !esSpellInstance) {
    return {
      word,
      isValidEn: false,
      isValidEs: false,
      isCustom,
      status: isCustom ? 'custom' : 'misspelled',
      suggestionsEn: [],
      suggestionsEs: [],
      combinedSuggestions: [],
    };
  }

  const isValidEn = isWordCorrectInSpell(enSpellInstance, word);
  const isValidEs = isWordCorrectInSpell(esSpellInstance, word);

  let status: WordLookupResult['status'] = 'misspelled';
  if (isValidEn && isValidEs) status = 'both';
  else if (isValidEn) status = 'en';
  else if (isValidEs) status = 'es';
  else if (isCustom) status = 'custom';

  const suggestionsEn = isValidEn ? [] : getSuggestionsFromSpell(enSpellInstance, word, 6);
  const suggestionsEs = isValidEs ? [] : getSuggestionsFromSpell(esSpellInstance, word, 6);
  const combinedSuggestions =
    status === 'misspelled'
      ? rankCombinedSuggestions(word, suggestionsEn, suggestionsEs, 8)
      : [];

  return {
    word,
    isValidEn,
    isValidEs,
    isCustom,
    status,
    suggestionsEn,
    suggestionsEs,
    combinedSuggestions,
  };
}

interface DictionaryApiDevEntry {
  phonetic?: string;
  phonetics?: Array<{ text?: string; audio?: string }>;
  meanings?: Array<{
    partOfSpeech?: string;
    definitions?: Array<{ definition?: string; example?: string }>;
  }>;
}

interface FreeDictionaryApiResponse {
  word?: string;
  entries?: Array<{
    partOfSpeech?: string;
    pronunciations?: Array<{ text?: string }>;
    senses?: Array<{ definition?: string }>;
  }>;
}

interface DatamuseWordItem {
  word: string;
  score?: number;
  defs?: string[];
}

export async function lookupWordOnline(
  rawWord: string,
  signal?: AbortSignal
): Promise<OnlineWordLookupResult> {
  const word = rawWord.trim();
  if (!word) {
    return {
      word: '',
      isValidEn: false,
      isValidEs: false,
      isCustom: false,
      status: 'empty',
      suggestionsEn: [],
      suggestionsEs: [],
      combinedSuggestions: [],
      source: 'online',
    };
  }

  const customWordsSet = new Set(getCustomDictionaryWords().map((w) => w.toLowerCase()));
  const isCustom = isInCustomDictionary(word, customWordsSet);
  const cacheKey = word.toLowerCase();
  const cached = onlineWordCache.get(cacheKey);
  if (cached) {
    return {
      ...cached,
      isCustom,
      status:
        cached.status === 'misspelled' && isCustom ? 'custom' : cached.status,
    };
  }

  const encoded = encodeURIComponent(word.toLowerCase());

  try {
    const [enApiRes, esApiRes, dmEnRes, dmEsRes] = await Promise.all([
      fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encoded}`, { signal }).catch(() => null),
      fetch(`https://freedictionaryapi.com/api/v1/entries/es/${encoded}`, { signal }).catch(() => null),
      fetch(`https://api.datamuse.com/words?sp=${encoded}&md=d&max=6`, { signal }).catch(() => null),
      fetch(`https://api.datamuse.com/words?sp=${encoded}&v=es&md=d&max=6`, { signal }).catch(() => null),
    ]);

    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    // Parse English Dictionary API
    let enEntry: OnlineWordLookupResult['enEntry'] = undefined;
    let isValidEnOnline = false;
    if (enApiRes && enApiRes.ok) {
      const enData = (await enApiRes.json()) as DictionaryApiDevEntry[];
      if (Array.isArray(enData) && enData.length > 0) {
        isValidEnOnline = true;
        const first = enData[0];
        const audioObj = first.phonetics?.find((p) => p.audio && p.audio.length > 0);
        const textPhonetic =
          first.phonetic || first.phonetics?.find((p) => p.text)?.text;

        const meanings: OnlineEnglishMeaning[] = [];
        enData.forEach((entry) => {
          entry.meanings?.forEach((m) => {
            if (m.partOfSpeech && m.definitions && m.definitions.length > 0) {
              meanings.push({
                partOfSpeech: m.partOfSpeech,
                definitions: m.definitions
                  .filter((d) => Boolean(d.definition))
                  .slice(0, 3)
                  .map((d) => ({
                    definition: d.definition!,
                    example: d.example,
                  })),
              });
            }
          });
        });

        enEntry = {
          phonetic: textPhonetic,
          audioUrl: audioObj?.audio,
          meanings: meanings.slice(0, 4),
        };
      }
    }

    // Parse Spanish FreeDictionaryAPI + Datamuse ES
    let esEntry: OnlineWordLookupResult['esEntry'] = undefined;
    let isValidEsOnline = false;

    const esMeanings: OnlineSpanishMeaning[] = [];
    let esIpa: string | undefined;
    const spanishDefs: string[] = [];

    if (esApiRes && esApiRes.ok) {
      const esData = (await esApiRes.json()) as FreeDictionaryApiResponse;
      if (esData && Array.isArray(esData.entries) && esData.entries.length > 0) {
        isValidEsOnline = true;
        esIpa = esData.entries[0]?.pronunciations?.[0]?.text;
        esData.entries.forEach((entry) => {
          const defs = (entry.senses || [])
            .map((s) => s.definition)
            .filter((d): d is string => Boolean(d))
            .slice(0, 3);
          if (defs.length > 0) {
            esMeanings.push({
              partOfSpeech: entry.partOfSpeech || 'término',
              definitions: defs,
            });
          }
        });
      }
    }

    const suggestionsEsOnline: string[] = [];
    if (dmEsRes && dmEsRes.ok) {
      const dmEsData = (await dmEsRes.json()) as DatamuseWordItem[];
      if (Array.isArray(dmEsData)) {
        dmEsData.forEach((item) => {
          if (!item.word) return;
          if (item.word.toLowerCase() === word.toLowerCase()) {
            isValidEsOnline = true;
            if (Array.isArray(item.defs)) {
              item.defs.forEach((d) => {
                const cleanDef = d.includes('\t') ? d.split('\t').slice(1).join(' ') : d;
                if (cleanDef && spanishDefs.length < 4) {
                  spanishDefs.push(cleanDef);
                }
              });
            }
          } else if (!suggestionsEsOnline.includes(item.word)) {
            suggestionsEsOnline.push(item.word);
          }
        });
      }
    }

    if (isValidEsOnline || esMeanings.length > 0 || spanishDefs.length > 0) {
      esEntry = {
        ipa: esIpa,
        meanings: esMeanings.slice(0, 4),
        spanishDefs,
      };
    }

    const suggestionsEnOnline: string[] = [];
    if (dmEnRes && dmEnRes.ok) {
      const dmEnData = (await dmEnRes.json()) as DatamuseWordItem[];
      if (Array.isArray(dmEnData)) {
        dmEnData.forEach((item) => {
          if (!item.word) return;
          if (item.word.toLowerCase() === word.toLowerCase()) {
            isValidEnOnline = true;
          } else if (!suggestionsEnOnline.includes(item.word)) {
            suggestionsEnOnline.push(item.word);
          }
        });
      }
    }

    // Supplement validity & suggestions with local Hunspell (covers conjugated verbs/plurals omitted in dictionaryapi)
    await loadBilingualDictionaries().catch(() => null);
    const localResult = lookupWordInDictionaries(word);

    const isValidEn = isValidEnOnline || localResult.isValidEn;
    const isValidEs = isValidEsOnline || localResult.isValidEs;

    let status: WordLookupResult['status'] = 'misspelled';
    if (isValidEn && isValidEs) status = 'both';
    else if (isValidEn) status = 'en';
    else if (isValidEs) status = 'es';
    else if (isCustom) status = 'custom';

    const suggestionsEn = isValidEn
      ? []
      : Array.from(new Set([...suggestionsEnOnline, ...localResult.suggestionsEn])).slice(0, 6);
    const suggestionsEs = isValidEs
      ? []
      : Array.from(new Set([...suggestionsEsOnline, ...localResult.suggestionsEs])).slice(0, 6);

    const combinedSuggestions =
      status === 'misspelled'
        ? rankCombinedSuggestions(word, suggestionsEn, suggestionsEs, 8)
        : [];

    const result: OnlineWordLookupResult = {
      word,
      isValidEn,
      isValidEs,
      isCustom,
      status,
      suggestionsEn,
      suggestionsEs,
      combinedSuggestions,
      enEntry,
      esEntry,
      source: 'online',
    };

    if (onlineWordCache.size > 150) {
      const firstKey = onlineWordCache.keys().next().value;
      if (firstKey) onlineWordCache.delete(firstKey);
    }
    onlineWordCache.set(cacheKey, result);

    return result;
  } catch (err) {
    if ((err as Error)?.name === 'AbortError') {
      throw err;
    }
    await loadBilingualDictionaries().catch(() => null);
    return {
      ...lookupWordInDictionaries(word),
      source: 'local',
    };
  }
}
