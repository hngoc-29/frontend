'use client'
import React, { useState, useEffect, useContext } from 'react';
import { useToast } from '../../context/Toast';
import { UserContext } from '../../context/UserContext';
import { getUserInfo } from '../utils/getUserInfo';
import { checkToken } from '../../components/TokenRefresher';
import Image from 'next/image';

export default function Modal({ isOpen, onClose, content }) {
  const { addToast } = useToast();
  const { setUser } = useContext(UserContext);
  const [inputValue, setInputValue] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  useEffect(() => {
    if (content && content.body) {
      setInputValue(content.body.props.children);
    }
  }, [content]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter((prev) => prev + 1);
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter((prev) => {
      const newCounter = prev - 1;
      if (newCounter <= 0) {
        setIsDragging(false);
        return 0;
      }
      return newCounter;
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setDragCounter(0);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(URL.createObjectURL(file));
      setImageFile(file);
    } else {
      addToast({
        type: 'error',
        title: 'Lỗi ảnh',
        description: 'File không hợp lệ. Vui lòng kéo một file ảnh.'
      });
    }
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await checkToken();
      let response;
      const formData = new FormData();
      formData.append('id', content.id);

      if (content.title.toLowerCase().includes('ảnh đại diện')) {
        formData.append('image', imageFile);
      } else {
        formData.append(content.path, inputValue);
      }

      response = await fetch('/api/user/updateUser', {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        addToast({
          type: 'error',
          title: 'Cập nhật',
          description: errorData?.message || 'Có lỗi xảy ra'
        });
        throw new Error(errorData.message);
      }

      const responseData = await response.json();
      addToast({
        type: 'success',
        title: 'Cập nhật',
        description: responseData?.message
      });

      // Fetch updated user data
      const userData = await getUserInfo();
      setUser(userData);
      onClose();
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Cập nhật',
        description: error.message || 'Có lỗi xảy ra'
      });
      console.error('Error updating user:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-[100]"
    >
      {isDragging && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-75 z-[101] transition-opacity duration-300">
          <p className="text-white text-lg">Thả ảnh vào đây</p>
        </div>
      )}
      <div className="bg-white p-5 rounded-lg shadow-lg w-1/2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{content?.title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center" disabled={isLoading}>
            <span className="text-2xl">&times;</span>
          </button>
        </div>
        <div className="mb-4">
          {content?.title?.toLowerCase().includes('ảnh đại diện') ? (
            <>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-2 mb-2 border border-gray-300 rounded-lg"
                disabled={isLoading}
              />
              {selectedImage && (
                <Image
                  src={selectedImage}
                  alt="Selected"
                  width={128}
                  height={128}
                  className="w-32 h-32 rounded-full mx-auto"
                />
              )}
            </>
          ) : (
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              disabled={isLoading}
            />
          )}
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
  );
}
