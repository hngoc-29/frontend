'use client'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  useState,
  useEffect,
  useContext
} from 'react';
import InfoEmty from '../../../components/ui/InfoEmty';
import {
  UserContext
} from '../../../context/UserContext';
import {
  useToast
} from '../../../context/Toast';
const RegisterForm = () => {
  const router = useRouter();
  const { addToast } = useToast();
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user } = useContext(UserContext);
  const [isSubmit,
    setIsSubmit] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);
    const bodyData = {
      fullname,
      username,
      email,
      password,
    }
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData)
    });
    const data = await res.json();
    if (!res?.ok) {
      return addToast({
        type: 'error',
        title: 'Đăng kí',
        description: data || 'Có lỗi xảy ra'
      });
    }
    addToast({
      type: 'success',
      title: 'Đăng nhập',
      description: data || 'Đăng kí thành công'
    });
    router.push('/dang-nhap');
  };
  useEffect(() => {
    if (user._id) {
      router.push('/');
    }
  }, [user?._id]);
  return (
    <div className='mx-5'>
      <h1 className='text-center font-bold text-3xl mt-[50px]'>Đăng kí</h1>
      <form className='space-y-2' onSubmit={handleSubmit}>
        <div>
          <label htmlFor='fullname'>Họ tên</label>
          <input className='w-full p-2 border border-solid border-current rounded' type='text' placeholder='Nhập tên' id='fullname' name='fullname' onChange={e => setFullname(e.target.value)} value={fullname} />
          {isSubmit && !fullname && <InfoEmty type='Họ tên' />}
        </div>
        <div>
          <label htmlFor='username'>Tên người dùng</label>
          <input className='w-full p-2 border border-solid border-current rounded' type='text' placeholder='Nhập tên người dùng' id='username' name='username' onChange={e => setUsername(e.target.value)} value={username} />
          {isSubmit && !username && <InfoEmty type='Tên đăng nhập' />}
        </div>
        <div>
          <label htmlFor='email'>Email</label>
          <input className='w-full p-2 border border-solid border-current rounded' type='email' placeholder='Nhập email' id='email' name='email' onChange={e => setEmail(e.target.value)} value={email} />
          {isSubmit && !email && <InfoEmty type='Email' />}
        </div>
        <div>
          <label htmlFor='password'>Mật khẩu</label>
          <input className='w-full p-2 border border-solid border-current rounded' name='password' type="password" placeholder="Nhập mật khẩu" onChange={e => setPassword(e.target.value)} value={password} />
          {isSubmit && !password && <InfoEmty type='Mật khẩu' />}
        </div>
        <div className='text-end'>
          <Link href='/dang-nhap'>Đã có tài khoản? <span className='underline text-[#f05123]'>Đăng nhập</span></Link>
        </div>
        <div>
          <button className='w-full bg-blue-400 py-2 rounded text-white'>Đăng kí</button>
        </div>
      </form>
    </div>
  );
}
export default RegisterForm;