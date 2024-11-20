'use client'
import Link from 'next/link';
import {
  useEffect,
  useContext
} from 'react';
import {
  thumbnailContext
} from '../context/Thumbnails';
import {
  useToast
} from '../context/Toast';
const ListThumbnail = () => {
  const {
    addToast
  } = useToast();
  const {
    thumbnail,
    setThumbnail
  } = useContext(thumbnailContext);
  useEffect(() => {
    const getThumbnail = async() => {
      const res = await fetch('/api/thumbnails');
      const thumbnails = await res.json();
      if (!thumbnails.success) return addToast( {
        type: 'error',
        title: 'Thumbnail',
        description: thumbnails.error?.message || 'Có lỗi xảy ra'
      });
      setThumbnail(thumbnails?.thumbnails);
    }
    getThumbnail();
  }, [])
  return (
    <div>
      <h1 className='text-3xl font-bold text-center'>Danh sách nhạc</h1>
      <div className='mt-5 grid grid-cols-2 gap-x-2 gap-y-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'>
        {thumbnail.map(item => (
          <div key={item._id} className='cursor-pointer group relative flex flex-col my-2 bg-white shadow-sm border border-slate-200 rounded-lg max-w-50 hover:shadow-lg transition-shadow duration-300 select-none'>
            <Link href={`/${item._id}`}>
              <div className='relative h-30 overflow-hidden text-white rounded-t-lg'>
                <img className='transition-transform duration-500 ease-[cubic-bezier(0.25, 1, 0.5, 1)] transform group-hover:scale-110'
                src={item.image_url} alt={item.title} />
            </div>
            <div className='p-2 pb-0'>
              <h6 className='mb-2 text-slate-800 text-xl font-semibold'>{item.title}</h6>
            </div>
            <div className='px-2 pb-2 mt-2'>
              <div className='flex justify-between py-3'>
                <div className='flex'>
                  <svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 -960 960 960' width='24px' fill='#000000'><path d='M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z' /></svg>
                  <span className='ml-1'>{item.wiew}</span>
                </div>
                <div className='flex'>
                  <svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 -960 960 960' width='24px' fill='#000000'><path d='m380-300 280-180-280-180v360ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z' /></svg>
                  <span className='ml-1'>{item.quantity}</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
        ))}
    </div>
  </div>
);
}
export default ListThumbnail;