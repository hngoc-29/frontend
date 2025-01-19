import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function PUT(req) {
  const { id, passIn, password } = await req.json();
  const cookieStore = cookies();
  const accessToken = cookieStore.get('access_token')?.value;
  console.log('accessToken:', accessToken, id);
  try {
    const response = await fetch(`${process.env.URL_BACKEND}/v1/user/update-password/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ passIn, password }),
    });

    if (!response.ok) {
      console.error('Error updating password:', response);
      const errorData = await response.json();
      return NextResponse.json({ message: errorData.message }, { status: response.status });
    }

    const responseData = await response.json();
    console.log('Password updated:', responseData);
    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}