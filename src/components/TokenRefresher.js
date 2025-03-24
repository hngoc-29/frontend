'use client';
import { useEffect } from 'react';

async function refreshToken() {
  const response = await fetch('/api/auth/refresh-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (response.ok) {
    const data = await response.json();
    return `access_token=${data.access_token}`;
  }
  return null;
}

export async function checkToken() {
  const response = await fetch('/api/auth/check-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    const data = await response.json();
    if (data.refresh) {
      await refreshToken();
    }
  } else {
    console.error('Failed to check token:', response.statusText);
  }
}

export default function TokenRefresher() {
  useEffect(() => {
    checkToken();
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
