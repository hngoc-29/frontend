import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/Toast';
import VerifyCodeModal from '../../components/VerifyCodeModal';

export default function Modal2({ isOpen, onClose, content }) {
  const { addToast } = useToast();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

  useEffect(() => {
    if (content && content.body) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setEmail(content.body.props.children);
      setError('');
    }
  }, [content]);

  if (!isOpen) return null;

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    if (name === 'currentPassword') setCurrentPassword(value);
    if (name === 'newPassword') setNewPassword(value);
    if (name === 'confirmPassword') setConfirmPassword(value);
  };

  const handleConfirm = async () => {
    try {
      if (content.title.toLowerCase().includes('mật khẩu')) {
        if (newPassword !== confirmPassword) {
          setError('Mật khẩu mới và xác nhận mật khẩu không khớp');
          return;
        }
        const response = await fetch('/api/updatePassword', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${document.cookie.split('; ').find(row => row.startsWith('access_token')).split('=')[1]}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: content.id, passIn: currentPassword, password: newPassword }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          addToast({
            type: 'error',
            title: 'Cập nhật mật khẩu',
            description: errorData?.message || 'Có lỗi xảy ra'
          });
          throw new Error(errorData.message);
        }

        const responseData = await response.json();
        addToast({
          type: 'success',
          title: 'Cập nhật mật khẩu',
          description: responseData?.message
        });
      } else if (content.title.toLowerCase().includes('xác minh tài khoản')) {
        const response = await fetch('/api/user/newCode', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${document.cookie.split('; ').find(row => row.startsWith('access_token')).split('=')[1]}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: content.id }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          addToast({
            type: 'error',
            title: 'Tạo mã xác minh',
            description: errorData?.message || 'Có lỗi xảy ra'
          });
          throw new Error(errorData.message);
        }

        const responseData = await response.json();
        addToast({
          type: 'success',
          title: 'Tạo mã xác minh',
          description: responseData?.message
        });

        // Open the verify code modal
        setIsVerifyModalOpen(true);
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Cập nhật',
        description: error.message || 'Có lỗi xảy ra'
      });
      console.error('Error:', error.message);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-5 rounded-lg shadow-lg w-1/2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{content?.title}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center">
              <span className="text-2xl">&times;</span>
            </button>
          </div>
          <div className="mb-4">
            {content?.title?.toLowerCase().includes('mật khẩu') ? (
              <>
                <input
                  type="password"
                  name="currentPassword"
                  placeholder="Mật khẩu hiện tại"
                  value={currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full p-2 mb-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="password"
                  name="newPassword"
                  placeholder="Mật khẩu mới"
                  value={newPassword}
                  onChange={handlePasswordChange}
                  className="w-full p-2 mb-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Xác nhận mật khẩu mới"
                  value={confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full p-2 mb-2 border border-gray-300 rounded-lg"
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </>
            ) : content?.title?.toLowerCase().includes('xác minh tài khoản') ? (
              <input
                type="email"
                placeholder="Email"
                value={email}
                readOnly
                className="w-full p-2 mb-2 border border-gray-300 rounded-lg bg-gray-100"
              />
            ) : null}
          </div>
          <div className="flex justify-end">
            <button onClick={handleConfirm} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
              Xác nhận
            </button>
          </div>
        </div>
      </div>
      {isVerifyModalOpen && <VerifyCodeModal isOpen={isVerifyModalOpen} onClose={() => setIsVerifyModalOpen(false)} userId={content.id} />}
    </>
  );
}