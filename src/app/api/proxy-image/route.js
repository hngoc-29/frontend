import { NextResponse } from "next/server";
import sharp from "sharp";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const imageUrl = searchParams.get("url");

    if (!imageUrl) {
        return NextResponse.json({ error: "Missing image URL" }, { status: 400 });
    }

    try {
        const response = await fetch(imageUrl);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const convertedImage = await sharp(buffer)
            .webp()
            .toBuffer();

        return new Response(convertedImage, {
            headers: {
                "Content-Type": "image/webp",
                "Cache-Control": "public, max-age=86400",
            },
        });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch or convert image" }, { status: 500 });
    }
}
