import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = request.headers.get("id") || searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Thiếu tham số 'id'" },
        { status: 400 }
      );
    }
    const response = await fetch(`${process.env.URL_BACKEND}/v1/thumbnail/get/${id}`);
    const thumbnail = await response.json();

    return NextResponse.json(thumbnail, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || "Đã xảy ra lỗi không mong muốn" },
      { status: 500 }
    );
  }
}