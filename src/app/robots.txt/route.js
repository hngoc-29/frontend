export function GET() {
    return new Response(
        `User-agent: *
        Allow: /
        Sitemap: ${process.env.BASE_URL || "https://next-app-music.vercel.app"}/sitemap.xml`,
        {
            headers: {
                "Content-Type": "text/plain",
            },
        }
    );
}
