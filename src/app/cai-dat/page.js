import Settings from "./Settings";

// Add metadata
export const metadata = {
  title: 'Cài Đặt',
  description: 'Trang cài đặt cho ứng dụng của bạn',
};

export default function page() {
  return (
    <div className="mx-5">
      <Settings />
    </div>
  )
}
