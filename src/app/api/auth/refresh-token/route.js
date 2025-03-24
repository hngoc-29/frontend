import { cookies } from 'next/headers';

export async function POST(request) {
  const cookieStore = await cookies();
  const refreshToken = await cookieStore.get('refresh_token')?.value;
  console.log(refreshToken);
  if (!refreshToken) {
    return new Response(JSON.stringify({ error: 'Không có refresh Token' }), { status: 401 });
  }
  // Gửi yêu cầu làm mới token tới API bên ngoài
  const response = await fetch(`${process.env.URL_BACKEND}/v1/auth/refresh/${request.headers.get('id')}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!response.ok) {
    const res = await response.json();
    return new Response(JSON.stringify(res), { status: response.status });
  }

  const newTokens = await response.json();

  // Lưu lại các token mới vào cookie
  cookieStore.set('access_token', newTokens.access_token, { httpOnly: false, path: '/', maxAge: 60 * 60 * 24 });
  cookieStore.set('refresh_token', newTokens.refresh_token, { httpOnly: false, path: '/', maxAge: 7 * 60 * 60 * 24 });

  return new Response(JSON.stringify({ message: 'Refresh thành công', access_token: newTokens.access_token, refresh_token: newTokens.refresh_token }), { status: 200 });
}
