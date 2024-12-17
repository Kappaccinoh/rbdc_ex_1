'use client';

import { useState, useEffect } from 'react';

export default function ProgressPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/progress');
                if (!response.ok) {
                    throw new Error('Failed to fetch progress stats');
                }
                const data = await response.json();
                setStats(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <div className="text-center p-8">Loading progress...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 p-8">Error: {error}</div>;
    }

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-4xl font-bold text-amber-800 mb-8 text-center">Your Progress</h1>

            {/* Overall Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-amber-800 mb-2">Average Speed</h3>
                    <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-amber-600">{stats.averageWPM}</span>
                        <span className="ml-2 text-gray-600">WPM</span>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-amber-800 mb-2">Accuracy</h3>
                    <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-amber-600">{stats.averageAccuracy}%</span>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-amber-800 mb-2">Levels Completed</h3>
                    <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-amber-600">{stats.levelsCompleted}</span>
                        <span className="ml-2 text-gray-600">/ {stats.totalLevels}</span>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold text-amber-800 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                    {stats.recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center justify-between border-b pb-4">
                            <div>
                                <h4 className="font-semibold text-amber-700">{activity.levelName}</h4>
                                <p className="text-sm text-gray-600">{activity.date}</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="text-right">
                                    <span className="block font-semibold text-amber-600">{activity.wpm} WPM</span>
                                    <span className="text-sm text-gray-600">Speed</span>
                                </div>
                                <div className="text-right">
                                    <span className="block font-semibold text-amber-600">{activity.accuracy}%</span>
                                    <span className="text-sm text-gray-600">Accuracy</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Improvement Chart */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-amber-800 mb-4">Weekly Progress</h2>
                <div className="h-64">
                    {/* We can add a chart library like Chart.js here */}
                    <div className="flex items-center justify-center h-full text-gray-500">
                        Coming soon: Progress chart visualization
                    </div>
                </div>
            </div>
        </div>
    );
}
