import Link from 'next/link';

export default function LevelsPage() {
    const levels = [
        {
            id: 1,
            title: "Home Row Heroes",
            description: "Master the home row keys (asdf jkl;)",
            difficulty: "Beginner",
            unlocked: true
        },
        {
            id: 2,
            title: "Top Row Explorers",
            description: "Discover the top row keys (qwerty)",
            difficulty: "Beginner",
            unlocked: true
        },
        {
            id: 3,
            title: "Bottom Row Quest",
            description: "Conquer the bottom row (zxcvbnm)",
            difficulty: "Intermediate",
            unlocked: false
        },
        {
            id: 4,
            title: "Number Ninja",
            description: "Practice with numbers (1234567890)",
            difficulty: "Intermediate",
            unlocked: false
        }
    ];

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-4xl font-bold text-amber-800 mb-8 text-center">Choose Your Adventure!</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {levels.map((level) => (
                    <div 
                        key={level.id}
                        className={`p-6 rounded-lg shadow-lg ${
                            level.unlocked 
                                ? 'bg-white cursor-pointer hover:scale-105 transition-transform' 
                                : 'bg-gray-100 opacity-75'
                        }`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-xl font-bold text-amber-800">{level.title}</h2>
                            {!level.unlocked && (
                                <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                                    🔒 Locked
                                </span>
                            )}
                        </div>
                        <p className="text-amber-900 mb-4">{level.description}</p>
                        <div className="flex justify-between items-center">
                            <span className={`text-sm ${
                                level.difficulty === 'Beginner' ? 'text-green-600' : 'text-orange-600'
                            }`}>
                                {level.difficulty}
                            </span>
                            {level.unlocked && (
                                <button className="bg-amber-600 text-white px-4 py-2 rounded-md text-sm hover:bg-amber-700 transition-colors">
                                    Start Level
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
