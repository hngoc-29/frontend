// utils/getUserInfo.js

export async function getUserInfo(userId) {
    try {
        const response = await fetch(`/api/user-info/${userId}`, {
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
