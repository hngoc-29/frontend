import SingManager from './SingManager';

// Add metadata
export const metadata = {
    title: 'Quản Lý Sing',
    description: 'Trang quản lý sing cho ứng dụng của bạn',
};

export default function SingsPage() {
    return (
        <div className="p-5 bg-gray-100 font-sans">
            <h1 className="text-2xl text-gray-800 mb-5">Trang Quản Lý Sing</h1>
            <div className="bg-white p-5 rounded-lg shadow-md">
                <SingManager />
            </div>
        </div>
    );
}
