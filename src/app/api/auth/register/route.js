import {
  NextResponse
} from 'next/server';
export async function POST(req) {
  const {
    fullname,
    username,
    email,
    password
  } = await req.json();
  try{
    if (password?.length < 6) {
      const res = NextResponse.json('Mật khẩu phải dài hơn 6 kí tự', {
      status: 401
    });
    return res;
    }
    const bodyData = {
      fullname,
      username,
      email,
      password,
    }
    const response = await fetch(
      'http://localhost:8080/v1/auth/register',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyData),
      });
      const data = await response.json();
      console.log(data)
      const res = NextResponse.json(data?.message, {
      status: response.status
    });
    return res;
  } catch(err) {
    console.log(err)
    return NextResponse.json({
      success: false, message: err
    }, {
      status: 500
    });
  };
}