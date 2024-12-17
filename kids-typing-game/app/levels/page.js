'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LevelsPage() {
    const [levels, setLevels] = useState([]);
    const [currentLevel, setCurrentLevel] = useState(null);
    const [levelContent, setLevelContent] = useState('');
    const [isLevelStarted, setIsLevelStarted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchLevels = async () => {
            try {
                const response = await fetch('/api/levels', {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) throw new Error('Failed to fetch levels');
                const data = await response.json();
                setLevels(data);
            } catch (error) {
                console.error('Error fetching levels:', error);
            }
        };

        fetchLevels();
    }, []);

    const fetchLevel = async (levelId) => {
        try {
            const response = await fetch(`/api/levels/${levelId}/`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) throw new Error('Failed to fetch level');
            const data = await response.json();
            setCurrentLevel(levelId);
            setLevelContent(data.challenge_text);
            setIsLevelStarted(true);
        } catch (error) {
            console.error('Error fetching level:', error);
        }
    };

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-4xl font-bold text-center mb-8 text-amber-800">Levels</h1>
            {isLevelStarted ? (
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4 text-amber-700">Level {currentLevel}</h2>
                    <p className="mb-4 text-gray-600">{levelContent}</p>
                    {/* Add typing area and timer here */}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {levels.map((level) => (
                        <div key={level.id} className="bg-white shadow-lg rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-2 text-amber-700">{level.name}</h2>
                            <p className="text-gray-600 mb-4">Difficulty: {level.difficulty}</p>
                            <button
                                onClick={() => fetchLevel(level.id)}
                                className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition-colors"
                            >
                                Start Level
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
