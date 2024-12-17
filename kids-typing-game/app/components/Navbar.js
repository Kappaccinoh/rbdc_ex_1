'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
    const [streak, setStreak] = useState(0);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    // Check if we're on auth pages
    const isAuthPage = pathname === '/login' || pathname === '/signup';

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/profile/', {
                    credentials: 'include',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setIsAuthenticated(true);
                    // Only fetch streak if authenticated
                    const streakResponse = await fetch('/api/streak', {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                    });
                    const streakData = await streakResponse.json();
                    setStreak(streakData.currentStreak);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Failed to check auth status:', error);
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    return (
        <nav className="bg-beige-100 shadow-md p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-lg font-bold">
                    Typing Adventure
                </Link>
                
                {isAuthenticated ? (
                    <>
                        <div className="bg-amber-100 px-4 py-2 rounded-full flex items-center gap-2">
                            <span className="text-amber-600">🔥</span>
                            <span className="font-semibold text-amber-800">{streak} daily streak</span>
                        </div>

                        <ul className="flex space-x-4 items-center">
                            <li>
                                <Link href="/levels" legacyBehavior>
                                    <a className="hover:text-amber-600">Levels</a>
                                </Link>
                            </li>
                            <li>
                                <Link href="/achievements" legacyBehavior>
                                    <a className="hover:text-amber-600">Achievements</a>
                                </Link>
                            </li>
                            <li>
                                <Link href="/profile" legacyBehavior>
                                    <a className="hover:text-amber-600">My Profile</a>
                                </Link>
                            </li>
                        </ul>
                    </>
                ) : !isAuthPage && (
                    <ul className="flex space-x-4 items-center">
                        <li>
                            <Link href="/login">
                                <button className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition-colors">
                                    Login
                                </button>
                            </Link>
                        </li>
                    </ul>
                )}
            </div>
        </nav>
    );
}
