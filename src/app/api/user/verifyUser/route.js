import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req) {
  const { id, code } = await req.json();
  const cookieStore = cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  try {
    const response = await fetch(`http://localhost:8080/v1/auth/verify/${id}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ message: errorData.message }, { status: response.status });
    }

    const responseData = await response.json();
    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error('Error verifying user:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}