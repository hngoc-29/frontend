import { cookies } from 'next/headers';

export async function DELETE(request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');
    const accessToken = (await cookies()).get('access_token')?.value;
    if (!accessToken) {
        return new Response(JSON.stringify({ error: 'Không có quyền truy cập' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const response = await fetch(`${process.env.URL_BACKEND}/v1/user/delete/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            return new Response(JSON.stringify({ message: 'Xóa người dùng thành công' }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } else if (response.status === 404) {
            return new Response(JSON.stringify({ error: 'Không tìm thấy người dùng' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        } else {
            return new Response(JSON.stringify({ error: 'Xóa người dùng thất bại' }), {
                status: response.status,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    } catch (error) {
        console.error('Xóa người dùng thất bại', error);
        return new Response(JSON.stringify({ error: 'Xóa người dùng thất bại' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
