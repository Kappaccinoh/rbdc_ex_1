export default function Achievements() {
    const achievements = [
        { id: 1, name: 'First Typing Test', unlocked: true },
        { id: 2, name: 'Daily Streak Master', unlocked: false },
    ];

    return (
        <main className="p-6">
            <h1 className="text-2xl font-bold mb-4">Achievements</h1>
            <div className="grid grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                    <div
                        key={achievement.id}
                        className={`p-4 rounded-lg ${
                            achievement.unlocked ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500'
                        }`}
                    >
                        <h2>{achievement.name}</h2>
                    </div>
                ))}
            </div>
        </main>
    );
}
