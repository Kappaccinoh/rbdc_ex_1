'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function LevelDetail({ params }) {
    const { id } = params;
    const router = useRouter();
    const [level, setLevel] = useState(null);
    const [userInput, setUserInput] = useState('');
    const [isCompleted, setIsCompleted] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [mistakes, setMistakes] = useState(0);
    const [progress, setProgress] = useState(0);
    const [countdown, setCountdown] = useState(3);
    const [isStarted, setIsStarted] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const timerRef = useRef(null);
    const textareaRef = useRef(null);

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

        if (id) {
            fetchLevel();
        }
    }, [id]);

    useEffect(() => {
        if (level && countdown > 0) {
            const timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);

            return () => clearInterval(timer);
        } else if (countdown === 0) {
            setIsStarted(true);
            setTimeout(() => {
                textareaRef.current?.focus();
            }, 100);
        }
    }, [countdown, level]);

    useEffect(() => {
        if (userInput.length === 1) {
            setStartTime(new Date());
        }
    }, [userInput]);

    useEffect(() => {
        if (isStarted && !isCompleted) {
            timerRef.current = setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000);
        }
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [isStarted, isCompleted]);

    const calculateWPM = () => {
        if (!startTime) return 0;
        const timeElapsed = (new Date() - startTime) / 1000 / 60; // in minutes
        const wordsTyped = userInput.trim().split(/\s+/).length;
        return Math.round(wordsTyped / timeElapsed);
    };

    const handleInputChange = (e) => {
        const newInput = e.target.value;
        setUserInput(newInput);

        // Calculate progress
        const targetText = level.challenge_text;
        const newProgress = (newInput.length / targetText.length) * 100;
        setProgress(Math.min(100, Math.round(newProgress)));

        // Calculate accuracy
        let mistakeCount = 0;
        for (let i = 0; i < newInput.length; i++) {
            if (newInput[i] !== targetText[i]) {
                mistakeCount++;
            }
        }
        setMistakes(mistakeCount);
        const newAccuracy = Math.max(0, Math.round(((newInput.length - mistakeCount) / newInput.length) * 100)) || 100;
        setAccuracy(newAccuracy);

        // Update WPM
        if (startTime) {
            setWpm(calculateWPM());
        }

        // Check completion
        if (newInput === targetText) {
            setIsCompleted(true);
        }
    };

    const handleTryAgain = () => {
        setUserInput('');
        setIsCompleted(false);
        setStartTime(null);
        setWpm(0);
        setAccuracy(100);
        setMistakes(0);
        setProgress(0);
        setElapsedTime(0);
        textareaRef.current?.focus();
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const CharacterDisplay = ({ targetText, userInput }) => {
        return (
            <div className="font-mono text-2xl leading-relaxed tracking-wide whitespace-pre-wrap">
                {targetText.split('').map((char, index) => {
                    let className = 'text-gray-400'; // Default: not typed yet
                    
                    if (index < userInput.length) {
                        // Character has been typed
                        if (userInput[index] === char) {
                            className = 'text-green-600'; // Correct
                        } else {
                            className = 'text-red-500 bg-red-100'; // Incorrect
                        }
                    } else if (index === userInput.length) {
                        className = 'text-gray-800 bg-amber-200 animate-pulse'; // Current character
                    }

                    return (
                        <span 
                            key={index} 
                            className={`${className} transition-colors duration-150`}
                        >
                            {char}
                        </span>
                    );
                })}
            </div>
        );
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
            <div className="container mx-auto p-8">
                {level ? (
                    <div className="max-w-4xl mx-auto">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h1 className="text-4xl font-bold text-amber-800 mb-2">{level.name}</h1>
                            <p className="text-gray-600">Complete the typing challenge below</p>
                        </div>

                        {!isStarted ? (
                            // Countdown overlay
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                <div className="bg-white rounded-2xl p-12 text-center">
                                    <h2 className="text-2xl font-bold text-amber-800 mb-4">Get Ready!</h2>
                                    <div className="text-6xl font-bold text-amber-600 animate-pulse">
                                        {countdown}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Stats Bar */}
                                <div className="grid grid-cols-4 gap-4 mb-8">
                                    <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                                        <div className="text-amber-600 text-3xl font-bold mb-1">
                                            {formatTime(elapsedTime)}
                                        </div>
                                        <div className="text-gray-600 text-sm">Time</div>
                                    </div>
                                    <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                                        <div className="text-amber-600 text-3xl font-bold mb-1">{wpm}</div>
                                        <div className="text-gray-600 text-sm">WPM</div>
                                    </div>
                                    <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                                        <div className="text-amber-600 text-3xl font-bold mb-1">{accuracy}%</div>
                                        <div className="text-gray-600 text-sm">Accuracy</div>
                                    </div>
                                    <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                                        <div className="text-amber-600 text-3xl font-bold mb-1">{progress}%</div>
                                        <div className="text-gray-600 text-sm">Progress</div>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
                                    <div 
                                        className="bg-amber-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>

                                {/* Challenge Text Display */}
                                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                                    <CharacterDisplay 
                                        targetText={level.challenge_text} 
                                        userInput={userInput}
                                    />
                                </div>

                                {/* Typing Area */}
                                <div className="relative min-h-[200px]">
                                    <textarea
                                        ref={textareaRef}
                                        className="opacity-0 absolute inset-0 h-1 w-full cursor-default"
                                        value={userInput}
                                        onChange={handleInputChange}
                                        disabled={isCompleted}
                                        autoFocus
                                    />
                                    
                                    {/* Completion Message */}
                                    {isCompleted && (
                                        <div className="absolute inset-0 bg-white rounded-xl shadow-lg p-8">
                                            <div className="text-center">
                                                <div className="text-4xl mb-4">🎉</div>
                                                <h2 className="text-2xl font-bold text-green-600 mb-4">
                                                    Level Completed!
                                                </h2>
                                                <div className="flex gap-4 justify-center">
                                                    <button
                                                        onClick={handleTryAgain}
                                                        className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                                                    >
                                                        Try Again
                                                    </button>
                                                    <button
                                                        onClick={() => router.push('/levels')}
                                                        className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                                                    >
                                                        Back to Levels
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="flex justify-center items-center min-h-[60vh]">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading level...</p>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
