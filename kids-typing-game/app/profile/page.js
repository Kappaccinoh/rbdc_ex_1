'use client';

import { useState, useEffect } from 'react';

export default function ProfilePage() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const [profileRes, progressRes, achievementsRes] = await Promise.all([
                    fetch('/api/profile'),
                    fetch('/api/progress'),
                    fetch('/api/achievements')
                ]);

                if (!profileRes.ok || !progressRes.ok || !achievementsRes.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const [profile, progress, achievements] = await Promise.all([
                    profileRes.json(),
                    progressRes.json(),
                    achievementsRes.json()
                ]);

                setUserData({ profile, progress, achievements });
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) return <div className="text-center p-8">Loading profile...</div>;
    if (error) return <div className="text-center text-red-500 p-8">Error: {error}</div>;
    if (!userData) return <div className="text-center p-8">No user data found</div>;

    const { profile, progress, achievements } = userData;

    return (
        <div className="container mx-auto p-8">
            {/* User Info Section */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <div className="bg-amber-100 p-4 rounded-full">
                        <span className="text-2xl">
                            {profile.is_guest ? '👾' : '👤'}
                        </span>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-amber-800">
                            {profile.username}
                        </h1>
                        <p className="text-gray-600">
                            {profile.is_guest ? 'Guest User' : 'Registered User'}
                        </p>
                    </div>
                </div>
                {profile.is_guest && (
                    <div className="bg-amber-50 p-4 rounded-lg mb-4">
                        <p className="text-sm text-amber-800">
                            👋 You're playing as a guest. 
                            <a href="/register" className="text-amber-600 hover:underline ml-1">
                                Register an account
                            </a> to save your progress permanently!
                        </p>
                    </div>
                )}
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-amber-800 mb-2">Typing Speed</h3>
                    <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-amber-600">
                            {Math.round(progress.averageWPM)}
                        </span>
                        <span className="ml-2 text-gray-600">WPM</span>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-amber-800 mb-2">Accuracy</h3>
                    <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-amber-600">
                            {Math.round(progress.averageAccuracy)}%
                        </span>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-amber-800 mb-2">Daily Streak</h3>
                    <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-amber-600">
                            {profile.current_streak}
                        </span>
                        <span className="ml-2 text-gray-600">days 🔥</span>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-xl font-bold text-amber-800 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                    {progress.recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center justify-between border-b pb-4">
                            <div>
                                <h4 className="font-semibold text-amber-700">{activity.levelName}</h4>
                                <p className="text-sm text-gray-600">{activity.date}</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="text-right">
                                    <span className="block font-semibold text-amber-600">
                                        {activity.wpm} WPM
                                    </span>
                                    <span className="text-sm text-gray-600">Speed</span>
                                </div>
                                <div className="text-right">
                                    <span className="block font-semibold text-amber-600">
                                        {activity.accuracy}%
                                    </span>
                                    <span className="text-sm text-gray-600">Accuracy</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Latest Achievements */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-amber-800 mb-4">Recent Achievements</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {achievements.flatMap(category => 
                        category.achievements
                            .filter(a => a.unlocked)
                            .slice(0, 4)
                            .map(achievement => (
                                <div key={achievement.title} className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                                    <span className="text-2xl">{achievement.icon}</span>
                                    <div>
                                        <h4 className="font-semibold text-amber-800">{achievement.title}</h4>
                                        <p className="text-sm text-gray-600">{achievement.description}</p>
                                    </div>
                                </div>
                            ))
                    )}
                </div>
            </div>
        </div>
    );
} 