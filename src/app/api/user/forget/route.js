import {
  NextResponse
} from 'next/server';
export async function POST(req) {
  const { email } = await req.json();
  const response = await fetch(`${process.env.URL_BACKEND}/v1/auth/reset?email=${email}`, {
    method: 'POST'
  });
  const data = await response.json();
  const res = NextResponse.json(data, {
    status: 200
  });
  return res;
}