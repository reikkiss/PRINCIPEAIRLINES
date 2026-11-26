/**
 * Utilities for generating, reading, and sharing direct URLs for Love Letters.
 */

export function getLetterDirectUrl(letterId: string): string {
  if (typeof window === 'undefined') {
    return `?letter=${encodeURIComponent(letterId)}`;
  }

  const origin = window.location.origin;
  // Clean pathname in case the user arrived via /letter/:id path
  let basePath = window.location.pathname.replace(/\/letter\/[^/?#]+/gi, '');
  if (!basePath.endsWith('/')) {
    basePath = basePath === '' ? '/' : basePath;
  }

  // Preserve existing query params except 'letter' and 'carta'
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.set('letter', letterId);
  searchParams.delete('carta');

  return `${origin}${basePath}?${searchParams.toString()}`;
}

export function getLetterIdFromCurrentUrl(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    // 1. Check URL query params (?letter=... or ?carta=...)
    const params = new URLSearchParams(window.location.search);
    const fromParam = params.get('letter') || params.get('carta') || params.get('letterId');
    if (fromParam) return decodeURIComponent(fromParam);

    // 2. Check path (/letter/:id or /carta/:id)
    const pathMatch = window.location.pathname.match(/\/(?:letter|carta)\/([^/?#]+)/i);
    if (pathMatch && pathMatch[1]) {
      return decodeURIComponent(pathMatch[1]);
    }

    // 3. Check hash (#letter-... or #letter=... or #carta=...)
    const hash = window.location.hash;
    if (hash) {
      const hashParamMatch = hash.match(/#(?:letter|carta)[=-]([^&]+)/i);
      if (hashParamMatch && hashParamMatch[1]) {
        return decodeURIComponent(hashParamMatch[1]);
      }
      const hashSlashMatch = hash.match(/#(?:letter|carta)\/([^&]+)/i);
      if (hashSlashMatch && hashSlashMatch[1]) {
        return decodeURIComponent(hashSlashMatch[1]);
      }
    }
  } catch (e) {
    console.error('Error parsing letter ID from URL:', e);
  }

  return null;
}

export function updateUrlForLetter(letterId: string | null, replace: boolean = false): void {
  if (typeof window === 'undefined') return;

  try {
    const currentParams = new URLSearchParams(window.location.search);

    if (letterId) {
      if (currentParams.get('letter') === letterId) {
        return; // Already up to date
      }
      currentParams.set('letter', letterId);
      currentParams.delete('carta');
    } else {
      if (!currentParams.has('letter') && !currentParams.has('carta') && !window.location.pathname.includes('/letter/')) {
        return; // Nothing to clear
      }
      currentParams.delete('letter');
      currentParams.delete('carta');
    }

    let basePath = window.location.pathname.replace(/\/letter\/[^/?#]+/gi, '');
    if (!basePath.endsWith('/')) {
      basePath = basePath === '' ? '/' : basePath;
    }

    const queryString = currentParams.toString();
    const newRelativeUrl = queryString ? `${basePath}?${queryString}` : basePath;

    if (replace) {
      window.history.replaceState({ letterId }, '', newRelativeUrl);
    } else {
      window.history.pushState({ letterId }, '', newRelativeUrl);
    }
  } catch (e) {
    console.error('Error updating browser URL for letter:', e);
  }
}

export async function copyLetterUrlToClipboard(letterId: string): Promise<boolean> {
  const url = getLetterDirectUrl(letterId);

  // Modern clipboard API
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(url);
      return true;
    } catch {
      // Fallback below
    }
  }

  // Fallback for iframes or restricted environments
  try {
    const textArea = document.createElement('textarea');
    textArea.value = url;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '0';
    textArea.setAttribute('readonly', '');
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Could not copy URL to clipboard', err);
    return false;
  }
}
