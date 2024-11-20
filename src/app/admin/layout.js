// app/admin/layout.js
import {
  Inter
} from 'next/font/google';
const inter = Inter( {
  subsets: ['latin']
});
const AdminLayout = ({
  children
}) => {
  return (
    <html lang="vi">
    <body className={inter.className}>
      <main>{children}</main>
    </body>
  </html>
  );
}

export default AdminLayout;