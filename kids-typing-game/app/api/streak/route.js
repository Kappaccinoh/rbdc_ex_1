export async function GET() {
    try {
        // TODO: Replace with actual database call
        const mockStreak = {
            currentStreak: 5,
            lastPlayed: new Date().toISOString(),
            bestStreak: 7
        };

        return Response.json(mockStreak);
    } catch (error) {
        return Response.json(
            { error: 'Failed to fetch streak data' },
            { status: 500 }
        );
    }
} 