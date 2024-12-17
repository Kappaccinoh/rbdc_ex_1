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
        <div>
            <h1>Levels</h1>
            {isLevelStarted ? (
                <div>
                    <h2>Level {currentLevel}</h2>
                    <p>{levelContent}</p>
                </div>
            ) : (
                <div>
                    {levels.map((level) => (
                        <div key={level.id}>
                            <h2>{level.name}</h2>
                            <button onClick={() => fetchLevel(level.id)}>Start Level</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
