// app/api/user-info/route.js
import {
  NextResponse
} from 'next/server';
export async function GET(request) {
  try {
    // Gọi API bên ngoài để lấy thông tin người dùng
    const response = await fetch(`${process.env.URL_BACKEND}/v1/thumbnail`);
    const thumbnail = await response.json();
    if (!thumbnail.success) {
      return NextResponse.json({
        error: thumbnail
      }, {
        status: response.status
      });
    }
    return NextResponse.json(thumbnail);
  } catch (error) {
    return NextResponse.json({
      error: error?.message
    }, {
      status: 500
    });
  }
}