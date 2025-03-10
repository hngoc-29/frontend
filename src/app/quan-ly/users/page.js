import UserManager from './UserManager';

// Add metadata
export const metadata = {
    title: 'Quản Lý Người Dùng',
    description: 'Trang quản lý người dùng cho ứng dụng của bạn',
};

export default function UsersPage() {
    return (
        <div className="p-5 bg-gray-100 font-sans">
            <h1 className="text-2xl text-gray-800 mb-5">Trang Quản Lý Người Dùng</h1>
            <div className="bg-white p-5 rounded-lg shadow-md">
                <UserManager />
            </div>
        </div>
    );
}
