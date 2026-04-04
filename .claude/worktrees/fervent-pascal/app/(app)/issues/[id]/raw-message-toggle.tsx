'use client';

import { useState } from 'react';

export function RawMessageToggle({ rawMessage }: { rawMessage: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
      >
        {isOpen ? 'Hide raw message' : 'View raw message'}
      </button>
      {isOpen && (
        <pre className="mt-2 rounded-lg bg-muted p-3 text-xs whitespace-pre-wrap font-mono max-h-48 overflow-y-auto">
          {rawMessage}
        </pre>
      )}
    </div>
  );
}
