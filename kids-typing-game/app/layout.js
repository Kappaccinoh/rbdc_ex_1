import './globals.css';
import Navbar from './components/Navbar';

export const metadata = {
    title: 'Typing Adventure 🚀',
    description: 'Learn typing while having fun!',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
                <Navbar />
                {children}
            </body>
        </html>
    );
}
