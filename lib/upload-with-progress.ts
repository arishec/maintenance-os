/**
 * Upload a file via XMLHttpRequest with real progress tracking.
 * fetch() doesn't support upload progress events, so we use XHR.
 */
export function uploadWithProgress(
  url: string,
  formData: FormData,
  onProgress: (percent: number) => void
): Promise<{ ok: boolean; status: number; json: () => Promise<Record<string, unknown>> }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        onProgress(percent);
      }
    });

    xhr.addEventListener('load', () => {
      resolve({
        ok: xhr.status >= 200 && xhr.status < 300,
        status: xhr.status,
        json: () => {
          try {
            return Promise.resolve(JSON.parse(xhr.responseText));
          } catch {
            return Promise.resolve({});
          }
        },
      });
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Network error during upload'));
    });

    xhr.addEventListener('timeout', () => {
      reject(new Error('Upload timed out. Please try again.'));
    });

    xhr.timeout = 60000; // 60 second timeout for mobile connections
    xhr.open('POST', url);
    xhr.send(formData);
  });
}
