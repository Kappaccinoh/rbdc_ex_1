import './globals.css';
import Navbar from './components/Navbar';

export const metadata = {
    title: 'Kids Typing Game',
    description: 'A fun typing game for kids to improve their typing skills!',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="bg-gray-50">
                <Navbar />
                <main className="container mx-auto p-6">{children}</main>
            </body>
        </html>
    );
}
