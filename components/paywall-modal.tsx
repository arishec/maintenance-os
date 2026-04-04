'use client';

// BETA: This modal is disabled during beta. If it somehow opens,
// it just tells the user everything is free and closes.

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  trigger: 'issue_limit' | 'dispatch';
}

export function PaywallModal({ isOpen, onClose }: PaywallModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-8 text-center">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
          <svg
            className="w-6 h-6 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-2">You&apos;re in the beta!</h2>
        <p className="text-gray-600 mb-6">
          All features are free right now. If you hit a limit, try refreshing the page.
        </p>

        <button
          type="button"
          onClick={onClose}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
