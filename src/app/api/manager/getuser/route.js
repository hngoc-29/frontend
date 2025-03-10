import { cookies } from 'next/headers';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const page = await searchParams.get('page');
    const limit = await searchParams.get('limit');
    const accessToken = (await cookies()).get('access_token')?.value;
    if (!accessToken) {
        return new Response(JSON.stringify({ error: 'Không có quyền truy cập' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const response = await fetch(`${process.env.URL_BACKEND}/v1/user/users?page=${page}&limit=${limit}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        return new Response(JSON.stringify({
            users: data.user,
            totalUsers: data.totalUsers
        }), {
            status: response.status,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Không thể lấy dữ liệu người dùng', error);
        return new Response(JSON.stringify({ error: 'Không thể lấy dữ liệu người dùng' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
