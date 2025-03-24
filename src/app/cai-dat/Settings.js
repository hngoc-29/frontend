'use client'
import { useEffect, useContext, useState } from "react";
import { useRouter } from 'next/navigation';
import { UserContext } from "../../context/UserContext";
import { ChevronRightIcon } from '@heroicons/react/solid'; // Importing Heroicons
import Modal from "./Modal"; // Importing Modal for personal information
import Modal2 from "./Modal2"; // Importing Modal2 for security-related information
import Image from 'next/image'; // Importing next/image

export default function Settings() {
  const { user } = useContext(UserContext);
  const router = useRouter();
  const [activeLink, setActiveLink] = useState('thong-tin');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModal2Open, setIsModal2Open] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const handleLinkClick = (link) => {
    setActiveLink(link);
  };
  useEffect(() => {
    if (!user._id) {
      router.push('/dang-nhap');
    }
  }, [user._id]);
  const handleSectionClick = (content, isSecurity = false) => {
    setModalContent(content);
    setIsLoading(true);
    if (isSecurity) {
      setIsModal2Open(true);
    } else {
      setIsModalOpen(true);
    }
    setIsLoading(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  const closeModal2 = () => {
    setIsModal2Open(false);
    setModalContent(null);
  };

  return (
    <div className="settings-container my-10">
      <h1 className="text-2xl font-bold mb-5">Cài đặt</h1>
      <div className="flex gap-4">
        <div className="settings-sidebar w-1/4 p-4 bg-gray-100 rounded-lg shadow-lg border-t border-gray-300">
          <ul>
            <li className="mb-2">
              <a
                href="#"
                className={`flex justify-between items-center p-2 rounded ${activeLink === 'thong-tin' ? 'bg-blue-500 text-white' : 'text-black'} cursor-pointer`}
                onClick={() => handleLinkClick('thong-tin')}
              >
                Thông tin cá nhân
                <ChevronRightIcon className="w-5 h-5" />
              </a>
            </li>
            <li className="mb-2">
              <a
                href="#"
                className={`flex justify-between items-center p-2 rounded ${activeLink === 'bao-mat' ? 'bg-blue-500 text-white' : 'text-black'} cursor-pointer`}
                onClick={() => handleLinkClick('bao-mat')}
              >
                Bảo mật
                <ChevronRightIcon className="w-5 h-5" />
              </a>
            </li>
          </ul>
        </div>
        <div className="settings-content w-3/4 p-4 bg-white rounded-lg shadow-lg border-t border-gray-300">
          {activeLink === 'thong-tin' && (
            <div>
              <h1 className='text-2xl font-semibold mb-3'>Thông tin cá nhân</h1>
              <section
                id="notifications"
                className="cursor-pointer mt-4 p-3 border border-gray-300 rounded-lg text-sm leading-tight flex justify-between items-center"
                onClick={() => handleSectionClick({ id: user._id, title: 'Ảnh đại diện', body: <p>Chọn ảnh đại diện mới</p>, path: 'image' })}
              >
                <div>
                  <h2 className="text-lg font-semibold mb-2">Ảnh đại diện</h2>
                  <Image src={`/api/proxy-image?url=${encodeURIComponent(user?.avata)}`} alt="avatar" className="w-16 h-16 rounded-full" width={64} height={64} />
                </div>
                <ChevronRightIcon className="w-5 h-5" />
              </section>
              <section
                id="account"
                className="cursor-pointer mt-4 p-3 border border-gray-300 rounded-lg text-sm leading-tight flex justify-between items-center"
                onClick={() => handleSectionClick({ id: user._id, title: 'Tên', body: <p>{user.fullname}</p>, path: 'fullname' })}
              >
                <div>
                  <h2 className="text-lg font-semibold mb-2">Tên</h2>
                  <p>{user.fullname}</p>
                </div>
                <ChevronRightIcon className="w-5 h-5" />
              </section>
              <section
                id="account"
                className="cursor-pointer mt-4 p-3 border border-gray-300 rounded-lg text-sm leading-tight flex justify-between items-center"
                onClick={() => handleSectionClick({ id: user._id, title: 'Tài khoản', body: <p>{user.username}</p>, path: 'username' })}
              >
                <div>
                  <h2 className="text-lg font-semibold mb-2">Tài khoản</h2>
                  <p>{user.username}</p>
                </div>
                <ChevronRightIcon className="w-5 h-5" />
              </section>
            </div>
          )}
          {activeLink === 'bao-mat' && (
            <div>
              <h1 className='text-2xl font-semibold mb-3'>Bảo mật</h1>
              <section
                id="account"
                className="cursor-pointer mt-4 p-3 border border-gray-300 rounded-lg text-sm leading-tight flex justify-between items-center"
                onClick={() => handleSectionClick({ id: user._id, title: 'Xác minh tài khoản', body: <p>{user.email}</p> }, true)}
              >
                <div>
                  <h2 className="text-lg font-semibold mb-2">Xác minh tài khoản</h2>
                  <p>Xác minh tài khoản của bạn</p>
                </div>
                <ChevronRightIcon className="w-5 h-5" />
              </section>
              <section
                id="account"
                className="cursor-pointer mt-4 p-3 border border-gray-300 rounded-lg text-sm leading-tight flex justify-between items-center"
                onClick={() => handleSectionClick({ id: user._id, title: 'Đổi mật khẩu', body: <p>Đổi mật khẩu đăng nhập của bạn</p> }, true)}
              >
                <div>
                  <h2 className="text-lg font-semibold mb-2">Đổi mật khẩu</h2>
                  <p>Đổi mật khẩu đăng nhập của bạn</p>
                </div>
                <ChevronRightIcon className="w-5 h-5" />
              </section>
            </div>
          )}
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal} content={modalContent} isLoading={isLoading} />
      <Modal2 isOpen={isModal2Open} onClose={closeModal2} content={modalContent} isLoading={isLoading} />
    </div>
  );
}