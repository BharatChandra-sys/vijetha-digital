import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const host = request.headers.get('host') || '';

  // 1. Redirect www to non-www (canonical)
  if (host.startsWith('www.')) {
    const newUrl = request.nextUrl.clone();
    newUrl.host = host.replace('www.', '');
    return NextResponse.redirect(newUrl, 301);
  }

  // 2. Redirect old .html pages to new clean URLs
  const htmlRedirects: Record<string, string> = {
    '/index.html': '/',
    '/about.html': '/about',
    '/contact.html': '/contact',
    '/services.html': '/services',
    '/products.html': '/products',
    '/work.html': '/projects',
    '/projects.html': '/projects',
  };

  if (pathname.endsWith('.html')) {
    const cleanPath = htmlRedirects[pathname];
    if (cleanPath) {
      const newUrl = request.nextUrl.clone();
      newUrl.pathname = cleanPath;
      return NextResponse.redirect(newUrl, 301);
    }
    // Any other .html file redirects to homepage
    const newUrl = request.nextUrl.clone();
    newUrl.pathname = '/';
    return NextResponse.redirect(newUrl, 301);
  }

  // 3. Redirect http to https (if not already https)
  const proto = request.headers.get('x-forwarded-proto');
  if (proto === 'http') {
    const newUrl = request.nextUrl.clone();
    newUrl.protocol = 'https:';
    return NextResponse.redirect(newUrl, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, robots, sitemap, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:jpg|jpeg|gif|png|svg|ico|webp|avif|xml|txt)).*)',
  ],
};
