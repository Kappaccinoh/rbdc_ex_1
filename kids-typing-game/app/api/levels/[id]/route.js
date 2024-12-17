import { NextResponse } from 'next/server';

export async function GET(request) {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    try {
        const response = await fetch(`http://localhost:8000/api/levels/${id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: 'Level not found' }, 
                { status: response.status }
            );
        }

        const level = await response.json();
        return NextResponse.json(level);
    } catch (error) {
        console.error('Error fetching level:', error);
        return NextResponse.json(
            { error: 'Failed to fetch level' }, 
            { status: 500 }
        );
    }
}