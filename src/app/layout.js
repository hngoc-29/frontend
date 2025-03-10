import "./globals.css";
import { Inter } from 'next/font/google';
import Header from '../components/Header';
import Bottom from '../components/Bottom';
import Loading from '../components/Loading';
import TokenRefresher from '../components/TokenRefresher';
import { GetPath } from '../context/GetPath';
import { LoadingProvider } from '../context/Loading';
import { UserProvider } from '../context/UserContext';
import { ThumbnailProvider } from '../context/Thumbnails';
import { ToastProvider } from '../context/Toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: {
    default: "App Nghe Nhạc - Trải nghiệm âm nhạc trực tuyến",
    template: "%s | App Nghe Nhạc",
    verification: {
      google: "exKzkXXkfCbBRohkUy2ptqVdT9oa8jqNnGSp2cY2m-Y",
    },
  },
  description:
    "Khám phá kho bài hát phong phú, giao diện hiện đại và các tính năng thông minh. Thưởng thức âm nhạc mọi lúc, mọi nơi cùng App Nghe Nhạc.",
  keywords: [
    "nghe nhạc",
    "music streaming",
    "app nghe nhạc",
    "playlist",
    "audio",
    "âm nhạc trực tuyến",
  ],
  openGraph: {
    title: "App Nghe Nhạc - Trải nghiệm âm nhạc trực tuyến",
    description:
      "Khám phá kho bài hát phong phú với giao diện hiện đại và tính năng tìm kiếm thông minh. Thưởng thức âm nhạc trực tuyến dễ dàng.",
    url: "https://your-music-app-domain.com",
    siteName: "App Nghe Nhạc",
    images: [
      {
        // Đây là link trực tiếp đến file ảnh từ Pixabay (đảm bảo định dạng và kích thước phù hợp)
        url: "https://thienvu.com.vn/image/catalog/top-ung-dung-nghe-nhac-thoa-thich-khong-can-mang/top-ung-dung-nghe-nhac-hay-nhat-hien-nay.jpg",
        width: 1200,
        height: 630,
        alt: "Tai nghe & Bộ phát nhạc",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "App Nghe Nhạc - Trải nghiệm âm nhạc trực tuyến",
    description:
      "Thưởng thức âm nhạc mọi lúc, mọi nơi với kho bài hát phong phú và giao diện hiện đại.",
    images: [
      "https://thienvu.com.vn/image/catalog/top-ung-dung-nghe-nhac-thoa-thich-khong-can-mang/top-ung-dung-nghe-nhac-hay-nhat-hien-nay.jpg",
    ],
  },
  metadataBase: new URL("https://your-music-app-domain.com"),
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <UserProvider>
          <ToastProvider>
            <LoadingProvider>
              <Loading />
              <Header />
              <TokenRefresher />
              <div className='py-[60px]'>
                <ThumbnailProvider>
                  <main className='overflow-auto'>{children}</main>
                </ThumbnailProvider>
              </div>
              <GetPath>
                <Bottom />
              </GetPath>
            </LoadingProvider>
          </ToastProvider>
        </UserProvider>
      </body>
    </html>
  );
}