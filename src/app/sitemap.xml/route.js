export async function GET() {
    const domain = process.env.BASE_URL || "https://next-app-music.vercel.app";
    const urls = [
        `${domain}/`,
        `${domain}/thong-tin`,
        `${domain}/cai-dat`,
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${urls.map(url => `<url><loc>${url}</loc></url>`).join("\n")}
    </urlset>`;

    return new Response(sitemap, {
        headers: {
            "Content-Type": "application/xml",
        },
    });
}
