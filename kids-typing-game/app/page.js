import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen p-8 flex flex-col items-center justify-center">
      <div className="max-w-3xl text-center space-y-6">
        <h1 className="text-5xl font-bold text-amber-800 mb-6">
          Welcome to Typing Adventure! 🚀
        </h1>
        
        <p className="text-xl text-amber-900 mb-8">
          Learn to type faster and better while having fun with exciting games and challenges!
        </p>

        <div className="space-y-4">
          <Link 
            href="/levels" 
            className="inline-block bg-amber-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-amber-700 transition-colors"
          >
            Start Playing
          </Link>
          
          <div className="flex justify-center gap-8 mt-12">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-amber-800">🎮 Fun Games</h3>
              <p className="text-amber-900">Multiple exciting levels</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-amber-800">🏆 Achievements</h3>
              <p className="text-amber-900">Earn rewards as you improve</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-amber-800">📈 Track Progress</h3>
              <p className="text-amber-900">See your improvement</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
