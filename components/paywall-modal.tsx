'use client';

import { useState } from 'react';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  trigger: 'issue_limit' | 'dispatch';
}

export function PaywallModal({ isOpen, onClose, trigger }: PaywallModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const title =
    trigger === 'dispatch'
      ? 'Send this issue to contractors'
      : 'Unlock unlimited issues';

  const description =
    trigger === 'dispatch'
      ? 'Compare real responses instead of chasing texts and calls.'
      : 'You\'ve used your 3 free issues. Upgrade to keep tracking and managing repairs.';

  async function handleUpgrade() {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-8">
        {/* Icon */}
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
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

        <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">{description}</p>

        {/* Benefits */}
        <div className="space-y-3 mb-8">
          <div className="flex gap-3">
            <span className="text-green-600 font-bold text-sm mt-0.5">✓</span>
            <span className="text-gray-700 text-sm">Send to multiple contractors at once</span>
          </div>
          <div className="flex gap-3">
            <span className="text-green-600 font-bold text-sm mt-0.5">✓</span>
            <span className="text-gray-700 text-sm">See replies in one place</span>
          </div>
          <div className="flex gap-3">
            <span className="text-green-600 font-bold text-sm mt-0.5">✓</span>
            <span className="text-gray-700 text-sm">Choose the best option quickly</span>
          </div>
          <div className="flex gap-3">
            <span className="text-green-600 font-bold text-sm mt-0.5">✓</span>
            <span className="text-gray-700 text-sm">Unlimited issues and properties</span>
          </div>
        </div>

        {/* Price callout */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-center">
          <p className="text-2xl font-bold text-gray-900">
            $19<span className="text-sm font-normal text-gray-600">/month</span>
          </p>
          <p className="text-sm text-gray-500">Cancel anytime</p>
        </div>

        {/* CTAs */}
        <button
          onClick={handleUpgrade}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 mb-3"
        >
          {loading ? 'Loading...' : 'Upgrade to Pro'}
        </button>
        <button
          onClick={onClose}
          className="w-full text-gray-500 py-2 text-sm hover:text-gray-700 transition-colors"
        >
          Not now
        </button>
      </div>
    </div>
  );
}
