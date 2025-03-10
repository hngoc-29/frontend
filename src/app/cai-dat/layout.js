export const metadata = {
    title: "Cài đặt - App Nghe Nhạc",
    description:
        "Trang cài đặt của App Nghe Nhạc, nơi bạn quản lý cấu hình, thông tin cá nhân và quyền riêng tư.",
    keywords: ["cài đặt", "settings", "app nghe nhạc", "quản lý", "tùy chỉnh"],
    openGraph: {
        title: "Cài đặt - App Nghe Nhạc",
        description:
            "Quản lý cài đặt, cấu hình và thông tin cá nhân trên App Nghe Nhạc.",
        url: "https://your-music-app-domain.com/settings",
        siteName: "App Nghe Nhạc",
        images: [
            {
                url: "https://thienvu.com.vn/image/catalog/top-ung-dung-nghe-nhac-thoa-thich-khong-can-mang/top-ung-dung-nghe-nhac-hay-nhat-hien-nay.jpg",
                width: 1200,
                height: 630,
                alt: "Cài đặt App Nghe Nhạc",
            },
        ],
        locale: "vi_VN",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Cài đặt - App Nghe Nhạc",
        description:
            "Quản lý cài đặt, thông tin cá nhân và quyền riêng tư trên App Nghe Nhạc.",
        images: [
            "https://thienvu.com.vn/image/catalog/top-ung-dung-nghe-nhac-thoa-thich-khong-can-mang/top-ung-dung-nghe-nhac-hay-nhat-hien-nay.jpg",
        ],
    },
    metadataBase: new URL("https://your-music-app-domain.com"),
};

export default function SettingsPage({ children }) {
    return (
        <main>{children}</main>
    );
}
