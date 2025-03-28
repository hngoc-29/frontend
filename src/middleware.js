import { NextResponse } from "next/server";

export async function middleware(req) {
    const skipRoutes = (process.env.SKIP_ROUTES || "").split(" ");
    if (req.nextUrl.pathname.startsWith("/api/") && !skipRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
        const host = req.headers.get("host");
        const referer = req.headers.get("referer") || "";
        // Lấy domain cho phép từ biến môi trường hoặc dựa trên host
        const allowedOrigin = process.env.BASE_URL + `/` || `https://${host}/`;

        // Nếu request không có Origin hoặc Referer hoặc giá trị không trùng với allowedOrigin,
        // thì có thể là request không đến từ ứng dụng (app request)
        if (!referer || !referer.startsWith(allowedOrigin)) {
            // Nếu không có origin, có thể cho phép (hoặc kiểm tra lại tùy logic ứng dụng)
            return new NextResponse(JSON.stringify({ error: "Origin missing" }), {
                status: 403,
                headers: { "Content-Type": "application/json" },
            });
        }
        // Nếu là preflight request (OPTIONS), trả về ngay
        if (req.method === "OPTIONS") {
            return new NextResponse(null, {
                status: 204,
                headers: {
                    "Access-Control-Allow-Origin": allowedOrigin,
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                    "Access-Control-Allow-Headers": "*",
                    "Access-Control-Allow-Credentials": "true",
                },
            });
        }

        // Cho phép request
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: "/api/:path*",
};
