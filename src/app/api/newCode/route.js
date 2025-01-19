import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req) {
  const { id } = await req.json();
  const cookieStore = await cookies();
  const accessToken = await cookieStore.get('access_token')?.value;

  try {
    const response = await fetch(`http://localhost:8080/v1/auth/code/${id}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ message: errorData.message }, { status: response.status });
    }

    const responseData = await response.json();
    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error('Error generating new code:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}