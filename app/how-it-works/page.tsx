import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/public-layout';

export const metadata: Metadata = {
  title: 'How Maintenance OS Works',
  description:
    'Report an issue once, send it to contractors, compare responses, and keep everything organized from start to finish.',
  alternates: {
    canonical: '/how-it-works',
  },
};

export default function HowItWorksPage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Hero */}
        <div className="mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Manage repairs without chasing contractors
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Report an issue once, send it to contractors, compare responses, and keep
            everything organized from start to finish.
          </p>
          <p className="mt-3 text-sm text-gray-500 max-w-3xl">
            No more digging through texts, waiting on replies, or losing track of what was fixed.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href="/sign-up"
              className="inline-flex justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              Get started for free
            </Link>
            <Link
              href="/features"
              className="inline-flex justify-center rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              See features
            </Link>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-12 sm:space-y-16">

          {/* Step 1 */}
          <div className="flex gap-5 sm:gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-11 w-11 sm:h-12 sm:w-12 rounded-lg bg-blue-600 text-white text-lg font-bold">
                1
              </div>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Report the issue</h2>
              <p className="text-gray-600 mb-3">
                Start with the problem. Add a title, description, and photos if you have them.
              </p>
              <p className="text-gray-600 mb-3">
                Whether it&apos;s a leaking sink, broken AC, or roof issue, everything gets captured
                in one place so you have a clear record from the start.
              </p>
              <p className="text-gray-500 text-sm">
                No more scattered notes or trying to remember what happened later.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-5 sm:gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-11 w-11 sm:h-12 sm:w-12 rounded-lg bg-blue-600 text-white text-lg font-bold">
                2
              </div>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Automatically organize the request</h2>
              <p className="text-gray-600 mb-3">
                Maintenance OS instantly understands what&apos;s wrong and organizes it for you.
              </p>
              <p className="text-gray-600 mb-3">
                It categorizes the issue and helps prioritize it so it goes to the right
                contractors without guesswork.
              </p>
              <p className="text-gray-500 text-sm">
                Plumbing, electrical, HVAC, roofing — handled automatically.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-5 sm:gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-11 w-11 sm:h-12 sm:w-12 rounded-lg bg-blue-600 text-white text-lg font-bold">
                3
              </div>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Send to multiple contractors at once</h2>
              <p className="text-gray-600 mb-3">
                Instead of reaching out one by one, send the issue once and contact multiple
                contractors at the same time.
              </p>
              <p className="text-gray-600 mb-3">
                They can reply with pricing, availability, or questions — all tied to the
                same request.
              </p>
              <p className="text-gray-500 text-sm">
                One request out. Multiple responses back.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-5 sm:gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-11 w-11 sm:h-12 sm:w-12 rounded-lg bg-blue-600 text-white text-lg font-bold">
                4
              </div>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Compare responses in one place</h2>
              <p className="text-gray-600 mb-3">
                See pricing, timing, and contractor details side by side.
              </p>
              <p className="text-gray-600 mb-3">
                No more digging through messages or trying to remember who said what.
              </p>
              <p className="text-gray-500 text-sm">
                Everything is already organized so you can make a decision quickly.
              </p>
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex gap-5 sm:gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-11 w-11 sm:h-12 sm:w-12 rounded-lg bg-blue-600 text-white text-lg font-bold">
                5
              </div>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Track the job and keep the history</h2>
              <p className="text-gray-600 mb-3">
                Once you choose a contractor, track the repair through completion.
              </p>
              <p className="text-gray-600">
                Every repair becomes part of your property&apos;s history — so you always know
                what was done, when, and by whom.
              </p>
            </div>
          </div>
        </div>

        {/* Why This Works Better */}
        <section className="mt-16 sm:mt-24 rounded-2xl bg-gray-50 border border-gray-200 p-6 sm:p-8 lg:p-12">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Why this works better</h2>
          <div className="space-y-4">
            {[
              { title: 'Stop chasing contractors', desc: 'Send one request instead of following up across texts and emails.' },
              { title: 'Make faster decisions', desc: 'Compare quotes and availability in one place.' },
              { title: 'Stay organized', desc: 'Keep a complete repair history for every property.' },
              { title: 'Reduce back-and-forth', desc: 'Everything lives in one thread tied to the issue.' },
              { title: 'Works as you scale', desc: 'Use it for one home or multiple properties.' },
            ].map((item) => (
              <div key={item.title} className="flex gap-3">
                <span className="text-blue-600 font-bold flex-shrink-0">&#10003;</span>
                <div>
                  <span className="font-medium text-gray-900">{item.title}:</span>{' '}
                  <span className="text-gray-600">{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="mt-16 sm:mt-24 rounded-2xl bg-blue-50 border border-blue-100 p-6 sm:p-8 md:p-12 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            Start managing repairs the simple way
          </h2>
          <p className="text-gray-600 mb-6">
            Report your first issue and see how everything stays organized from the start.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/sign-up"
              className="inline-flex justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              Get started for free
            </Link>
            <Link
              href="/pricing"
              className="inline-flex justify-center rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              View pricing
            </Link>
          </div>
          <p className="mt-4 text-xs text-gray-500">
            No credit card required while we&apos;re in beta.
          </p>
        </section>
      </main>
    </PublicLayout>
  );
}
