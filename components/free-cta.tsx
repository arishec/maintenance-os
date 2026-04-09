import Link from 'next/link';

/**
 * Shared CTA block for public pages.
 * Shows "Start free — no credit card" button + beta messaging.
 *
 * Variants:
 *  - "hero"  → blue button on light background (default)
 *  - "dark"  → blue button on dark (slate-950) background section
 */
export function FreeCTA({
  variant = 'hero',
  heading,
  subheading,
}: {
  variant?: 'hero' | 'dark';
  heading?: string;
  subheading?: string;
}) {
  const isDark = variant === 'dark';

  const wrapper = isDark
    ? 'rounded-2xl bg-slate-950 p-6 sm:p-8 md:p-12 text-center'
    : 'text-center';

  const headingClass = isDark
    ? 'text-xl sm:text-2xl font-bold text-white mb-3'
    : 'text-xl sm:text-2xl font-bold text-gray-900 mb-3';

  const subClass = isDark ? 'text-slate-300 mb-6' : 'text-gray-600 mb-6';

  const btnClass = isDark
    ? 'inline-flex justify-center rounded-2xl bg-blue-500 px-8 py-4 text-lg font-semibold text-white hover:bg-blue-400 hover:shadow-lg transition'
    : 'inline-flex justify-center rounded-2xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-md hover:bg-blue-700 hover:shadow-lg transition';

  const freeClass = isDark
    ? 'mt-4 text-sm font-medium text-emerald-400'
    : 'mt-5 text-base font-medium text-emerald-600';

  const trustClass = isDark
    ? 'mt-2 flex justify-center gap-3 text-sm text-slate-400'
    : 'mt-3 flex justify-center gap-3 text-sm text-gray-500';

  return (
    <div className={wrapper}>
      {heading && <h2 className={headingClass}>{heading}</h2>}
      {subheading && <p className={subClass}>{subheading}</p>}
      <Link href="/sign-up" className={btnClass}>
        Start free — no credit card
      </Link>
      <p className={freeClass}>
        {isDark
          ? '100% free during beta — every feature, no limits'
          : '100% free during beta — all features included'}
      </p>
      <div className={trustClass}>
        <span>No credit card</span>
        <span aria-hidden="true">·</span>
        <span>Set up in 2 minutes</span>
        <span aria-hidden="true">·</span>
        <span>Works for 1 property or 100</span>
      </div>
    </div>
  );
}
