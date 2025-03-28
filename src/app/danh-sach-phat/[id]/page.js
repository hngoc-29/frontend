import Main from './Main';

async function fetchThumbnails(id) {
    const res = await fetch(`${process.env.BASE_URL}/api/thumbnails`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            id: id,
        },
    });
    try {
        const data = await res.json();
        // console.log(res, data)
        return data?.thumbnail || null;
    } catch (error) {
        console.error("Không thể phân tích phản hồi JSON:", error);
        return null;
    }
}

export async function generateMetadata({ params }) {
    const { id } = await params;
    let thumbnail = {};
    if (id && id != `all`) thumbnail = await fetchThumbnails(id) || {};
    return {
        title: thumbnail.title || "App Nghe Nhạc - Trải nghiệm âm nhạc trực tuyến",
        description: thumbnail.description || "Khám phá kho bài hát phong phú, giao diện hiện đại.",
        openGraph: {
            title: thumbnail.title || "App Nghe Nhạc",
            description: thumbnail.description || "Khám phá kho bài hát phong phú.",
            images: [
                {
                    url: thumbnail.image_url || "/images/thumbnail.jpg",
                    width: 1200,
                    height: 630,
                    alt: thumbnail.title || "Ảnh nhạc",
                },
            ],
        },
    };
}

const MainPage = async ({ params }) => {
    const { id } = await params;
    return (
        <div>
            <Main id={id} />
        </div>
    );
};

export default MainPage;
