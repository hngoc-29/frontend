// app/api/user-info/route.js
import {
  NextResponse
} from 'next/server';
import {
  cookies
} from 'next/headers';

export async function GET(request) {
  // Sử dụng await khi gọi cookies()
  const accessToken = (await cookies()).get('access_token')?.value; // Lấy access token từ cookie
  if (!accessToken) {
    return NextResponse.json({
      error: 'Chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.'
    }, {
      status: 401
    });
  }

  try {
    // Gọi API bên ngoài để lấy thông tin người dùng
    const response = await fetch('http://localhost:8080/v1/user/info', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    // Trả về dữ liệu người dùng cho client
    const userInfo = await response.json();
    if (!userInfo.success) {
      return NextResponse.json({
        error: userInfo.message
      }, {
        status: response.status
      });
    }
    return NextResponse.json(userInfo.user);
  } catch (error) {
    console.error('Lỗi khi lấy thông tin người dùng:', error);
    return NextResponse.json({
      error: 'Lỗi hệ thống. Vui lòng thử lại sau.'
    }, {
      status: 500
    });
  }
}