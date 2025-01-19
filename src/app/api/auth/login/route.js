import {
  NextResponse
} from 'next/server';
export async function POST(req) {
  const {
    email,
    password
  } = await req.json();
  try {
    if (password?.length < 6) {
      const res = NextResponse.json({
        success: false,
        message: 'Email hoặc mật khẩu sai'
      }, {
        status: 401
      });
      return res;
    }
    const bodyData = {
      email,
      passIn: password
    }
    const response = await fetch(
      process.env.URL_BACKEND + '/v1/auth/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyData),
      });
    const data = await response.json();
    if (!data.success) {
      const res = NextResponse.json(data, {
        status: response.status
      });
      return res;
    }
    const {
      access_token,
      refresh_token,
      user
    } = data;
    const res = NextResponse.json(user, {
      status: 200
    });
    res.cookies.set('access_token', access_token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
    res.cookies.set('refresh_token', refresh_token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
    return res;
  } catch (error) {
    return NextResponse.json({
      success: false, message: error
    }, {
      status: 401
    });
  }
}