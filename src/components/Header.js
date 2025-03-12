'use client'
import Link from 'next/link';
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

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const token = document.cookie;
      if (!(token.startsWith('access_token') || token.startsWith('refresh_token'))) {
        setLoading(false);
        return;
      }
      try {
        // Wait for token refresh if needed
        await checkToken();
        const response = await fetch('/api/user/get-user');
        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }
        const data = await response.json();
        setUser(data);
      } catch (err) {
        addToast({ type: 'error', title: 'Lỗi', description: 'Không thể lấy thông tin người dùng' });
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (user.role === 'Admin') {
    element.push({ title: 'Quản lý', path: '/quan-ly' });
  }

  return (
    <div>
      <header className='fixed top-0 left-0 right-0 h-[60px] shadow-sm flex items-center justify-between px-[20px] z-50 bg-white'>
        <div>
          <Link href='/'>
            <img className='w-8' src='https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Vitejs-logo.svg/1200px-Vitejs-logo.svg.png' />
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
            <img onClick={() => setShowMenu(!showMenu)} src={user.avata} className='cursor-pointer h-12 w-12 rounded-[50%]' />
            {showMenu && (
              <div className='fixed mt-[2px] right-6 px-5 pt-5 rounded-lg bg-white shadow shadow-[rgba(0,0,0,0.1)]'>
                <div>
                  <div className='flex pr-4 select-none'>
                    <img src={user.avata} className='w-14 h-14 rounded-[50%]' />
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