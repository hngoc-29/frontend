import {
  NextResponse
} from 'next/server';
export async function POST(req) {
  const response = NextResponse.json({ message: 'Đăng xuất thành công' });
  response.cookies.set('access_token', '', { path: '/', maxAge: 0 });
  response.cookies.set('refresh_token', '', { path: '/', maxAge: 0 });
  return response;
}