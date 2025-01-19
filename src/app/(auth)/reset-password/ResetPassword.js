'use client'
import Link from 'next/link';
import {
  useState
} from 'react';
import {
  useRouter
} from 'next/navigation';
import InfoEmty from '../../../components/ui/InfoEmty';
import {
  useToast
} from '../../../context/Toast';
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);
    password === submitPassword ? setIsMatch(true) : setIsMatch(false);
    if (!isMatch) return;
    const token = new URLSearchParams(window.location.search).get('token');
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
    console.log(res)
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