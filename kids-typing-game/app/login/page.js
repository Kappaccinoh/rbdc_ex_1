'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState('');
    const router = useRouter();

    // Check authentication status on mount
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
                
                if (response.ok && response.status === 200) {
                    const data = await response.json();
                    if (data.authenticated) {
                        // Only redirect if actually authenticated
                        router.push('/levels');
                    }
                }
            } catch (error) {
                console.error('Auth check failed:', error);
            }
        };

        checkAuth();
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:8000/api/auth/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                router.push('/profile');
            } else {
                const data = await response.json();
                setError(data.error || 'Login failed');
            }
        } catch (error) {
            setError('An error occurred during login');
        }
    };

    const handleGuestLogin = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/auth/guest/', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Guest login successful:', data);  // Debug log
                router.push('/levels');  // Redirect to levels page after guest login
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Guest login failed');
            }
        } catch (error) {
            console.error('Guest login error:', error);
            setError('An error occurred during guest login');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-orange-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold text-amber-800 mb-6 text-center">Welcome to Typing Adventure</h1>
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-2" htmlFor="username">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-amber-400"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-amber-400"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-amber-600 text-white py-2 rounded hover:bg-amber-700 transition-colors"
                    >
                        Log In
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <button
                        onClick={handleGuestLogin}
                        className="text-amber-600 hover:underline"
                    >
                        Continue as Guest
                    </button>
                </div>

                <div className="mt-6 text-center text-gray-600">
                    Don't have an account?{' '}
                    <Link href="/signup" className="text-amber-600 hover:underline">
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
} 