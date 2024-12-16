'use client';

import { useState, useEffect } from 'react';

export default function AchievementsPage() {
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAchievements = async () => {
            try {
                const response = await fetch('/api/achievements');
                if (!response.ok) {
                    throw new Error('Failed to fetch achievements');
                }
                const data = await response.json();
                setAchievements(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAchievements();
    }, []);

    if (loading) {
        return <div className="text-center p-8">Loading achievements...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 p-8">Error: {error}</div>;
    }

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-4xl font-bold text-amber-800 mb-8 text-center">Achievements</h1>
            
            <div className="space-y-8">
                {achievements.map((category) => (
                    <div key={category.id} className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-amber-700 mb-4">{category.category}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {category.achievements.map((achievement) => (
                                <div 
                                    key={achievement.title}
                                    className={`p-4 rounded-lg border-2 ${
                                        achievement.unlocked 
                                            ? 'border-amber-400 bg-amber-50' 
                                            : 'border-gray-200 bg-gray-50'
                                    }`}
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-2xl">{achievement.icon}</span>
                                        <h3 className="font-bold text-amber-800">
                                            {achievement.title}
                                        </h3>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3">
                                        {achievement.description}
                                    </p>
                                    <div className="relative pt-1">
                                        <div className="flex mb-2 items-center justify-between">
                                            <div>
                                                <span className="text-xs font-semibold inline-block text-amber-600">
                                                    {Math.round((achievement.progress / achievement.maxProgress) * 100)}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-amber-100">
                                            <div 
                                                style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-amber-500"
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
