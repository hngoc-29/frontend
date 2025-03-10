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
import { Visibility, PlayArrow } from '@mui/icons-material';
const ListThumbnail = () => {
  const {
    addToast
  } = useToast();
  const {
    thumbnail,
    setThumbnail
  } = useContext(thumbnailContext);
  useEffect(() => {
    const getThumbnail = async () => {
      const res = await fetch('/api/thumbnails');
      const thumbnails = await res.json();
      if (!thumbnails.success) return addToast({
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
      <div className='mt-5 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
        {thumbnail.map(item => (
          <div key={item._id} className='cursor-pointer group relative flex flex-col my-2 bg-white shadow-sm border border-slate-200 rounded-lg max-w-50 hover:shadow-lg transition-shadow duration-300 select-none'>
            <Link href={`/${item._id}`}>
              <div className='relative h-40 overflow-hidden text-white rounded-t-lg'>
                <img className='transition-transform duration-500 ease-[cubic-bezier(0.25, 1, 0.5, 1)] transform group-hover:scale-110 w-full h-full object-cover'
                  src={item.image_url} alt={item.title} />
              </div>
              <div className='p-2 pb-0'>
                <h6 className='mb-2 text-slate-800 text-xl font-semibold'>{item.title}</h6>
              </div>
              <div className='px-2 pb-2 mt-2'>
                <div className='flex justify-between py-3'>
                  <div className='flex'>
                    <Visibility />
                    <span className='ml-1'>{item.wiew}</span>
                  </div>
                  <div className='flex'>
                    <PlayArrow />
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