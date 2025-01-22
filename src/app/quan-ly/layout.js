import React from 'react';
import Header from '../../components/Header'; // Import your custom header component

export const metadata = {
    title: "Quản lý",
    description: "Trang quản lý",
};

export default function ManagementLayout({ children }) {
    return (
        <html lang="vi">
            <body>
                <Header /> {/* Custom header */}
                <main className="p-4">
                    {children}
                </main>
            </body>
        </html>
    );
}