'use client'
import Link from 'next/link';
import {
  useRouter
} from 'next/navigation';
import {
  useState,
  useContext,
  useEffect
} from 'react';
import InfoEmty from '../../../components/ui/InfoEmty';
import {
  UserContext
} from '../../../context/UserContext';
import {
  useToast
} from '../../../context/Toast';
const Login = () => {
  const { addToast } = useToast();
  const [email,
    setEmail] = useState('');
  const [password,
    setPassword] = useState('');
  const [isSubmit,
    setIsSubmit] = useState(false);
  const {
    user,
    setUser
  } = useContext(UserContext);
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);

    if (!email || !password) {
      return addToast({
        type: 'error',
        title: 'Đăng nhập',
        description: 'Vui lòng điền đầy đủ thông tin'
      });
    }

    const bodyData = {
      email,
      password
    };
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData)
    })
    const data = await response.json();
    if (!response.ok) {
      return addToast({
        type: 'error',
        title: 'Đăng nhập',
        description: data?.message || 'Có lỗi xảy ra'
      });
    }
    setUser(data);
    addToast({
      type: 'success',
      title: 'Đăng nhập',
      description: 'Đăng nhập thành công'
    });
    router.push('/');
  };
  useEffect(() => {
    if (user._id) {
      router.push('/');
    }
  },
    [user?._id]);
  return (
    <div className='mx-5'>
      <h1 className='text-center font-bold text-3xl mt-[50px]'>Đăng nhập</h1>
      <form className='space-y-2' onSubmit={handleSubmit}>
        <div>
          <label htmlFor='email'>Email</label>
          <input className='w-full p-2 border border-solid border-current rounded' type='email' placeholder='Nhập email' id='email' name='email' value={email} onChange={e => setEmail(e.target.value)} />
          {isSubmit && !email && <InfoEmty type='Email' />}
        </div>
        <div>
          <label htmlFor='password'>Mật khẩu</label>
          <input className='w-full p-2 border border-solid border-current rounded' name='password' type="password" placeholder="Nhập mật khẩu" value={password} onChange={e => setPassword(e.target.value)} />
          {isSubmit && !password && <InfoEmty type='Mật khẩu' />}
        </div>
        <div className='text-end'>
          <Link href='/quen-mat-khau'><span className='underline text-[#f05123]'>Quên mật khẩu?</span></Link>
          <Link href='/dang-ki'><span className='underline ml-3 text-[#f05123]'>Đăng kí</span></Link>
        </div>
        <div>
          <button className='w-full bg-blue-400 py-2 rounded text-white'>Đăng nhập</button>
        </div>
      </form>
    </div>
  );
}
export default Login;