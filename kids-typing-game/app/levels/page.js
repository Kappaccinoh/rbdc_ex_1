import Link from 'next/link';

export default function Levels() {
    const levels = [
        { id: 1, name: 'Level 1', difficulty: 'Easy' },
        { id: 2, name: 'Level 2', difficulty: 'Medium' },
    ];

    return (
        <main className="p-6">
            <h1 className="text-2xl font-bold mb-4">Game Levels</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {levels.map((level) => (
                    <Link key={level.id} href={`/levels/${level.id}`}>
                        <a className="block p-4 border rounded-lg hover:shadow-lg">
                            <h2 className="font-semibold">{level.name}</h2>
                            <p className="text-sm text-gray-600">Difficulty: {level.difficulty}</p>
                        </a>
                    </Link>
                ))}
            </div>
        </main>
    );
}
