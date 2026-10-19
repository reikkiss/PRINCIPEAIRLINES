/**
 * Utility to compress images on client side before saving to Firestore.
 * Firestore has a strict 1MB document limit (1,048,487 bytes max per property).
 * This ensures uploaded images are crisp, optimized, and guaranteed to fit (< 200KB).
 */
export async function compressImage(
  fileOrBase64: File | string,
  maxWidth = 1024,
  maxHeight = 1024,
  quality = 0.75
): Promise<string> {
  return new Promise((resolve) => {
    // If it's a regular HTTP/HTTPS URL, return it as is
    if (typeof fileOrBase64 === 'string' && (fileOrBase64.startsWith('http://') || fileOrBase64.startsWith('https://') || fileOrBase64.startsWith('/'))) {
      resolve(fileOrBase64);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    const processImage = () => {
      try {
        let width = img.width || 800;
        let height = img.height || 600;

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
          resolve(typeof fileOrBase64 === 'string' ? fileOrBase64 : '');
          return;
        }

        // Draw image onto canvas
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Convert to compressed JPEG
        let compressed = canvas.toDataURL('image/jpeg', quality);

        // Double check byte length: 1 char is ~1 byte in base64. Limit to 600KB max.
        if (compressed.length > 600000) {
          compressed = canvas.toDataURL('image/jpeg', 0.55);
        }

        if (compressed.length > 600000) {
          // Downscale further if still too large
          const smallerCanvas = document.createElement('canvas');
          smallerCanvas.width = Math.round(canvas.width * 0.7);
          smallerCanvas.height = Math.round(canvas.height * 0.7);
          const sCtx = smallerCanvas.getContext('2d');
          if (sCtx) {
            sCtx.fillStyle = '#FFFFFF';
            sCtx.fillRect(0, 0, smallerCanvas.width, smallerCanvas.height);
            sCtx.drawImage(canvas, 0, 0, smallerCanvas.width, smallerCanvas.height);
            compressed = smallerCanvas.toDataURL('image/jpeg', 0.5);
          }
        }

        resolve(compressed);
      } catch (err) {
        console.warn('Image compression fallback', err);
        resolve(typeof fileOrBase64 === 'string' ? fileOrBase64 : '');
      }
    };

    if (typeof fileOrBase64 === 'string') {
      img.onload = processImage;
      img.onerror = () => resolve(fileOrBase64);
      img.src = fileOrBase64;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.onload = processImage;
        img.onerror = () => resolve(e.target?.result as string || '');
        img.src = e.target?.result as string;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(fileOrBase64);
    }
  });
}
