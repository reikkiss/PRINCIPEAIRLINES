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

const CUSTOM_DICT_STORAGE_KEY = 'principe_custom_dictionary_v1';

let enSpellInstance: nspell | null = null;
let esSpellInstance: nspell | null = null;
let loadPromise: Promise<{ en: nspell; es: nspell }> | null = null;
let loadError: string | null = null;

/**
 * Loads English and Spanish Hunspell dictionaries asynchronously from /dict/*
 * and caches singleton nspell instances in memory.
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
    // Ignore storage errors in restricted environments
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
    return updated;
  }
  return current;
}

export function removeWordFromCustomDictionary(word: string): string[] {
  const lower = word.trim().toLowerCase();
  const updated = getCustomDictionaryWords().filter((w) => w.toLowerCase() !== lower);
  saveCustomDictionaryWords(updated);
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

  // Allow capitalized or ALL-CAPS versions of valid lowercase words
  const lower = normalized.toLowerCase();
  if (normalized !== lower && spell.correct(lower)) {
    return true;
  }

  // Handle title-cased words in dictionary (e.g. proper nouns/days/months)
  const capitalized = lower.charAt(0).toUpperCase() + lower.slice(1);
  if (normalized !== capitalized && spell.correct(capitalized)) {
    return true;
  }

  // Handle hyphenated compound words by checking parts if whole word wasn't found
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

// ---------------- Tokenizing & Text Checking ----------------

// Regex to skip URLs and email addresses before word extraction
const SKIP_SPAN_REGEX = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi;
// Unicode-aware word matcher supporting English apostrophes, hyphens, and Spanish accents/ñ
const WORD_REGEX = /[\p{L}]+(?:['’\-][\p{L}]+)*/gu;

export function checkTextSpelling(
  text: string,
  mode: DictionaryMode = 'both'
): SpellingIssue[] {
  if (!text || !enSpellInstance || !esSpellInstance) return [];

  const customWordsSet = new Set(getCustomDictionaryWords().map((w) => w.toLowerCase()));

  // Compute URL/email spans to ignore
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

    // Skip URLs or emails
    if (skipRanges.some((r) => start >= r.start && end <= r.end)) {
      continue;
    }

    // Skip single-character letters (e.g., "a", "y", "e", "o", "u", "I")
    if (word.length <= 1) {
      continue;
    }

    // Skip if inside custom dictionary
    if (isInCustomDictionary(word, customWordsSet)) {
      continue;
    }

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
      });
    }
  }

  return issues;
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
  mode: DictionaryMode = 'both'
): { correctedText: string; fixedCount: number } {
  const issues = checkTextSpelling(text, mode);
  if (issues.length === 0) {
    return { correctedText: text, fixedCount: 0 };
  }

  let updated = text;
  let fixedCount = 0;

  // Apply from end to start so character offsets stay valid
  for (let i = issues.length - 1; i >= 0; i--) {
    const issue = issues[i];
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
