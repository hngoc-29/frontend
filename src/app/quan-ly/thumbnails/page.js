import ThumbnailManager from './ThumbnailManager';

// Add metadata
export const metadata = {
    title: 'Quản Lý Thumbnail',
    description: 'Trang quản lý thumbnail cho ứng dụng của bạn',
};

export default function UsersPage() {
    return (
        <div className="p-5 bg-gray-100 font-sans">
            <h1 className="text-2xl text-gray-800 mb-5">Trang Quản Lý Thumbnail</h1>
            <div className="bg-white p-5 rounded-lg shadow-md">
                <ThumbnailManager />
            </div>
        </div>
    );
}
