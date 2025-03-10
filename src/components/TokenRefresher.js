'use client';
import { useEffect } from 'react';

export default function TokenRefresher() {
  useEffect(() => {
    const checkToken = async () => {
      let accessToken = document.cookie.split('; ').find(row => row.startsWith('access_token='));

      if (accessToken) {
        let tokenValue = accessToken.split('=')[1];
        let decodeToken = parseJwt(tokenValue);
        let tokenExpiry = decodeToken.exp * 1000; // Giả sử token là JWT và có trường `exp`
        let timeLeft = tokenExpiry - Date.now();
        if (timeLeft < 60 * 60 * 1000) {
          const response = await fetch('/api/auth/refresh-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'id': decodeToken._id,
            },
          });
          if (response.ok) {
            const data = await response.json();
            document.cookie = `access_token=${data.access_token}; path=/;`;
            document.cookie = `refresh_token=${data.refresh_token}; path=/;`;
            accessToken = `access_token=${data.access_token}`;
          }
        }
      }
    };

    const intervalId = setInterval(() => checkToken(), 30 * 60 * 1000); // Kiểm tra mỗi 30 m
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
