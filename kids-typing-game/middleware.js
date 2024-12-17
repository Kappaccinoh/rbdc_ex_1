import { NextResponse } from 'next/server';

export async function middleware(request) {
    const protectedPaths = ['/levels', '/achievements', '/profile'];
    
    if (protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
        try {
            const response = await fetch('http://localhost:8000/api/profile/', {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                return NextResponse.redirect(new URL('/login', request.url));
            }

            // Try to parse the response
            try {
                await response.json();
            } catch (e) {
                return NextResponse.redirect(new URL('/login', request.url));
            }
            
        } catch (error) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: ['/levels/:path*', '/achievements/:path*', '/profile/:path*'],
}; 