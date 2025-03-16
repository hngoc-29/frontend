// Add metadata
export const metadata = {
  title: 'Thông Tin',
  description: 'Trang thông tin của ứng dụng của bạn',
};

const InfoMe = () => {
  return (
    <div className='px-8 py-10 bg-gray-100 min-h-screen'>
      <h1 className='text-center text-4xl font-extrabold mt-5 text-blue-600'>Thông tin</h1>
      <div className='mt-5 text-lg'>
        <p className='mb-2'>
          Facebook: <a href='https://facebook.com/ngoc29FPG' className='underline text-blue-500 hover:text-blue-700'>Huu Ngoc</a>
        </p>
        <p>
          Github: <a href='https://github.com/hngoc-29' className='underline text-blue-500 hover:text-blue-700'>HNgoc</a>
        </p>
      </div>
    </div>
  )
}
export default InfoMe;