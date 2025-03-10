// Add metadata
export const metadata = {
  title: 'Đăng Xuất',
  description: 'Trang đăng xuất cho ứng dụng của bạn',
};

const DangXuat = async () => {

  const response = await fetch('/api/auth/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  return (
    <></>
  )
}
export default DangXuat;