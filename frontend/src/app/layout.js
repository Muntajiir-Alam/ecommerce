import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import ReduxProvider from '@/providers/ReduxProvider';
import QueryProvider from '@/providers/QueryProvider';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata = {
    title: 'E-Commerce',
    description: 'Modern ecommerce storefront',
};

export default function RootLayout({ children }) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
            <body className="flex min-h-full flex-col bg-gray-50 text-slate-900">
                <ReduxProvider>
                    <QueryProvider>
                        <Navbar />
                        <main className="flex-1">{children}</main>
                        <Footer />
                    </QueryProvider>
                </ReduxProvider>
            </body>
        </html>
    );
}
