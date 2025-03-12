export async function GET(request) {
    try {
        // Logic để khởi động máy chủ
        console.log('Khởi động máy chủ...');
        const response = await fetch(`${process.env.URL_BACKEND}/v1/start-server`, { method: 'HEAD' });
        if (!response.ok) {
            console.error('Không thể khởi động máy chủ');
            return new Response('Không thể khởi động máy chủ', { status: 500 });
        }
        return new Response('Máy chủ đã khởi động', { status: 200 });
    } catch (error) {
        console.error('Lỗi khi khởi động máy chủ:', error);
        return new Response('Không thể khởi động máy chủ', { status: 500 });
    }
}
