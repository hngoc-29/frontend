import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = request.headers.get("id") || searchParams.get("id");
  if (!id || id === `all`) {
    return NextResponse.json(
      { error: "Thiếu tham số 'id'" },
      { status: 400 }
    );
  }
  const response = await fetch(`${process.env.URL_BACKEND}/v1/thumbnail/get/${id}`);
  const thumbnail = await response.json();

  return NextResponse.json(thumbnail, { status: response.status });
}