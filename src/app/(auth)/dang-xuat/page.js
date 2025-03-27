// Add metadata
export const metadata = {
  title: 'Đăng Xuất',
  description: 'Trang đăng xuất cho ứng dụng của bạn',
};

const DangXuat = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  try {
    const response = await fetch(baseUrl + '/api/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return;
  }
  return (
    <></>
  )
}
export default DangXuat;