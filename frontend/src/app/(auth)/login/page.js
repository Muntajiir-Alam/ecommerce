import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-sm space-y-6">
                <h1 className="text-2xl font-bold text-center">Login</h1>
                <LoginForm />
            </div>
        </div>
    );
}