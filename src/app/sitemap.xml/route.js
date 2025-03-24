export async function GET() {
    const domain = process.env.BASE_URL || "https://next-app-music.vercel.app";
    const staticUrls = [
        `${domain}/thong-tin`,
        `${domain}/cai-dat`,
    ];

    // Fetch dynamic paths for thumbnails
    const thumbnailResponse = await fetch(`${process.env.URL_BACKEND}/v1/thumbnail`);
    const thumbnailData = await thumbnailResponse.json();
    const dynamicUrls = thumbnailData.success ? thumbnailData.thumbnails.map(thumbnail => `${domain}/${thumbnail._id}`) : [];

    const urls = [
        { url: `${domain}/`, changefreq: 'daily', priority: 1.0 },
        ...staticUrls.map(url => ({ url, changefreq: 'never', priority: 0.4 })),
        ...dynamicUrls.map(url => ({ url, changefreq: 'daily', priority: 1.0 })),
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${urls.map(({ url, changefreq, priority }) => `
            <url>
                <loc>${url}</loc>
                <changefreq>${changefreq}</changefreq>
                <priority>${priority}</priority>
            </url>`).join("\n")}
    </urlset>`;

    return new Response(sitemap, {
        headers: {
            "Content-Type": "application/xml",
        },
    });
}
