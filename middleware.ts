import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/intake/(.*)',
  '/api/webhooks/(.*)',
  '/api/intake/(.*)',
  '/api/stripe/webhook',
  // SEO files
  '/sitemap.xml',
  '/robots.txt',
  // Public marketing / SEO pages
  '/features(.*)',
  '/how-it-works',
  '/pricing',
  '/for-homeowners',
  '/for-landlords',
  '/guides(.*)',
  '/contact',
  '/privacy',
  '/terms',
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }

  // Pass pathname to server components via header
  const response = NextResponse.next();
  response.headers.set('x-next-pathname', request.nextUrl.pathname);
  return response;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|xml|txt)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
