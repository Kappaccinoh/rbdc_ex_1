export default function LevelDetail({ params }) {
    const { id } = params;

    const mockLevel = {
        name: `Level ${id}`,
        challenge: 'Type this sentence correctly.',
    };

    return (
        <main className="p-6">
            <h1 className="text-2xl font-bold mb-4">{mockLevel.name}</h1>
            <p className="mb-4">{mockLevel.challenge}</p>
            <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="Start typing..."
            />
        </main>
    );
}
