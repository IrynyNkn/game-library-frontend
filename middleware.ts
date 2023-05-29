import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authTokenName, containsPath } from './utils/auth';

export function middleware(request: NextRequest) {
  const cookie = request.cookies.get(authTokenName);

  const { pathname, origin } = request.nextUrl;
  const currentPath = `${origin}${pathname}`;
  const containsCurPath = containsPath(currentPath);
  if (containsCurPath) {
    if (!cookie) {
      request.nextUrl.pathname = '/login';
      return NextResponse.redirect(request.nextUrl);
    } else {
      return NextResponse.next();
    }
  }
}
