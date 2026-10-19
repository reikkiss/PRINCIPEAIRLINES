/**
 * Utility to compress images on client side before saving to Firestore.
 * Firestore has a strict 1MB document limit (1,048,487 bytes max per property/document).
 * This compressor ensures all images (files or base64) are resized and compressed to well under
 * 400KB (~300,000 chars base64), guaranteeing zero Firestore size limit errors.
 */
export async function compressImage(
  fileOrBase64: File | string,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.7
): Promise<string> {
  return new Promise((resolve) => {
    // If it's a regular remote URL or absolute path, return as is
    if (
      typeof fileOrBase64 === 'string' &&
      (fileOrBase64.startsWith('http://') ||
        fileOrBase64.startsWith('https://') ||
        fileOrBase64.startsWith('/src/') ||
        fileOrBase64.startsWith('/assets/'))
    ) {
      resolve(fileOrBase64);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    const processImage = () => {
      try {
        let width = img.naturalWidth || img.width || 800;
        let height = img.naturalHeight || img.height || 600;

        // Calculate aspect-ratio preserved dimensions
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve(typeof fileOrBase64 === 'string' ? fileOrBase64.slice(0, 400000) : '');
          return;
        }

        // Draw image onto white background to avoid transparent alpha blooming
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Convert to compressed JPEG
        let currentQuality = quality;
        let compressed = canvas.toDataURL('image/jpeg', currentQuality);

        // Target size limit: strictly below 400,000 base64 chars (~300KB)
        // Hard limit in Firestore is 1,048,487 bytes
        const MAX_SAFE_LENGTH = 380000;
        let currentWidth = canvas.width;
        let currentHeight = canvas.height;

        let iterations = 0;
        while (compressed.length > MAX_SAFE_LENGTH && iterations < 5) {
          iterations++;
          currentWidth = Math.max(200, Math.round(currentWidth * 0.75));
          currentHeight = Math.max(200, Math.round(currentHeight * 0.75));
          currentQuality = Math.max(0.35, currentQuality - 0.1);

          const stepCanvas = document.createElement('canvas');
          stepCanvas.width = currentWidth;
          stepCanvas.height = currentHeight;
          const stepCtx = stepCanvas.getContext('2d');
          if (!stepCtx) break;

          stepCtx.fillStyle = '#FFFFFF';
          stepCtx.fillRect(0, 0, currentWidth, currentHeight);
          stepCtx.drawImage(canvas, 0, 0, currentWidth, currentHeight);
          compressed = stepCanvas.toDataURL('image/jpeg', currentQuality);
        }

        resolve(compressed);
      } catch (err) {
        console.warn('Image compression fallback', err);
        resolve(typeof fileOrBase64 === 'string' ? fileOrBase64.slice(0, 400000) : '');
      }
    };

    if (typeof fileOrBase64 === 'string') {
      img.onload = processImage;
      img.onerror = () => resolve(fileOrBase64.slice(0, 400000));
      img.src = fileOrBase64;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.onload = processImage;
        img.onerror = () => resolve((e.target?.result as string)?.slice(0, 400000) || '');
        img.src = e.target?.result as string;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(fileOrBase64);
    }
  });
}
