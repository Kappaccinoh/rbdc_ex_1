'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const [streak, setStreak] = useState(0);
    
    useEffect(() => {
        const fetchStreak = async () => {
            try {
                const response = await fetch('/api/streak');
                const data = await response.json();
                setStreak(data.currentStreak);
            } catch (error) {
                console.error('Failed to fetch streak:', error);
            }
        };

        fetchStreak();
    }, []);

    return (
        <nav className="bg-beige-100 shadow-md p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-lg font-bold">Typing Adventure</h1>
                
                <div className="bg-amber-100 px-4 py-2 rounded-full flex items-center gap-2">
                    <span className="text-amber-600">🔥</span>
                    <span className="font-semibold text-amber-800">{streak} daily streak</span>
                </div>

                <ul className="flex space-x-4">
                    <li>
                        <Link href="/" legacyBehavior>
                            <a className="hover:text-amber-600">Home</a>
                        </Link>
                    </li>
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
            </div>
        </nav>
    );
}
