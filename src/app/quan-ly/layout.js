import Header from './Header'; // Import your custom header component

export const metadata = {
    title: "Quản lý",
    description: "Trang quản lý",
};

export default function ManagementLayout({ children }) {
    return (
        <>
            <Header /> {/* Custom header */}
            <main className="p-4">
                {children}
            </main>
        </>
    );
}