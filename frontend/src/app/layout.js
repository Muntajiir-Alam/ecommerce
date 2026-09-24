import ReduxProvider from '@/providers/ReduxProvider';
import QueryProvider from '@/providers/QueryProvider';
import AuthInitializer from '@/components/auth/AuthInitializer';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <Toaster />
                <ReduxProvider>
                    <QueryProvider>
                        <AuthInitializer>{children}</AuthInitializer>
                    </QueryProvider>
                </ReduxProvider>
            </body>
        </html>
    );
}