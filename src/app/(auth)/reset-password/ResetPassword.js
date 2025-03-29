'use client'
import {
  useState, useEffect
} from 'react';
import {
  useRouter
} from 'next/navigation';
import InfoEmty from '../../../components/ui/InfoEmty';
import {
  useToast
} from '../../../context/Toast';
import { jwtDecode } from 'jwt-decode';
export const dynamic = "force-dynamic";
const ResetPassWord = () => {
  const { addToast } = useToast();
  const router = useRouter();
  const [password,
    setPassword] = useState('');
  const [submitPassword,
    setSubmitPassword] = useState('');
  const [isSubmit,
    setIsSubmit] = useState(false);
  const [isMatch,
    setIsMatch] = useState(true);
  const [token, setToken] = useState(null);
  const [isTokenValid, setIsTokenValid] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tokenFromUrl = new URLSearchParams(window.location.search).get('token');
      setToken(tokenFromUrl);

      try {
        const decodedToken = jwtDecode(tokenFromUrl);
        if (decodedToken.exp * 1000 < Date.now()) {
          setIsTokenValid(false);
        }
      } catch (error) {
        setIsTokenValid(false);
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);

    if (!password.trim() || !submitPassword.trim()) {
      return addToast({
        type: 'error',
        title: 'Thay đổi mật khẩu',
        description: 'Vui lòng điền đầy đủ thông tin'
      });
    }

    if (password !== submitPassword) {
      setIsMatch(false);
      return;
    }

    setIsMatch(true);

    const res = await fetch('/api/user/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token,
        password
      })
    });
    const data = await res.json();
    if (!res.ok) return addToast({
      type: 'error',
      title: 'Thay đổi mật khẩu',
      description: data?.message
    });
    addToast({
      type: 'success',
      title: 'Thay đổi mật khẩu',
      description: data?.message
    });
    router.push('/dang-nhap');
  };

  if (!isTokenValid) {
    return (
      <div className='flex flex-col items-center h-screen'>
        <div className='text-center absolute top-44'>
          <h1 className='text-2xl font-bold'>Token đã hết hạn.</h1>
          <p className='mt-2'>Vui lòng gửi lại link.</p>
          <button
            className='mt-4 px-4 py-2 bg-blue-500 text-white rounded'
            onClick={() => router.push('/quen-mat-khau')}
          >
            Quên Mật khẩu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='mx-5'>
      <h1 className='text-center font-bold text-3xl mt-[50px]'>Quên mật khẩu</h1>
      <form className='space-y-2 mt-2' onSubmit={handleSubmit}>
        <div>
          <label htmlFor='password'>Mật khẩu</label>
          <input className='w-full p-2 border border-solid border-current rounded' type='text' placeholder='Nhập mật khẩu mới' id='password' name='password' value={password} onChange={e => setPassword(e.target.value)} />
          {isSubmit && !password && <InfoEmty type={'Mật khẩu mới'} />}
        </div>
        <div>
          <label htmlFor='submitPassword'>Nhập lại mật khẩu</label>
          <input className='w-full p-2 border border-solid border-current rounded' type='text' placeholder='Nhập lại mật khẩu' id='submitPassword' name='submitPassword' value={submitPassword} onChange={e => setSubmitPassword(e.target.value)} />
          {isSubmit && !submitPassword && <InfoEmty type={'Xác nhận mật khẩu'} />}
          {isSubmit && !isMatch && <div className='text-[red] mt-1 text-sm'>
            Không khớp với mật khẩu.
          </div>
          }
        </div>
        <div>
          <button className='w-full bg-blue-400 py-2 rounded text-white'>Xác nhận</button>
        </div>
      </form>
    </div>
  );
}
export default ResetPassWord;