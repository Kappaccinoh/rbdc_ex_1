export async function GET() {
    try {
        const response = await fetch('http://localhost:8000/api/achievements/', {
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
            },
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch achievements');
        }

        const data = await response.json();
        return Response.json(data);
    } catch (error) {
        console.error('Achievement fetch error:', error);
        return Response.json(
            { error: 'Failed to fetch achievements' },
            { status: 500 }
        );
    }
} 