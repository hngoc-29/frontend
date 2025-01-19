import "./globals.css";
import {
  Inter
} from 'next/font/google';
import Header from '../components/Header';
import Bottom from '../components/Bottom';
import Loading from '../components/Loading';
import TokenRefresher from '../components/TokenRefresher';
import {
  GetPath
} from '../context/GetPath';
import {
  LoadingProvider
} from '../context/Loading';
import {
  UserProvider
} from '../context/UserContext';
import {
  ThumbnailProvider
} from '../context/Thumbnails';
import {
  ToastProvider
} from '../context/Toast';
const inter = Inter({
  subsets: ['latin']
});
export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children
}) {
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