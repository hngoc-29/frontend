'use client'
import React, { useState, useEffect } from 'react';
import { useToast } from '../context/Toast';

export default function VerifyCodeModal({ isOpen, onClose, userId }) {
  const { addToast } = useToast();
  const [code, setCode] = useState('');
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    let interval;
    if (isResendDisabled) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(interval);
            setIsResendDisabled(false);
            return 60;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isResendDisabled]);

  if (!isOpen) return null;

  const handleVerify = async () => {
    try {
      const response = await fetch('/api/user/verifyUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: userId, code }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        addToast({
          type: 'error',
          title: 'Xác minh tài khoản',
          description: errorData.message || 'Có lỗi xảy ra',
        });
        throw new Error(errorData.message);
      }

      const responseData = await response.json();
      addToast({
        type: 'success',
        title: 'Xác minh tài khoản',
        description: responseData.message,
      });

      // Close the modal only if the request is successful
      onClose();
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Xác minh tài khoản',
        description: error.message || 'Có lỗi xảy ra',
      });
      console.error('Error verifying user:', error.message);
    }
  };

  const handleResendCode = async () => {
    try {
      setIsResendDisabled(true);
      const response = await fetch('/api/newCode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        addToast({
          type: 'error',
          title: 'Gửi lại mã xác minh',
          description: errorData.message || 'Có lỗi xảy ra',
        });
        throw new Error(errorData.message);
      }

      const responseData = await response.json();
      addToast({
        type: 'success',
        title: 'Gửi lại mã xác minh',
        description: responseData.message,
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Gửi lại mã xác minh',
        description: error.message || 'Có lỗi xảy ra',
      });
      console.error('Error resending code:', error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-5 rounded-lg shadow-lg w-1/2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Nhập mã xác minh</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center">
            <span className="text-2xl">&times;</span>
          </button>
        </div>
        <div className="mb-4">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Nhập mã xác minh"
            className="w-full p-2 mb-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="flex justify-between items-center">
          <button
            onClick={handleResendCode}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            disabled={isResendDisabled}
          >
            {isResendDisabled ? `Gửi lại mã (${timer}s)` : 'Gửi lại mã'}
          </button>
          <button onClick={handleVerify} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}