'use client'
import Link from 'next/link';
import { useContext } from 'react';
import { pathContext } from '../context/GetPath';

const Bottom = () => {
  const pathname = useContext(pathContext);
  const nav = [
    {
      title: 'Trang chủ',
      link: '/',
      fill: '#5f6368',
      path: 'M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z'
    },
    {
      title: 'Thông tin',
      link: '/thong-tin',
      fill: '#5f6368',
      path: 'M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z'
    }
  ];

  if (pathname.includes('quan-ly')) {
    return null;
  }

  return (
    <div>
      <nav className='bottom-nav fixed bottom-0 left-0 right-0 h-[60px] shadow-[0_-1px_2px_rgba(0,0,0,0.05)] flex items-center justify-around z-50 bg-white'>
        {nav.map((item, index) => (
          <div key={index} className={pathname === item.link ? 'text-blue-400' : ''}>
            <Link href={item.link}>
              <span className='flex items-center justify-center flex-col'>
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 -960 960 960" fill={pathname === item.link ? '#60A5FA' : '#00000'}>
                  <path d={item.path}></path>
                </svg>
                {item.title}
              </span>
            </Link>
          </div>
        ))}
      </nav>
    </div>
  );
}

export default Bottom;