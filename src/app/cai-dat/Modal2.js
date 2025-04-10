'use client'
import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/Toast';
import { checkToken } from '../../components/TokenRefresher';

export default function Modal2({ isOpen, onClose, content, setIsOpen, setIsVerifyModalOpen }) {
  const { addToast } = useToast();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    try {
      await checkToken(); // Check and refresh token if needed
      if (content.title.toLowerCase().includes('mật khẩu')) {
        if (newPassword !== confirmPassword) {
          setError('Mật khẩu mới và xác nhận mật khẩu không khớp');
          setIsLoading(false);
          return;
        }
        const response = await fetch('/api/user/updatePassword', {
          method: 'PUT',
          headers: {
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
        setIsOpen(false);
        setIsVerifyModalOpen(true);
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Cập nhật',
        description: error.message || 'Có lỗi xảy ra'
      });
      console.error('Error:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-[100]">
        <div className="bg-white p-5 rounded-lg shadow-lg w-1/2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{content?.title}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center" disabled={isLoading}>
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
                  disabled={isLoading}
                />
                <input
                  type="password"
                  name="newPassword"
                  placeholder="Mật khẩu mới"
                  value={newPassword}
                  onChange={handlePasswordChange}
                  className="w-full p-2 mb-2 border border-gray-300 rounded-lg"
                  disabled={isLoading}
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Xác nhận mật khẩu mới"
                  value={confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full p-2 mb-2 border border-gray-300 rounded-lg"
                  disabled={isLoading}
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
                disabled={isLoading}
              />
            ) : null}
          </div>
          <div className="flex justify-end">
            <button onClick={handleConfirm} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center" disabled={isLoading}>
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
              ) : 'Xác nhận'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}