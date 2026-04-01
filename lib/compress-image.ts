/**
 * Client-side image compression to stay under Vercel's 4.5MB serverless body limit.
 * Resizes to MAX_DIMENSION on longest side, converts to JPEG.
 */

// Max dimension for compressed images (maintains aspect ratio)
const MAX_DIMENSION = 2000;
// Target quality for JPEG compression
const JPEG_QUALITY = 0.8;
// Max file size to send to server (Vercel limit is 4.5MB, leave headroom)
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024; // 4MB

export function compressImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    // If already small enough and is JPEG, skip compression
    if (file.size <= MAX_UPLOAD_BYTES && file.type === 'image/jpeg') {
      return resolve(file);
    }

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;

      // Scale down if larger than MAX_DIMENSION
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        if (width > height) {
          height = Math.round(height * (MAX_DIMENSION / width));
          width = MAX_DIMENSION;
        } else {
          width = Math.round(width * (MAX_DIMENSION / height));
          height = MAX_DIMENSION;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Could not get canvas context'));
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            return reject(new Error('Canvas compression failed'));
          }
          const baseName = file.name.replace(/\.[^.]+$/, '');
          const compressed = new File([blob], `${baseName}.jpg`, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          resolve(compressed);
        },
        'image/jpeg',
        JPEG_QUALITY,
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };

    img.src = url;
  });
}
