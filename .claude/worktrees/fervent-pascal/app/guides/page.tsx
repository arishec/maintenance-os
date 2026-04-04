import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/public-layout';

export const metadata: Metadata = {
  title: 'Guides',
  description:
    'Practical guides for homeowners and landlords on tracking repairs, managing maintenance, and comparing contractor quotes.',
  alternates: {
    canonical: '/guides',
  },
};

const guides = [
  {
    href: '/guides/how-to-track-home-repairs',
    title: 'How to Track Home Repairs',
    description:
      'A practical guide to organizing home maintenance, keeping records, and building a complete repair history for your home.',
  },
  {
    href: '/guides/how-to-manage-rental-property-maintenance',
    title: 'How to Manage Rental Property Maintenance',
    description:
      'Learn how landlords can streamline maintenance requests, coordinate with contractors, and keep tenants happy.',
  },
  {
    href: '/guides/how-to-compare-contractor-quotes',
    title: 'How to Compare Contractor Quotes',
    description:
      'Stop overpaying. Learn how to request, compare, and evaluate contractor quotes for home repairs.',
  },
];

export default function GuidesPage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Guides</h1>
        <p className="text-lg text-gray-600 mb-12">
          Practical advice for homeowners and landlords on keeping your property
          maintenance organized.
        </p>

        <div className="space-y-6">
          {guides.map((guide) => (
            <Link
              key={guide.href}
              href={guide.href}
              className="block rounded-xl border border-gray-200 p-6 hover:border-gray-300 hover:shadow-sm transition-all"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {guide.title}
              </h2>
              <p className="text-gray-600">{guide.description}</p>
              <span className="mt-3 inline-block text-sm font-medium text-blue-600">
                Read guide →
              </span>
            </Link>
          ))}
        </div>
      </main>
    </PublicLayout>
  );
}
