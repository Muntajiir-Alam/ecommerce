import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
    return (
        <div className="flex min-h-screen items-center justify-center py-12">
            <div className="w-full max-w-sm space-y-6">
                <h1 className="text-2xl font-bold text-center">Create an account</h1>
                <RegisterForm />
            </div>
        </div>
    );
}