import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

export function middleware(
  request: NextRequest
) {
  const token =
    request.cookies.get("token")?.value;

  const pathname =
    request.nextUrl.pathname;

  const isPublic =
    PUBLIC_ROUTES.includes(pathname);

  if (!token && !isPublic) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  if (token && isPublic) {
    return NextResponse.redirect(
      new URL("/dashboard", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/orders/:path*",
    "/companies/:path*",
    "/documents/:path*",
    "/payments/:path*",
    "/profile/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ],
};