'use client'
import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { useToast } from '../../context/Toast';

const NavMenu = ({ element, setShowMenu }) => {
  const { addToast } = useToast();
  const { setUser } = useContext(UserContext);

  const handleLogout = async () => {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      return addToast({
        type: 'error',
        title: 'Đăng xuất',
        description: 'Đăng xuất thất bại',
      });
    }
    addToast({
      type: 'success',
      title: 'Đăng xuất',
      description: 'Đăng xuất thành công',
    });
    setUser({});
  };

  return (
    <div>
      <ul className='text-[#666] text-sm select-none'>
        {element.map((item, index) => (
          <div key={index}>
            <div className='w-full h-[1px] bg-[rgba(0,0,0,0.1)]' />
            <li onClick={() => setShowMenu(false)} className='py-5 hover:text-black'>
              <Link href={item.path}>{item.title}</Link>
            </li>
          </div>
        ))}
        <div>
          <div className='w-full h-[1px] bg-[rgba(0,0,0,0.1)]' />
          <li className='py-5 hover:text-black' onClick={handleLogout}>Đăng xuất</li>
        </div>
      </ul>
    </div>
  );
};

export default NavMenu;