'use client'
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useContext, useEffect, useState, useRef } from 'react';
import { UserContext } from '../context/UserContext';
import { loadingContext } from '../context/Loading';
import NavMenu from './ui/NavMenu';
import { useToast } from '../context/Toast';
import { useRouter } from 'next/navigation'; // Correct import
import { checkToken } from './TokenRefresher';

const Header = () => {
  const { user, setUser } = useContext(UserContext);
  const { setLoading } = useContext(loadingContext);
  const { addToast } = useToast();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const element = [{ title: 'Cài đặt', path: '/cai-dat' }];
  const router = useRouter();
  const pathname = usePathname();

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    if (typeof window !== `undefined`) document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const checkPath = () => {
      if (pathname.includes('/quan-ly') || pathname.includes('/cai-dat') || pathname.includes('/danh-sach-phat')) {
        router.push('/');
      }
    }
    const fetchUser = async () => {
      try {
        // Wait for token refresh if needed
        const isToken = await checkToken();
        if (!isToken) {
          checkPath();
          setUser({});
          setLoading(false);
          return;
        }
        const response = await fetch('/api/user/get-user');
        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }
        const data = await response.json();
        setUser(data);
      } catch (err) {
        checkPath();
        setUser({});
        console.error(err);
        addToast({ type: 'error', title: 'Lỗi', description: 'Không thể lấy thông tin người dùng' });
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (user.role !== `Member`) {
    element.push({ title: 'Quản lý', path: '/quan-ly' });
  }

  useEffect(() => {
    setShowMenu(false);
  }, [pathname])


  return (
    <div>
      <header className='fixed top-0 left-0 right-0 h-[60px] shadow-sm flex items-center justify-between px-[20px] z-50 bg-white text-gray-900'>
        <div>
          <Link href='/'>
            <Image alt='logo' className='w-8' src={`/api/proxy-image?url=${encodeURIComponent(`https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Vitejs-logo.svg/1200px-Vitejs-logo.svg.png`)}`} width={32} height={32} />
          </Link>
        </div>
        {!user._id ? (
          <div>
            <Link href='/dang-nhap'>
              <button className='px-[20px] py-[6px] bg-blue-400 rounded-full text-white'>Đăng nhập</button>
            </Link>
          </div>
        ) : (
          <div className='relative' ref={menuRef}>
            <Image alt='menu' onClick={() => setShowMenu(!showMenu)} src={`/api/proxy-image?url=${encodeURIComponent(user.avata)}`} className='cursor-pointer h-12 w-12 rounded-[50%]' width={48} height={48} />
            {showMenu && (
              <div className='fixed mt-[2px] right-6 px-5 pt-5 rounded-lg bg-white shadow shadow-[rgba(0,0,0,0.1)]'>
                <div>
                  <div className='flex pr-4 select-none'>
                    <Image alt='user avatar' src={`/api/proxy-image?url=${encodeURIComponent(user.avata)}`} className='w-14 h-14 rounded-[50%]' width={56} height={56} />
                    <div className='ml-5'>
                      <h3 className='font-bold text-lg'>{user.fullname}</h3>
                      <span className='text-[#666]'>@{user.username}</span>
                    </div>
                  </div>
                  <div className='mt-5'>
                    <NavMenu element={element} setShowMenu={setShowMenu} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </header>
    </div>
  );
};

export default Header;