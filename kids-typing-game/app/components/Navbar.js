import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="bg-beige-100 shadow-md p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-lg font-bold">Kids Typing Game</h1>
                <ul className="flex space-x-4">
                    <li>
                        <Link href="/" className="hover:text-blue-500">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link href="/levels" className="hover:text-blue-500">
                            Levels
                        </Link>
                    </li>
                    <li>
                        <Link href="/achievements" className="hover:text-blue-500">
                            Achievements
                        </Link>
                    </li>
                    <li>
                        <Link href="/progress" className="hover:text-blue-500">
                            Progress
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
