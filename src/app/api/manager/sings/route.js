import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
const BACKEND_SERVER_URL = `${process.env.URL_BACKEND}/v1/sing`;
const MAX_PAYLOAD_SIZE = 50 * 1024 * 1024; // 50MB

async function parseFormData(request) {
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > MAX_PAYLOAD_SIZE) {
        throw new Error('Payload Too Large');
    }
    return request.formData();
}

export const config = {
    api: {
        bodyParser: false, // Tắt parsing mặc định
    },
};

export async function GET(request) {
    const accessToken = (await cookies()).get('access_token')?.value;
    const { searchParams } = new URL(request.url);
    const parent = searchParams.get('parent');
    const plusview = request.headers.get('plusview');
    const response = await fetch(`${BACKEND_SERVER_URL}/get/${parent}?plusview=${plusview}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });
    if (response.status === 413) {
        return new NextResponse(JSON.stringify({ error: 'Dung lượng file quá lớn' }), { status: 413 });
    }
    const data = await response.json();
    return new NextResponse(JSON.stringify(data), { status: response.status });
}

export async function POST(request) {
    const accessToken = (await cookies()).get('access_token')?.value;

    try {
        // Dùng request.formData() nếu file nhỏ, hoặc parse thủ công nếu file lớn
        const formData = await request.formData();

        const response = await fetch(`${BACKEND_SERVER_URL}/create`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            body: formData, // Gửi nguyên formData
        });

        if (response.status === 413) {
            return new NextResponse(JSON.stringify({ error: 'Dung lượng file quá lớn' }), { status: 413 });
        }

        const result = await response.json();

        return new NextResponse(JSON.stringify(result), { status: response.status });
    } catch (error) {
        if (error.message === 'Payload Too Large') {
            return new NextResponse(JSON.stringify({ error: 'Dung lượng file quá lớn' }), { status: 413 });
        }

        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    }
}


export async function PUT(request) {
    const accessToken = (await cookies()).get('access_token')?.value;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return new NextResponse(JSON.stringify({ error: 'Thiếu ID' }), { status: 400 });
    }

    try {
        // Kiểm tra nếu request lớn thì cần parse formData
        const formData = await request.formData();

        const response = await fetch(`${BACKEND_SERVER_URL}/update/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            body: formData, // Gửi nguyên formData
        });

        if (response.status === 413) {
            return new NextResponse(JSON.stringify({ error: 'Dung lượng file quá lớn' }), { status: 413 });
        }

        const result = await response.json();
        return new NextResponse(JSON.stringify(result), { status: response.status });
    } catch (error) {
        if (error.message === 'Payload Too Large') {
            return new NextResponse(JSON.stringify({ error: 'Dung lượng file quá lớn' }), { status: 413 });
        }
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

export async function DELETE(request) {
    const accessToken = (await cookies()).get('access_token')?.value;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const response = await fetch(`${BACKEND_SERVER_URL}/delete/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    });

    if (response.status === 413) {
        return new NextResponse(JSON.stringify({ error: 'Dung lượng file quá lớn' }), { status: 413 });
    }

    const result = await response.json();
    return new NextResponse(JSON.stringify(result), { status: response.status });
}
