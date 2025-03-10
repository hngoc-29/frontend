import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
const BACKEND_SERVER_URL = `${process.env.URL_BACKEND}/v1/thumbnail`;

export async function GET(request) {
    const accessToken = (await cookies()).get('access_token')?.value;
    const response = await fetch(BACKEND_SERVER_URL, {
        headers: {
            'Authorization': accessToken,
        },
    });
    const data = await response.json();

    return new NextResponse(JSON.stringify(data), { status: response.status });
}

export async function POST(request) {
    const accessToken = (await cookies()).get('access_token')?.value;
    const formData = await request.formData();
    const response = await fetch(`${BACKEND_SERVER_URL}/create`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
    });

    const result = await response.json();
    return new NextResponse(JSON.stringify(result), { status: response.status });
}

export async function PUT(request) {
    const accessToken = (await cookies()).get('access_token')?.value;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const formData = await request.formData();

    const response = await fetch(`${BACKEND_SERVER_URL}/update/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
    });

    const result = await response.json();
    return new NextResponse(JSON.stringify(result), { status: response.status });
}

export async function DELETE(request) {
    const accessToken = (await cookies()).get('access_token')?.value;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    console.log('access', accessToken);
    const response = await fetch(`${BACKEND_SERVER_URL}/delete/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    });

    const result = await response.json();
    return new NextResponse(JSON.stringify(result), { status: response.status });
}
