import "./globals.css";
import { Inter } from 'next/font/google';
import Header from '../components/Header';
import Bottom from '../components/Bottom';
import Loading from '../components/Loading';
import TokenRefresher, { checkToken } from '../components/TokenRefresher';
import { GetPath } from '../context/GetPath';
import { LoadingProvider } from '../context/Loading';
import { UserProvider } from '../context/UserContext';
import { ThumbnailProvider } from '../context/Thumbnails';
import { ToastProvider } from '../context/Toast';
import FloatingAudioPlayer from '../components/FloatingAudioPlayer';
import { GlobalAudioProvider } from '../context/GlobalAudioContext';

const inter = Inter({ subsets: ['latin'] });

export const dynamic = "force-static";

export const metadata = {
  title: {
    default: "App Nghe Nhạc - Trải nghiệm âm nhạc trực tuyến",
    template: "%s | App Nghe Nhạc",
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
  verification: {
    google: "exKzkXXkfCbBRohkUy2ptqVdT9oa8jqNnGSp2cY2m-Y", // Đặt đúng vị trí ở đây
  },
  openGraph: {
    title: "App Nghe Nhạc - Trải nghiệm âm nhạc trực tuyến",
    description:
      "Khám phá kho bài hát phong phú với giao diện hiện đại và tính năng tìm kiếm thông minh. Thưởng thức âm nhạc trực tuyến dễ dàng.",
    url: process.env.BASE_URL || `https://next-app-music.vercel.app`,
    siteName: "App Nghe Nhạc",
    images: [
      {
        url: "/images/thumbnail.jpg",
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
      "/images/thumbnail.jpg",
    ],
  },
  metadataBase: new URL(process.env.BASE_URL || "https://next-app-music.vercel.app"),
};

export default async function RootLayout({ children }) {
  return (
    <html lang="vi" className="bg-gray-100 text-gray-900 h-full">
      <head>
      </head>
      <body className={`${inter.className} bg-gray-100 text-gray-900 h-full`}>
        <ToastProvider>
          <GlobalAudioProvider>
            <UserProvider>
              <LoadingProvider>
                <Loading />
                <TokenRefresher />
                <Header />
                <div className='maindiv py-[60px] bg-gray-100 text-gray-900 min-h-screen'>
                  <ThumbnailProvider>
                    <main className='overflow-auto bg-gray-100 min-h-screen'>{children}</main>
                  </ThumbnailProvider>
                </div>
                <GetPath>
                  <Bottom />
                </GetPath>
              </LoadingProvider>
            </UserProvider>
            <FloatingAudioPlayer />
          </GlobalAudioProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
