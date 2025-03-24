import { cookies } from 'next/headers';

export async function POST(request) {
    const cookieStore = await cookies();
    const accessToken = await cookieStore.get('access_token')?.value;
    const refreshToken = await cookieStore.get('refresh_token')?.value;

    if (!accessToken && refreshToken) {
        return new Response(JSON.stringify({ refresh: true }), { status: 200 });
    }

    if (accessToken) {
        const decodeToken = parseJwt(accessToken);
        const tokenExpiry = decodeToken.exp * 1000;
        const timeLeft = tokenExpiry - Date.now();
        if (timeLeft < 60 * 60 * 1000) {
            return new Response(JSON.stringify({ refresh: true }), { status: 200 });
        }
    }

    return new Response(JSON.stringify({ refresh: false }), { status: 200 });
}

// Hàm để parse JWT và lấy thời gian hết hạn
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(decodeURIComponent(atob(base64).split('').map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`).join('')));
    } catch (e) {
        return null;
    }
}
