'use client';
import React, { useEffect, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserContext } from '../../context/UserContext';
import { useToast } from '../../context/Toast';

export default function Main() {
    const { user } = useContext(UserContext);
    const { addToast } = useToast();
    const router = useRouter();

    useEffect(() => {
        if (user && user._id && user.role !== 'Admin') {
            addToast({ type: 'error', title: 'Lỗi', description: 'Bạn không có quyền truy cập trang này' });
            router.push('/');
        }
    }, [user]);

    return (
        <div className="z-[500] bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white min-h-screen flex flex-col items-center justify-center user-select-none">
            <h1 className="text-6xl font-bold mb-4">Chào mừng đến với Bảng Quản Lý</h1>
            <p className="text-2xl mb-8">Quản lý người dùng, hình thumbnail và bài hát một cách dễ dàng.</p>
            <div className="flex space-x-4">
                <Link href="/quan-ly/users" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Quản Lý Người Dùng
                </Link>
                <Link href="/quan-ly/thumbnails" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Quản Lý Thumbnail
                </Link>
                <Link href="/quan-ly/sings" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                    Quản Lý Bài Hát
                </Link>
            </div>
        </div>
    );
}
