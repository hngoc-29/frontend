import {
  NextResponse
} from 'next/server';
export async function POST(req) {
  const { token, password } = await req.json();
  console.log('check pass', password)
  const response = await fetch(`${process.env.URL_BACKEND}/v1/auth/newpass`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ password })
  });
  const data = await response.json();
  const res = NextResponse.json(data, {
    status: response.status
  });
  return res;
}