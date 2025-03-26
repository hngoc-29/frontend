export const metadata = {
    title: "Cài đặt - App Nghe Nhạc",
    description:
        "Trang cài đặt của App Nghe Nhạc, nơi bạn quản lý cấu hình, thông tin cá nhân và quyền riêng tư.",
    keywords: ["cài đặt", "settings", "app nghe nhạc", "quản lý", "tùy chỉnh"],
    openGraph: {
        title: "Cài đặt - App Nghe Nhạc",
        description:
            "Quản lý cài đặt, cấu hình và thông tin cá nhân trên App Nghe Nhạc.",
        url: process.env.BASE_URL + "/cai-dat",
        siteName: "App Nghe Nhạc",
        images: [
            {
                url: "/images/thumbnail.jpg",
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
            "/images/thumbnail.jpg",
        ],
    },
    metadataBase: new URL(process.env.BASE_URL),
};

export default function SettingsPage({ children }) {
    return (
        <main>{children}</main>
    );
}
