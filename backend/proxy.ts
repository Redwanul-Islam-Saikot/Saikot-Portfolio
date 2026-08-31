import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  const isAuth = token === "authenticated";
  const isDashboardPage = request.nextUrl.pathname.startsWith("/admin");

  // ইউজার লগইন ছাড়া সরাসরি /admin-এ ঢুকতে চাইলে রিডাইরেক্ট করবে
  if (isDashboardPage && !isAuth) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // অলরেডি লগইন করা থাকলে লগইন পেজ (/) এ গেলে ড্যাশবোর্ডে পাঠাবে
  if (request.nextUrl.pathname === "/" && isAuth) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin/:path*"],
};