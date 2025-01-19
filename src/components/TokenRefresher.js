'use client';
import { useEffect } from 'react';

export default function TokenRefresher() {
  useEffect(() => {
    const checkToken = async () => {
      const accessToken = document.cookie.split('; ').find(row => row.startsWith('access_token='));

      if (accessToken) {
        const tokenValue = accessToken.split('=')[1];
        const decodeToken = parseJwt(tokenValue);
        const tokenExpiry = decodeToken.exp * 1000; // Giả sử token là JWT và có trường `exp`
        const timeLeft = tokenExpiry - Date.now();
        if (timeLeft < 60 * 60 * 1000) {
          await fetch('/api/auth/refresh-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'id': decodeToken._id,
            },
          });
        }
      }
    };

    const intervalId = setInterval(checkToken, 15 * 60 * 1000); // Kiểm tra mỗi 15 phút
    return () => clearInterval(intervalId);
  }, []);

  return null;
}

// Hàm để parse JWT và lấy thời gian hết hạn
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(decodeURIComponent(atob(base64).split('').map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`).join('')));
  } catch (e) {
    return null;
  }
}
