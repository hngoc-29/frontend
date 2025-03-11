import { cookies } from 'next/headers';
import Main from './Main';

export async function generateMetadata({ params, searchParams }) {
    const id = (await params).id;
    let songIndex = 0;

    // Lấy chỉ số bài hát từ query "sing", nếu có
    if (searchParams && (await searchParams).sing) {
        const parsedIndex = parseInt((await searchParams).sing, 10);
        if (!isNaN(parsedIndex)) {
            songIndex = parsedIndex;
        }
    }

    // Lấy base URL từ biến môi trường, nếu không có thì dùng localhost
    const baseUrl = process.env.BASE_URL || "https://frontend-hngoc-29s-projects.vercel.app";
    console.log(baseUrl);
    try {
        // Lấy cookie hiện tại từ request
        const cookieHeader = (await cookies()).toString();
        // Tạo URL tuyệt đối cho API bằng cách nối với baseUrl
        const apiUrl = new URL(`/api/manager/sings?parent=${id}`, baseUrl).href;

        // Gọi API, truyền cookie trong header để xác thực nếu cần
        const res = await fetch(apiUrl, {
            cache: 'no-store',
            headers: { Cookie: cookieHeader },
        });
        const data = await res.json();
        const sings = data?.Sings || [];

        // Nếu chỉ số bài hát không hợp lệ, sử dụng bài hát đầu tiên
        if (songIndex < 0 || songIndex >= sings.length) {
            songIndex = 0;
        }
        const song = sings[songIndex];

        return {
            title: song
                ? `${song.singname} - ${song.author}`
                : "Main Page",
            description: song
                ? `Nghe bài hát ${song.singname} của ${song.author}`
                : "Trang chính của ứng dụng của bạn",
            openGraph: {
                title: song
                    ? `${song.singname} - ${song.author}`
                    : "Main Page",
                description: song
                    ? `Nghe bài hát ${song.singname} của ${song.author}`
                    : "Trang chính của ứng dụng của bạn",
                url: new URL(`/${id}?sing=${songIndex}`, baseUrl).href,
                siteName: "App Nghe Nhạc",
                images: [
                    {
                        url: song
                            ? song.image_url
                            : "https://thienvu.com.vn/image/catalog/top-ung-dung-nghe-nhac-thoa-thich-khong-can-mang/top-ung-dung-nghe-nhac-hay-nhat-hien-nay.jpg",
                        width: 1200,
                        height: 630,
                        alt: song ? song.singname : "Default Song",
                    },
                ],
                locale: "vi_VN",
                type: "website",
            },
            twitter: {
                card: "summary_large_image",
                title: song
                    ? `${song.singname} - ${song.author}`
                    : "Main Page",
                description: song
                    ? `Nghe bài hát ${song.singname} của ${song.author}`
                    : "Trang chính của ứng dụng của bạn",
                images: [
                    song
                        ? song.image_url
                        : "https://thienvu.com.vn/image/catalog/top-ung-dung-nghe-nhac-thoa-thich-khong-can-mang/top-ung-dung-nghe-nhac-hay-nhat-hien-nay.jpg",
                ],
            },
            facebook: {
                app_id: "music_app_id",
                title: song
                    ? `${song.singname} - ${song.author}`
                    : "Main Page",
                description: song
                    ? `Nghe bài hát ${song.singname} của ${song.author}`
                    : "Trang chính của ứng dụng của bạn",
                images: [
                    {
                        url: song
                            ? song.image_url
                            : "https://thienvu.com.vn/image/catalog/top-ung-dung-nghe-nhac-thoa-thich-khong-can-mang/top-ung-dung-nghe-nhac-hay-nhat-hien-nay.jpg",
                        width: 1200,
                        height: 630,
                        alt: song ? song.singname : "Default Song",
                    },
                ],
            },
            // Xác định URL cơ sở cho các đường dẫn tương đối trong metadata
            metadataBase: new URL(baseUrl),
        };
    } catch (error) {
        console.error("Error fetching metadata:", error);
        return {
            title: "Main Page",
            description: "Trang chính của ứng dụng của bạn",
            metadataBase: new URL(baseUrl),
        };
    }
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
