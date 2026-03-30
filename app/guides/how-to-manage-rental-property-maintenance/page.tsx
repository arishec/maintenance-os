import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/public-layout';
import { ArticleJsonLd } from '@/components/seo/article-jsonld';

export const metadata: Metadata = {
  title: 'How to Manage Rental Property Maintenance (Without Losing Your Mind)',
  description:
    'The systems, processes, and tools landlords use to stay organized, reduce costs, and keep tenants happy across multiple rental properties.',
  alternates: {
    canonical: '/guides/how-to-manage-rental-property-maintenance',
  },
};

export default function HowToManageRentalPropertyMaintenancePage() {
  return (
    <PublicLayout>
      <ArticleJsonLd
        headline="How to Manage Rental Property Maintenance (Without Losing Your Mind)"
        description="The systems, processes, and tools landlords use to stay organized, reduce costs, and keep tenants happy across multiple rental properties."
        path="/guides/how-to-manage-rental-property-maintenance"
        datePublished="2026-03-27"
        dateModified="2026-03-30"
      />

      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* ───── HERO ───── */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            How to Manage Rental Property Maintenance (Without Losing Your Mind)
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            The systems, processes, and tools landlords use to stay organized, reduce costs, and keep tenants happy.
          </p>
          <Link
            href="/sign-up"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
          >
            Start Free With Maintenance OS
          </Link>
        </div>

        {/* ───── INTRO ───── */}
        <div className="mb-16">
          <p className="text-gray-700 text-lg mb-4">
            Most landlords try to manage maintenance with texts, emails, and spreadsheets. It works… until it doesn&apos;t.
          </p>
          <p className="text-gray-700 text-lg mb-4">
            Once you have multiple properties, things break down fast.
          </p>
          <p className="text-gray-700 text-lg font-medium">
            This guide will show you the system — and how to actually implement it.
          </p>
        </div>

        {/* ───── STEP 1: INTAKE ───── */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 1: Establish a Single Intake Channel</h2>
          <p className="text-gray-700 mb-4">
            The first problem most landlords face: tenants contact you via text, email, phone, and sometimes through your door. Messages get lost and contradictory information creates confusion.
          </p>
          <p className="text-gray-700 mb-4">
            The solution: give tenants one way to submit maintenance requests. This could be a web form where tenants fill out the issue and you get consistent information, a dedicated email address just for requests, or a phone line for maintenance calls.
          </p>
          <p className="text-gray-700 mb-4">
            Include this in your lease and share it prominently. Tell tenants: &ldquo;For all maintenance requests, use this form. We respond within 24 hours.&rdquo;
          </p>

          {/* Micro conversion */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mt-6">
            <p className="text-gray-800 font-medium mb-2">
              This is exactly what Maintenance OS handles automatically — one intake channel, fully structured requests, no missing details.
            </p>
            <Link href="/features/tenant-intake" className="text-blue-600 font-medium hover:underline">
              See How Intake Works →
            </Link>
          </div>
        </div>

        {/* ───── STEP 2: ORGANIZE ───── */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 2: Organize By Property</h2>
          <p className="text-gray-700 mb-4">
            Your system needs to organize maintenance by property. Each property should have its own workspace where you track open maintenance issues, in-progress repairs, completed work and costs, contractor information, and tenant contact info.
          </p>
          <p className="text-gray-700 mb-4">
            You should be able to pull up any property and see at a glance: &ldquo;What&apos;s happening at 456 Oak Street right now?&rdquo;
          </p>

          {/* Micro conversion */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mt-6">
            <p className="text-gray-800 font-medium mb-2">
              Instead of spreadsheets, Maintenance OS gives you a live dashboard for every property — see everything at a glance.
            </p>
            <Link href="/features/property-maintenance-tracking" className="text-blue-600 font-medium hover:underline">
              View Dashboard Example →
            </Link>
          </div>
        </div>

        {/* ───── STEP 3: TRIAGE ───── */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 3: Develop a Triage Process</h2>
          <p className="text-gray-700 mb-4">
            When a maintenance request comes in, you need a quick triage process to categorize urgency:
          </p>
          <div className="space-y-3 mb-4">
            <div className="flex gap-3">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-red-500 flex-shrink-0 mt-2" />
              <p className="text-gray-700"><span className="font-bold">Emergency (same day):</span> No heat in winter, no water, fire hazard, major leak. Handle immediately.</p>
            </div>
            <div className="flex gap-3">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-orange-500 flex-shrink-0 mt-2" />
              <p className="text-gray-700"><span className="font-bold">Urgent (3–5 days):</span> Safety concerns that aren&apos;t immediate — broken locks, damaged stairs. Address quickly.</p>
            </div>
            <div className="flex gap-3">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-blue-500 flex-shrink-0 mt-2" />
              <p className="text-gray-700"><span className="font-bold">Standard (1–2 weeks):</span> Normal repairs like a broken faucet or wall damage. Address in normal order.</p>
            </div>
            <div className="flex gap-3">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-gray-400 flex-shrink-0 mt-2" />
              <p className="text-gray-700"><span className="font-bold">Low priority (can wait):</span> Cosmetic issues, minor inconveniences. Schedule when convenient.</p>
            </div>
          </div>
          <p className="text-gray-700">
            When you triage, you also decide: can you fix this yourself, do you need a contractor, or is this the tenant&apos;s responsibility?
          </p>
        </div>

        {/* ───── STEP 4: CONTRACTOR NETWORK ───── */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 4: Build Your Contractor Network</h2>
          <p className="text-gray-700 mb-4">
            You&apos;ll need reliable contractors for different specialties. Build relationships with several: a plumber for water and pipes, an electrician for wiring and outlets, an HVAC tech for heating and cooling, a general handyperson for quick fixes, a roofer for leaks and damage, and a painter for touchups.
          </p>
          <p className="text-gray-700">
            Have at least 2 contractors for each specialty so you can compare quotes and have backups. Check references and verify licensing and insurance before adding to your network.
          </p>
        </div>

        {/* ───── STEP 5: DISPATCH ───── */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 5: Dispatch Efficiently</h2>
          <p className="text-gray-700 mb-4">
            Once you&apos;ve decided to hire a contractor, dispatch the request quickly with all relevant details: property address (with unit number, gate codes, parking), issue description and symptoms, photos of the damage, tenant contact info for scheduling, timeline and urgency, and budget cap if applicable.
          </p>
          <p className="text-gray-700">
            Whatever method you use, confirm the contractor received the information and understood the request.
          </p>

          {/* Micro conversion */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mt-6">
            <p className="text-gray-800 font-medium mb-2">
              Dispatching manually is where things slow down. Maintenance OS lets you send requests to contractors with one click — including all details and photos.
            </p>
            <Link href="/features/contractor-dispatch" className="text-blue-600 font-medium hover:underline">
              See Dispatch in Action →
            </Link>
          </div>
        </div>

        {/* ───── STEP 6: COMPARE QUOTES ───── */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 6: Compare Quotes for Major Work</h2>
          <p className="text-gray-700 mb-4">
            For repairs over a certain amount (e.g., $500+), get multiple quotes before hiring. Send to 2–3 contractors, compare prices and quality, evaluate timelines and reliability, consider warranty terms, then make a decision and decline others professionally.
          </p>

          {/* Micro conversion */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mt-6">
            <p className="text-gray-800 font-medium mb-2">
              For larger jobs, Maintenance OS helps you request and compare quotes side-by-side so you can make faster, smarter decisions.
            </p>
            <Link href="/features/quote-comparison" className="text-blue-600 font-medium hover:underline">
              Compare Quotes →
            </Link>
          </div>
        </div>

        {/* ───── STEP 7: TRACK RECORDS ───── */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 7: Track Costs and Maintain Records</h2>
          <p className="text-gray-700 mb-4">
            For each repair, keep detailed records: when it was reported and fixed, which property and unit, what the problem was, who did the work, how much it cost, a copy of the invoice, and any warranty terms.
          </p>
          <p className="text-gray-700">
            These records are critical for tracking spending, tax deductions, contractor evaluation, tenant disputes, and proving you maintained the property.
          </p>

          {/* Micro conversion */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mt-6">
            <p className="text-gray-800 font-medium mb-2">
              This is where most landlords fail. Maintenance OS automatically builds a complete repair history — costs, contractors, photos, and timelines.
            </p>
            <Link href="/features/repair-history" className="text-blue-600 font-medium hover:underline">
              See Repair History →
            </Link>
          </div>
        </div>

        {/* ───── STEP 8: COMMUNICATE ───── */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 8: Communicate with Tenants</h2>
          <p className="text-gray-700 mb-4">
            Keep tenants informed throughout the process. Acknowledge the request (&ldquo;Got it — we&apos;ll send someone within 5 days&rdquo;), confirm the appointment (&ldquo;Contractor arrives Tuesday 2–4pm&rdquo;), and follow up when complete.
          </p>
          <p className="text-gray-700">
            Regular communication reduces tenant frustration. They care less about how long something takes if they know what&apos;s happening.
          </p>
        </div>

        {/* ───── STEP 9: PREVENTATIVE ───── */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 9: Plan Preventative Maintenance</h2>
          <p className="text-gray-700 mb-4">
            Use your records to plan preventative work that saves money long-term. Replace HVAC filters quarterly — a $10 filter prevents a $500 compressor failure. Deep clean and inspect between tenants. Drain irrigation before winter and clean gutters in fall. Have water heaters flushed annually and AC serviced before summer.
          </p>
          <p className="text-gray-700">
            Preventative maintenance costs less than emergency repairs and keeps properties more valuable.
          </p>
        </div>

        {/* ───── STEP 10: EMERGENCY ───── */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 10: Build Emergency Procedures</h2>
          <p className="text-gray-700 mb-4">
            Have a plan for emergencies when you&apos;re unavailable. Define what counts as an emergency (no heat, no water, gas leak, fire hazard), designate an emergency contact, give them authority to approve work up to a set amount, and make sure tenants know who to call at 2am.
          </p>
        </div>

        {/* ───── KEY CONVERSION: SYSTEM PROBLEM ───── */}
        <div className="bg-gray-900 text-white rounded-lg p-6 sm:p-8 mb-16">
          <h2 className="text-2xl font-bold mb-4">
            Most landlords don&apos;t have a system — that&apos;s the problem
          </h2>
          <p className="text-gray-300 mb-4">
            If you follow everything in this guide manually, you&apos;ll spend hours managing requests, contractors, costs, and records.
          </p>
          <p className="text-gray-300 font-medium">
            Or you can use a system that does it all for you.
          </p>
        </div>

        {/* ───── COMMON MISTAKES ───── */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Common Mistakes to Avoid</h2>
          <div className="space-y-3">
            {[
              { title: 'Delaying repairs', desc: 'Small problems become big and expensive. Act quickly.' },
              { title: 'Not keeping records', desc: "You'll forget costs, dates, and contractor details. Document everything." },
              { title: 'Ignoring tenant requests', desc: 'Ignored requests lead to resentment and legal liability.' },
              { title: 'Hiring the cheapest contractor', desc: 'Low price often means low quality. Evaluate reliability.' },
              { title: 'Not getting quotes for big jobs', desc: 'Always compare for repairs over $500.' },
              { title: 'Mixing responsibilities', desc: "Be clear about what's your responsibility vs. the tenant's." },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <svg className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                <p className="text-gray-700"><span className="font-bold">{item.title}:</span> {item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ───── FINAL CTA ───── */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 sm:p-10 text-center border border-blue-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Run your maintenance like a system — not chaos
          </h2>
          <p className="text-gray-600 mb-6 text-lg max-w-xl mx-auto">
            Everything in one place: intake, dispatch, tracking, and history.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
            >
              Get Started Free
            </Link>
            <Link
              href="/features"
              className="inline-block border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium text-lg"
            >
              See All Features
            </Link>
          </div>
        </div>
      </main>
    </PublicLayout>
  );
}
