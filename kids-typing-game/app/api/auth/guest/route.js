export async function POST() {
    try {
        const response = await fetch('http://localhost:8000/api/auth/guest/', {
            method: 'POST',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to create guest session');
        }

        const data = await response.json();
        return Response.json(data);
    } catch (error) {
        return Response.json(
            { error: 'Failed to create guest session' },
            { status: 500 }
        );
    }
} 