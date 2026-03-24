import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/api/public(.*)']);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }

  const response = NextResponse.next();

  // OWASP Security Headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  
  // Content Security Policy (Optimized for Clerk & Turnstile)
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.clerk.accounts.dev *.clerk.com clerk.com challenges.cloudflare.com; " +
    "worker-src 'self' blob:; " +
    "frame-src 'self' challenges.cloudflare.com *.clerk.accounts.dev *.clerk.com; " +
    "style-src 'self' 'unsafe-inline' fonts.googleapis.com; " +
    "img-src 'self' blob: data: img.clerk.com; " +
    "font-src 'self' fonts.gstatic.com; " +
    "connect-src 'self' *.clerk.accounts.dev *.clerk.com clerk.com;"
  );

  return response;
});

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
