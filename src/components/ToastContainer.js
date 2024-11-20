'use client'
import {
  useState,
  useEffect
} from 'react';
const icons = {
  success: (
    <svg className='h-6 w-6 text-green-500' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
      <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
    </svg>
  ),
  error: (
    <svg className='h-6 w-6 text-red-500' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
      <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
    </svg>
  ),
  info: (
    <svg className='h-6 w-6 text-blue-500' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
      <path strokeLinecap='round' strokeLinejoin='round' d='M13 16h-1v-4h-1m1-4h.01' />
    </svg>
  ),
  warning: (
    <svg className='h-6 w-6 text-yellow-500' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
      <path strokeLinecap='round' strokeLinejoin='round' d='M12 9v2m0 4h.01M12 5a7 7 0 100 14 7 7 0 000-14z' />
    </svg>
  ),
};

const ToastContainer = ({
  toasts, removeToast
}) => {
  const [visibleToasts,
    setVisibleToasts] = useState([]);
  useEffect(() => {
    setVisibleToasts(toasts);
  }, [toasts]); const handleRemove = (id) => {
    // Gắn cờ 'exiting' vào Toast trước khi xóa
    setVisibleToasts(prev => prev.map(toast => (toast.id === id ? {
      ...toast, exiting: true
    }: toast))); // Xóa Toast khỏi state sau khi animation hoàn tất (khớp với thời gian animation)
    setTimeout(() => removeToast(id), 500);
  };
  return (
    <div className='fixed ml-2 top-4 right-4 space-y-4 z-50 min-w-80'>
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`flex items-start p-4 bg-white shadow-lg rounded-lg border-l-4 ${
          toast.exiting ? 'toast-exit': 'toast-enter'
          }`}
          style={ {
            borderColor:
            toast.type === 'success'
            ? 'green': toast.type === 'error'
            ? 'red': toast.type === 'info'
            ? 'blue': 'yellow',
          }}
          >
          <div className='mr-3 relative to-50% translate-y-[50%]'>
            {icons[toast.type]}
          </div>
          <div>
            <h4 className='font-bold'>{toast.title}</h4>
            <p className='text-sm'>
              {toast.description}
            </p>
          </div>
          <button
            className='ml-auto text-gray-500 text-2xl hover:text-gray-700'
            onClick={() => removeToast(toast.id)}
            >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;