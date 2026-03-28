import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';

export async function PublicLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  const isSignedIn = !!userId;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="text-2xl font-bold text-gray-900">
            <Link href="/">Maintenance OS</Link>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/features"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Features
            </Link>
            <Link
              href="/how-it-works"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/pricing"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/guides/how-to-track-home-repairs"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Guides
            </Link>
          </nav>

          {/* Buttons */}
          <div className="flex items-center gap-4">
            {isSignedIn ? (
              <Link
                href="/dashboard"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      {children}

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 mt-16">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Product Column */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/features"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/how-it-works"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    How It Works
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources Column */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/guides/how-to-track-home-repairs"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Homeowner Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/guides/how-to-manage-rental-property-maintenance"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Landlord Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/guides/how-to-compare-contractor-quotes"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Contractor Quotes Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal Column */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/privacy"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/for-homeowners"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    For Homeowners
                  </Link>
                </li>
                <li>
                  <Link
                    href="/for-landlords"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    For Landlords
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-200 pt-8">
            <p className="text-gray-600 text-sm">
              &copy; 2026 Maintenance OS. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
