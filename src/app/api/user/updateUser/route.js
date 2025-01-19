import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function PUT(req) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  const formData = await req.formData();
  const id = formData.get('id');

  try {
    const response = await fetch(`${process.env.URL_BACKEND}/v1/user/update/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ message: errorData.message }, { status: response.status });
    }

    const responseData = await response.json();
    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}