'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LevelDetail({ params }) {
    const { id } = params;
    const [level, setLevel] = useState(null);
    const [userInput, setUserInput] = useState('');
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        const fetchLevel = async () => {
            try {
                const response = await fetch(`/api/levels/${id}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) throw new Error('Failed to fetch level');
                const data = await response.json();
                setLevel(data);
            } catch (error) {
                console.error('Error fetching level:', error);
            }
        };

        fetchLevel();
    }, [id]);

    const handleInputChange = (e) => {
        setUserInput(e.target.value);
        if (e.target.value === level.challenge_text) {
            setIsCompleted(true);
        }
    };

    return (
        <main className="container mx-auto p-8">
            {level ? (
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4 text-amber-800">{level.name}</h1>
                    <p className="text-gray-600 mb-8">{level.challenge_text}</p>
                    <textarea
                        className="w-full p-4 border rounded-md"
                        rows="5"
                        value={userInput}
                        onChange={handleInputChange}
                        placeholder="Start typing here..."
                    />
                    {isCompleted && <p className="text-green-600 mt-4">Challenge Completed!</p>}
                </div>
            ) : (
                <p className="text-center text-gray-500">Loading level...</p>
            )}
        </main>
    );
}
