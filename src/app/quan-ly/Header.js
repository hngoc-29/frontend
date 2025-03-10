import Link from 'next/link';

export default function Header() {
    return (
        <header className="bg-gradient-to-r from-teal-400 to-blue-500 text-white p-4 fixed top-0 left-0 w-full z-50 flex justify-between items-center">
            <h1 className="text-xl font-bold">Quản lý</h1>
            <nav className="mt-2">
                <ul className="flex space-x-4">
                    <li>
                        <Link href="/quan-ly/users">
                            <span className="hover:underline">Users</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/quan-ly/thumbnails">
                            <span className="hover:underline">Thumbnails</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/quan-ly/sings">
                            <span className="hover:underline">Sings</span>
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}