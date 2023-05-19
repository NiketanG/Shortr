import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
	const urlCode = req.nextUrl.pathname.substring(1);

	const res = await fetch(
		`${process.env.SITE}/api/url/findByUrlCode/${urlCode}`,
		{
			method: "POST",
			headers: {
				...req.headers,
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
		}
	);

	const url = await res.json();
	if (!res.ok) {
		return NextResponse.redirect(new URL(process.env.SITE!));
	} else {
		return NextResponse.redirect(new URL(url.longUrl));
	}
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		"/((?!api|_next/static|_next/image|images|manifest.json|favicon.ico|dashboard|home).*)",
	],
};
