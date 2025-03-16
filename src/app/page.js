import ListThumbnail from '../components/ListThumbnail';

// Add metadata
export const metadata = {
  title: 'Trang Chủ',
  description: 'Trang chủ của ứng dụng của bạn',
};

export default function Home() {
  return (
    <div className='p-5 overflow-auto'>
      <ListThumbnail />
    </div>
  );
}