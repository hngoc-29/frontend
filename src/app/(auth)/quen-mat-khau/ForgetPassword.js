'use client'
import {
  useState, useEffect
} from 'react';
import InfoEmty from '../../../components/ui/InfoEmty';
import { useToast } from '../../../context/Toast';
const QuenMatKhau = () => {
  const { addToast } = useToast();
  const [email,
    setEmail] = useState('');
  const [isSubmit,
    setIsSubmit] = useState(false);
  const [delay, setDelay] = useState(0);

  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => setDelay(delay - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [delay]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (delay > 0) return; // Prevent API call if delay is greater than 0
    setIsSubmit(true);
    const res = await fetch('/api/user/forget', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
    const data = await res.json();
    if (!data.success) {
      setIsSubmit(false);
      return addToast({
        type: 'error',
        title: 'Quên mật khẩu',
        description: data?.message
      });
    }
    addToast({
      type: 'success',
      title: 'Quên mật khẩu',
      description: 'Mã xác nhận đã được gửi đến email của bạn'
    });
    setDelay(60); // Set delay to 60 seconds after API call
  };
  return (
    <div className='mx-5'>
      <h1 className='text-center font-bold text-3xl mt-[50px]'>Quên mật khẩu</h1>
      <form className='space-y-2 mt-2' onSubmit={handleSubmit}>
        <div>
          <label htmlFor='email'>Email</label>
          <input className='w-full p-2 border border-solid border-current rounded' type='email' placeholder='Nhập email' id='email' name='email' value={email} onChange={(e) => setEmail(e.target.value)} />
          {isSubmit && !email && <InfoEmty type='Email' />}
        </div>
        <div>
          <button className={`w-full py-2 rounded text-white ${delay > 0 ? 'bg-gray-400' : 'bg-blue-400'}`} disabled={delay > 0}>
            {delay > 0 ? `${delay}s` : 'Gửi mã'}
          </button>
        </div>
      </form>
    </div>
  );
}
export default QuenMatKhau;