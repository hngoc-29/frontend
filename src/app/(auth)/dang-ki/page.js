import Link from 'next/link';
import RegisterForm from './RegisterForm';

// Add metadata
export const metadata = {
  title: 'Đăng Kí',
  description: 'Trang đăng kí cho ứng dụng của bạn',
};

const dangKi = () => {
  return (
    <>
      <RegisterForm />
    </>
  );
}
export default dangKi;