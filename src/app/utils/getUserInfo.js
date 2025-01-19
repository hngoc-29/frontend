// utils/getUserInfo.js

export async function getUserInfo() {
    try {
        const response = await fetch(`/api/user/get-user`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user info');
        }

        const userInfo = await response.json();
        return userInfo;
    } catch (error) {
        console.error('Error fetching user info:', error);
        throw error;
    }
}
